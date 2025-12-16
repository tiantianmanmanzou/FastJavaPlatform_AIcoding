package com.template.module.content.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.template.common.logging.LlmApiLogger;
import com.template.module.content.config.ImagenProperties;
import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
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
public class GoogleImagenClient {

    private final ImagenProperties properties;
    private final RestTemplate restTemplate;

    public GoogleImagenClient(ImagenProperties properties, RestTemplateBuilder restTemplateBuilder) {
        this.properties = properties;
        this.restTemplate = restTemplateBuilder
            .setConnectTimeout(Duration.ofMillis(properties.getConnectTimeoutMillis()))
            .setReadTimeout(Duration.ofMillis(properties.getReadTimeoutMillis()))
            .build();
    }

    public List<String> generateImages(String prompt, String aspectRatio, int quantity, String modelOverride) {
        if (!properties.isEnabled()) {
            return Collections.emptyList();
        }
        if (!StringUtils.hasText(properties.getApiKey())) {
            log.debug("Imagen API key is not configured, skip remote call");
            return Collections.emptyList();
        }
        if (!StringUtils.hasText(prompt)) {
            log.warn("Prompt is empty, skip Imagen call");
            return Collections.emptyList();
        }
        int sampleCount = Math.max(1, Math.min(quantity, properties.getMaxSampleCount()));
        String targetModel = StringUtils.hasText(modelOverride) ? modelOverride : properties.getModel();

        Map<String, Object> parameters = Map.of(
            "sampleCount", sampleCount,
            "personGeneration", resolvePersonGeneration(),
            "aspectRatio", resolveAspectRatio(aspectRatio),
            "sampleImageSize", properties.getSampleImageSize()
        );

        Map<String, Object> payload = Map.of(
            "instances", List.of(Map.of("prompt", prompt)),
            "parameters", parameters
        );

        String url = String.format("%s/%s:generateImages?key=%s",
            properties.getEndpoint(), targetModel, properties.getApiKey());
        String loggedUrl = String.format("%s/%s:generateImages?key=%s",
            properties.getEndpoint(), targetModel, maskSecret(properties.getApiKey()));

        // 记录API请求参数
        LlmApiLogger.logRequest("Google Imagen", loggedUrl, targetModel, prompt, parameters);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        LlmApiLogger.logRawHttpRequest("Google Imagen", loggedUrl, Map.of("Content-Type", MediaType.APPLICATION_JSON_VALUE), payload);
        try {
            ResponseEntity<ImagenPredictResponse> response = restTemplate.postForEntity(
                URI.create(url),
                new HttpEntity<>(payload, headers),
                ImagenPredictResponse.class
            );

            ImagenPredictResponse body = response.getBody();
            boolean success = body != null && !CollectionUtils.isEmpty(body.getPredictions());

            // 记录API响应
            LlmApiLogger.logResponse("Google Imagen", body, success);

            if (!success) {
                log.warn("Imagen response payload is empty");
                return Collections.emptyList();
            }

            List<String> assets = new ArrayList<>();
            for (ImagenPredictResponse.Prediction prediction : body.getPredictions()) {
                if (!StringUtils.hasText(prediction.getBytesBase64Encoded())) {
                    continue;
                }
                String mimeType = StringUtils.hasText(prediction.getMimeType()) ? prediction.getMimeType() : "image/png";
                assets.add(String.format("data:%s;base64,%s", mimeType, prediction.getBytesBase64Encoded()));
            }

            // 记录生成的图片信息
            if (!assets.isEmpty()) {
                LlmApiLogger.logGeneratedImages("Google Imagen", assets.size(), assets.get(0));
            }

            return assets;
        } catch (RestClientException ex) {
            log.error("Failed to call Google Imagen API", ex);
            LlmApiLogger.logResponse("Google Imagen", Map.of("error", ex.getMessage()), false);
            return Collections.emptyList();
        }
    }

    private String resolvePersonGeneration() {
        String value = properties.getPersonGeneration();
        if (!StringUtils.hasText(value)) {
            return "dont_allow";
        }
        return switch (value) {
            case "allow_adult", "dont_allow" -> value;
            default -> "dont_allow";
        };
    }

    private String resolveAspectRatio(String ratio) {
        if (!StringUtils.hasText(ratio)) {
            return "1:1";
        }
        return switch (ratio) {
            case "1:1", "3:4", "4:3", "16:9", "9:16" -> ratio;
            default -> "1:1";
        };
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
    public static class ImagenPredictResponse {

        private List<Prediction> predictions;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Prediction {

            @JsonProperty("bytesBase64Encoded")
            private String bytesBase64Encoded;

            @JsonProperty("mimeType")
            private String mimeType;
        }
    }
}
