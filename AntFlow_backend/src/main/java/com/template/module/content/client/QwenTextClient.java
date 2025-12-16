package com.template.module.content.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.template.common.logging.LlmApiLogger;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class QwenTextClient {

    private static final String DEFAULT_ENDPOINT = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    private static final String DEFAULT_MODEL = "qwen-plus";

    private final RestTemplate restTemplate;

    public QwenTextClient(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(20).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(180).toMillis());
        this.restTemplate = builder
            .requestFactory(() -> factory)
            .build();
    }

    public TextGenerationResult generate(TextGenerationRequest request) {
        if (!StringUtils.hasText(request.getPrompt())) {
            return TextGenerationResult.failure("Prompt is empty");
        }
        if (!StringUtils.hasText(request.getApiKey())) {
            return TextGenerationResult.failure("Qwen API key is missing");
        }
        String endpoint = StringUtils.hasText(request.getBaseUrl()) ? request.getBaseUrl() : DEFAULT_ENDPOINT;
        String model = StringUtils.hasText(request.getModel()) ? request.getModel() : DEFAULT_MODEL;
        Map<String, String> params = request.safeParams();

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "user", "content", request.getPrompt()));

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("messages", messages);
        payload.put("stream", false);

        Double temperature = TextGenerationParamHelper.getDouble(params, "temperature");
        if (temperature != null) {
            payload.put("temperature", temperature);
        }
        Double topP = TextGenerationParamHelper.getDouble(params, "top_p");
        if (topP != null) {
            payload.put("top_p", topP);
        }
        Integer maxTokens = TextGenerationParamHelper.getInt(params, "max_tokens");
        if (maxTokens != null) {
            payload.put("max_tokens", maxTokens);
        }
        Boolean enableThinking = TextGenerationParamHelper.getBoolean(params, "enable_thinking");
        if (enableThinking != null && enableThinking) {
            payload.put("enable_thinking", true);
        }

        Map<String, Object> logParams = new LinkedHashMap<>();
        logParams.put("temperature", payload.get("temperature"));
        logParams.put("top_p", payload.get("top_p"));
        logParams.put("max_tokens", payload.get("max_tokens"));
        logParams.put("enable_thinking", payload.get("enable_thinking"));
        LlmApiLogger.logRequest("Qwen", endpoint, model, request.getPrompt(), logParams);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(request.getApiKey());

        Map<String, String> headerLog = Map.of(
            "Content-Type", MediaType.APPLICATION_JSON_VALUE,
            "Authorization", "Bearer ****"
        );
        LlmApiLogger.logRawHttpRequest("Qwen", endpoint, headerLog, payload);

        try {
            ResponseEntity<QwenResponse> response = restTemplate.postForEntity(
                endpoint,
                new HttpEntity<>(payload, headers),
                QwenResponse.class
            );
            QwenResponse body = response.getBody();
            String content = body != null ? body.getFirstContent() : null;
            boolean success = StringUtils.hasText(content);
            LlmApiLogger.logResponse("Qwen", body, success);
            if (!success) {
                return TextGenerationResult.failure("Qwen response is empty");
            }
            return TextGenerationResult.success(content.trim());
        } catch (RestClientException ex) {
            log.error("Qwen API call failed: {}", ex.getMessage(), ex);
            LlmApiLogger.logResponse("Qwen", Map.of("error", ex.getMessage()), false);
            return TextGenerationResult.failure("Qwen API 调用失败");
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class QwenResponse {
        private List<Choice> choices;

        public String getFirstContent() {
            if (choices == null || choices.isEmpty()) {
                return null;
            }
            Choice first = choices.get(0);
            if (first == null || first.getMessage() == null) {
                return null;
            }
            return first.getMessage().getContent();
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Choice {
            private Message message;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Message {
            private String content;
        }
    }
}
