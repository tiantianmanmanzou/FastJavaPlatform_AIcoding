package com.template.module.content.client;

import java.util.Collections;
import java.util.Map;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TextGenerationRequest {
    String prompt;
    String baseUrl;
    String apiKey;
    String model;
    Map<String, String> params;

    public Map<String, String> safeParams() {
        return params == null ? Collections.emptyMap() : params;
    }
}
