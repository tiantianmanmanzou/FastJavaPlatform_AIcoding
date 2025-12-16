package com.template.module.content.enums;

import java.util.Arrays;

public enum ContentApiVendor {
    GOOGLE("GOOGLE"),
    DOUBAO("DOUBAO"),
    OPENAI("OPENAI"),
    MINIMAX("MINIMAX"),
    KIMI("KIMI"),
    QWEN("QWEN"),
    GLM("GLM");

    private final String code;

    ContentApiVendor(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public static ContentApiVendor fromCode(String code) {
        if (code == null) {
            return null;
        }
        return Arrays.stream(values())
            .filter(item -> item.code.equalsIgnoreCase(code))
            .findFirst()
            .orElse(null);
    }
}
