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
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class GlmTextClient {

    private static final String DEFAULT_ENDPOINT = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    private static final String DEFAULT_MODEL = "glm-4.6";

    private final RestTemplate restTemplate;

    public GlmTextClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
            .setConnectTimeout(Duration.ofSeconds(20))
            .setReadTimeout(Duration.ofSeconds(180))
            .build();
    }

    public TextGenerationResult generate(TextGenerationRequest request) {
        if (!StringUtils.hasText(request.getPrompt())) {
            return TextGenerationResult.failure("Prompt is empty");
        }
        if (!StringUtils.hasText(request.getApiKey())) {
            return TextGenerationResult.failure("GLM API key is missing");
        }
        String endpoint = StringUtils.hasText(request.getBaseUrl()) ? request.getBaseUrl() : DEFAULT_ENDPOINT;
        String model = StringUtils.hasText(request.getModel()) ? request.getModel() : DEFAULT_MODEL;
        Map<String, String> params = request.safeParams();

        List<Map<String, String>> messages = new ArrayList<>();
        String systemPrompt = TextGenerationParamHelper.getString(params, "system_prompt");
        if (StringUtils.hasText(systemPrompt)) {
            messages.add(Map.of("role", "system", "content", systemPrompt));
        }
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
        String thinkingType = TextGenerationParamHelper.getString(params, "thinking_type");
        if (StringUtils.hasText(thinkingType)) {
            payload.put("thinking", Map.of("type", thinkingType));
        }

        Map<String, Object> logParams = new LinkedHashMap<>();
        logParams.put("temperature", payload.get("temperature"));
        logParams.put("top_p", payload.get("top_p"));
        logParams.put("max_tokens", payload.get("max_tokens"));
        logParams.put("thinking", payload.get("thinking"));
        LlmApiLogger.logRequest("GLM", endpoint, model, request.getPrompt(), logParams);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(request.getApiKey());

        Map<String, String> headerLog = Map.of(
            "Content-Type", MediaType.APPLICATION_JSON_VALUE,
            "Authorization", "Bearer ****"
        );
        LlmApiLogger.logRawHttpRequest("GLM", endpoint, headerLog, payload);

        try {
            ResponseEntity<GlmResponse> response = restTemplate.postForEntity(
                endpoint,
                new HttpEntity<>(payload, headers),
                GlmResponse.class
            );
            GlmResponse body = response.getBody();
            String content = body != null ? body.getFirstContent() : null;
            boolean success = StringUtils.hasText(content);
            LlmApiLogger.logResponse("GLM", body, success);
            if (!success) {
                return TextGenerationResult.failure("GLM response is empty");
            }
            return TextGenerationResult.success(content.trim());
        } catch (RestClientException ex) {
            log.error("GLM API call failed: {}", ex.getMessage(), ex);
            LlmApiLogger.logResponse("GLM", Map.of("error", ex.getMessage()), false);
            return TextGenerationResult.failure("GLM API 调用失败");
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GlmResponse {
        private List<Choice> choices;

        public String getFirstContent() {
            if (choices == null || choices.isEmpty()) {
                return null;
            }
            Choice first = choices.get(0);
            if (first == null || first.getMessage() == null) {
                return null;
            }
            String content = first.getMessage().getContent();
            if (!StringUtils.hasText(content)) {
                return first.getMessage().getReasoningContent();
            }
            return content;
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
            @com.fasterxml.jackson.annotation.JsonProperty("reasoning_content")
            private String reasoningContent;
        }
    }
}
