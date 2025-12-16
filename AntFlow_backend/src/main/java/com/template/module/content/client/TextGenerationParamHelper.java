package com.template.module.content.client;

import java.util.Map;
import org.springframework.util.StringUtils;

public final class TextGenerationParamHelper {
    private TextGenerationParamHelper() {
    }

    public static Integer getInt(Map<String, String> params, String key) {
        if (params == null) {
            return null;
        }
        String value = params.get(key);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    public static Double getDouble(Map<String, String> params, String key) {
        if (params == null) {
            return null;
        }
        String value = params.get(key);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Double.parseDouble(value.trim());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    public static String getString(Map<String, String> params, String key) {
        if (params == null) {
            return null;
        }
        String value = params.get(key);
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    public static Boolean getBoolean(Map<String, String> params, String key) {
        if (params == null) {
            return null;
        }
        String value = params.get(key);
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return "true".equalsIgnoreCase(value.trim());
    }
}
