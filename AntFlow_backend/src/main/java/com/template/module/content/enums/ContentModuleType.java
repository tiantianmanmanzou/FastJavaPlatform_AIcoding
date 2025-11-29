package com.template.module.content.enums;

import java.util.Arrays;

public enum ContentModuleType {
    IMAGE("IMAGE", "图片"),
    ARTICLE("ARTICLE", "文章"),
    VIDEO("VIDEO", "视频");

    private final String code;
    private final String label;

    ContentModuleType(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public static ContentModuleType fromCode(String code) {
        if (code == null) {
            return null;
        }
        return Arrays.stream(values())
            .filter(item -> item.code.equalsIgnoreCase(code))
            .findFirst()
            .orElse(null);
    }
}
