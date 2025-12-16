package com.template.module.content.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.template.common.logging.LlmApiLogger;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class DoubaoTextClient {

    private static final String DEFAULT_ENDPOINT = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
    private static final String DEFAULT_MODEL = "ep-general-v1";

    private final RestTemplate restTemplate;

    public DoubaoTextClient(RestTemplateBuilder builder) {
        this.restTemplate = builder
            .setConnectTimeout(Duration.ofSeconds(30))
            .setReadTimeout(Duration.ofSeconds(180))
            .build();
    }

    public TextGenerationResult generate(TextGenerationRequest request) {
        if (!StringUtils.hasText(request.getPrompt())) {
            return TextGenerationResult.failure("Prompt is empty");
        }
        if (!StringUtils.hasText(request.getApiKey())) {
            return TextGenerationResult.failure("Doubao API key is missing");
        }
        String endpoint = StringUtils.hasText(request.getBaseUrl()) ? request.getBaseUrl() : DEFAULT_ENDPOINT;
        String model = StringUtils.hasText(request.getModel()) ? request.getModel() : DEFAULT_MODEL;

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("messages", List.of(Map.of("role", "user", "content", request.getPrompt())));
        payload.put("stream", false);

        Map<String, String> params = request.safeParams();
        Double temperature = TextGenerationParamHelper.getDouble(params, "temperature");
        if (temperature != null) {
            payload.put("temperature", temperature);
        }
        Integer maxTokens = TextGenerationParamHelper.getInt(params, "max_tokens");
        if (maxTokens != null) {
            payload.put("max_tokens", maxTokens);
        }
        Integer maxCompletionTokens = TextGenerationParamHelper.getInt(params, "max_completion_tokens");
        if (maxCompletionTokens != null) {
            payload.put("max_completion_tokens", maxCompletionTokens);
        }
        String reasoningEffort = TextGenerationParamHelper.getString(params, "reasoning_effort");
        if (StringUtils.hasText(reasoningEffort)) {
            payload.put("reasoning_effort", reasoningEffort);
        }
        String thinkingType = TextGenerationParamHelper.getString(params, "thinking_type");
        if (StringUtils.hasText(thinkingType)) {
            payload.put("thinking", Map.of("type", thinkingType));
        }

        Map<String, Object> logParams = new LinkedHashMap<>(payload);
        logParams.remove("messages");
        LlmApiLogger.logRequest("Doubao", endpoint, model, request.getPrompt(), logParams);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(request.getApiKey());

        Map<String, String> loggedHeaders = Map.of(
            "Content-Type", MediaType.APPLICATION_JSON_VALUE,
            "Authorization", "Bearer ****"
        );
        LlmApiLogger.logRawHttpRequest("Doubao", endpoint, loggedHeaders, payload);

        try {
            ResponseEntity<DoubaoResponse> response = restTemplate.postForEntity(
                endpoint,
                new HttpEntity<>(payload, headers),
                DoubaoResponse.class
            );
            DoubaoResponse body = response.getBody();
            String content = body != null ? body.getFirstContent() : null;
            boolean success = StringUtils.hasText(content);
            LlmApiLogger.logResponse("Doubao", body, success);
            if (!success) {
                return TextGenerationResult.failure("Doubao response is empty");
            }
            return TextGenerationResult.success(content.trim());
        } catch (RestClientException ex) {
            log.error("Doubao API call failed: {}", ex.getMessage(), ex);
            LlmApiLogger.logResponse("Doubao", Map.of("error", ex.getMessage()), false);
            return TextGenerationResult.failure("Doubao API 调用失败");
        }
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class DoubaoResponse {
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
