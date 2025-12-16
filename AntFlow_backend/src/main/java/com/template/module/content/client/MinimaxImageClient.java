package com.template.module.content.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.template.common.logging.LlmApiLogger;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Component
public class MinimaxImageClient {

    private static final String DEFAULT_ENDPOINT = "https://api.minimaxi.com/v1/image_generation";
    private static final String DEFAULT_MODEL = "image-01";
    private static final long DEFAULT_CONNECT_TIMEOUT = 30000;
    private static final long DEFAULT_READ_TIMEOUT = 120000;

    private final RestTemplate restTemplate;

    public MinimaxImageClient(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
            .setConnectTimeout(Duration.ofMillis(DEFAULT_CONNECT_TIMEOUT))
            .setReadTimeout(Duration.ofMillis(DEFAULT_READ_TIMEOUT))
            .build();
    }

    /**
     * 生成图片（支持文生图和图生图）
     *
     * @param prompt          提示词
     * @param aspectRatio     图片比例 (1:1, 16:9, 9:16 等)
     * @param subjectImageUrl 主体图URL（可选，用于图生图）
     * @param apiKey          API密钥
     * @param endpoint        API端点（可选）
     * @param model           模型名称（可选）
     * @return Base64编码的图片列表（Data URI格式）
     */
    public List<String> generateImages(String prompt, String aspectRatio, String subjectImageUrl,
                                        String apiKey, String endpoint, String model) {
        if (!StringUtils.hasText(apiKey)) {
            log.warn("MiniMax API key is not configured, skip remote call");
            return Collections.emptyList();
        }
        if (!StringUtils.hasText(prompt)) {
            log.warn("Prompt is empty, skip MiniMax call");
            return Collections.emptyList();
        }

        String actualEndpoint = StringUtils.hasText(endpoint) ? endpoint : DEFAULT_ENDPOINT;
        String actualModel = StringUtils.hasText(model) ? model : DEFAULT_MODEL;

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", actualModel);
        payload.put("prompt", prompt);
        payload.put("aspect_ratio", resolveAspectRatio(aspectRatio));
        payload.put("response_format", "base64");

        // 如果有主体图，添加 subject_reference（图生图）
        Map<String, Object> parameters = new HashMap<>();
        if (StringUtils.hasText(subjectImageUrl)) {
            Map<String, String> subjectRef = new HashMap<>();
            subjectRef.put("type", "character");
            subjectRef.put("image_file", subjectImageUrl);
            payload.put("subject_reference", List.of(subjectRef));
            parameters.put("subject_reference", "present");
            // 格式化日志输出，避免打印长base64数据
            String formattedImageUrl = formatImageUrlForLog(subjectImageUrl);
            log.info("MiniMax image-to-image mode with subject image: {}", formattedImageUrl);
        }

        // 记录API请求参数
        LlmApiLogger.logRequest("MiniMax", actualEndpoint, actualModel, prompt, parameters);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> loggedHeaders = new LinkedHashMap<>();
        loggedHeaders.put("Content-Type", MediaType.APPLICATION_JSON_VALUE);
        loggedHeaders.put("Authorization", "Bearer " + maskSecret(apiKey));
        LlmApiLogger.logRawHttpRequest("MiniMax", actualEndpoint, loggedHeaders, payload);

        try {
            ResponseEntity<MinimaxImageResponse> response = restTemplate.postForEntity(
                URI.create(actualEndpoint),
                new HttpEntity<>(payload, headers),
                MinimaxImageResponse.class
            );

            MinimaxImageResponse body = response.getBody();
            boolean success = body != null && body.getData() != null && !CollectionUtils.isEmpty(body.getData().getImageBase64());

            // 记录API响应
            LlmApiLogger.logResponse("MiniMax", body, success);

            if (!success) {
                log.warn("MiniMax response payload is empty");
                return Collections.emptyList();
            }

            List<String> assets = new ArrayList<>();
            for (String base64Image : body.getData().getImageBase64()) {
                if (StringUtils.hasText(base64Image)) {
                    assets.add(String.format("data:image/jpeg;base64,%s", base64Image));
                }
            }

            // 记录生成的图片信息
            if (!assets.isEmpty()) {
                LlmApiLogger.logGeneratedImages("MiniMax", assets.size(), assets.get(0));
            }

            log.info("MiniMax generated {} images successfully", assets.size());
            return assets;
        } catch (RestClientException ex) {
            log.error("Failed to call MiniMax API: {}", ex.getMessage(), ex);
            LlmApiLogger.logResponse("MiniMax", Map.of("error", ex.getMessage()), false);
            return Collections.emptyList();
        }
    }

    private String resolveAspectRatio(String ratio) {
        if (!StringUtils.hasText(ratio)) {
            return "1:1";
        }
        return switch (ratio) {
            case "1:1", "16:9", "9:16", "4:3", "3:4" -> ratio;
            default -> "1:1";
        };
    }

    /**
     * 格式化图片URL用于日志输出，避免打印长base64数据
     */
    private String formatImageUrlForLog(String imageUrl) {
        if (!StringUtils.hasText(imageUrl)) {
            return imageUrl;
        }

        String trimmed = imageUrl.trim();
        // 如果是base64格式，进行截断
        if (trimmed.startsWith("data:image/")) {
            return String.format("data:image/*;base64,[BASE64_LENGTH=%d]", trimmed.length());
        }

        return trimmed;
    }

    private String maskSecret(String secret) {
        if (!StringUtils.hasText(secret)) {
            return "null";
        }
        if (secret.length() <= 8) {
            return "****";
        }
        return secret.substring(0, 4) + "****" + secret.substring(secret.length() - 4);
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MinimaxImageResponse {
        private ImageData data;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class ImageData {
            @JsonProperty("image_base64")
            private List<String> imageBase64;
        }
    }
}
