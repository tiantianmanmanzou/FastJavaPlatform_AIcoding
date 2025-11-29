package com.template.module.content.enums;

import java.util.Arrays;

public enum ContentPlatform {
    XIAOHONGSHU("XIAOHONGSHU", "小红书"),
    WECHAT("WECHAT", "公众号"),
    DOUYIN("DOUYIN", "抖音视频");

    private final String code;
    private final String label;

    ContentPlatform(String code, String label) {
        this.code = code;
        this.label = label;
    }

    public String getCode() {
        return code;
    }

    public String getLabel() {
        return label;
    }

    public static ContentPlatform fromCode(String code) {
        if (code == null) {
            return null;
        }
        return Arrays.stream(values())
            .filter(item -> item.code.equalsIgnoreCase(code))
            .findFirst()
            .orElse(null);
    }
}
