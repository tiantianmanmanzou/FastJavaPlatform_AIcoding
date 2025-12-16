package com.template.module.prompt.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PromptRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String content;

    @NotBlank
    private String type;
}
