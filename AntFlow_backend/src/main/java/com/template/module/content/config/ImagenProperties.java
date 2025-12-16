package com.template.module.content.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "imagen")
public class ImagenProperties {

    /**
     * Whether Imagen integration is enabled.
     */
    private boolean enabled = true;

    /**
     * Provider code used by系统管理 > 大模型接入.
     */
    private String providerCode = "google-imagen";

    /**
     * Google AI Studio API key.
     */
    private String apiKey;

    /**
     * Imagen model name, e.g. imagen-4.0-generate-001.
     */
    private String model = "imagen-3.0-generate-001";

    /**
     * Base endpoint for Imagen REST API.
     */
    private String endpoint = "https://generativelanguage.googleapis.com/v1beta/models";

    /**
     * Whether to allow people in generated images. Supported values: allow_adult, dont_allow.
     */
    private String personGeneration = "dont_allow";

    /**
     * Output resolution preset: 1k or 2k.
     */
    private String sampleImageSize = "1k";

    /**
     * Max images per request supported by Imagen.
     */
    private int maxSampleCount = 4;

    /**
     * HTTP connect timeout in milliseconds.
     */
    private int connectTimeoutMillis = 5000;

    /**
     * HTTP read timeout in milliseconds.
     */
    private int readTimeoutMillis = 20000;
}
