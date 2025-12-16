package com.template.module.content.client;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class TextGenerationResult {
    boolean success;
    String content;
    String errorMessage;

    public static TextGenerationResult success(String content) {
        return TextGenerationResult.builder()
            .success(true)
            .content(content)
            .build();
    }

    public static TextGenerationResult failure(String error) {
        return TextGenerationResult.builder()
            .success(false)
            .errorMessage(error)
            .build();
    }
}
