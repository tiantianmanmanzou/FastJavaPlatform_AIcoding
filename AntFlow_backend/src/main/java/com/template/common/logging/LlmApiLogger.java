package com.template.common.logging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.util.Map;
import java.util.stream.Collectors;

/**
 * 通用的大模型API日志记录工具
 * 用于记录所有厂商大模型API的请求和响应参数
 */
@Slf4j
public class LlmApiLogger {

    private static final ObjectMapper objectMapper = new ObjectMapper()
        .enable(SerializationFeature.INDENT_OUTPUT);

    private static final int MAX_LOG_LENGTH = 1000;
    private static final int TRUNCATE_LENGTH = 200;

    /**
     * 记录原始HTTP请求（包含headers与payload）
     */
    public static void logRawHttpRequest(String vendor, String url, Map<String, ?> headers, Object payload) {
        try {
            String prettyHeaders = headers == null || headers.isEmpty()
                ? "{}"
                : formatAsPrettyJson(headers);
            String prettyPayload = payload == null
                ? "null"
                : formatAsPrettyJson(payload);

            String message = String.format("""

========== %s API HTTP REQUEST ==========
url = "%s"
headers = %s
payload = %s
================================================
""", vendor.toUpperCase(), url, prettyHeaders, prettyPayload);

            log.info(message);
        } catch (Exception e) {
            log.error("Failed to log raw HTTP request", e);
        }
    }

    /**
     * 记录API请求参数
     *
     * @param vendor     厂商名称（如：MiniMax、Google等）
     * @param endpoint   API端点
     * @param model      模型名称
     * @param prompt     提示词
     * @param parameters 其他参数
     */
    public static void logRequest(String vendor, String endpoint, String model, String prompt, Map<String, Object> parameters) {
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("\n========== %s API REQUEST ==========\n", vendor.toUpperCase()));
            sb.append(String.format("Endpoint: %s\n", endpoint));
            sb.append(String.format("Model: %s\n", model));

            // 对提示词进行base64检测和格式化
            String formattedPrompt = formatParameterValue(prompt);
            sb.append(String.format("Prompt: %s\n", formattedPrompt));

            if (parameters != null && !parameters.isEmpty()) {
                sb.append("Parameters:\n");
                for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                    String value = formatParameterValue(entry.getValue());
                    sb.append(String.format("  %s: %s\n", entry.getKey(), value));
                }
            }

            sb.append("===========================================\n");
            log.info(sb.toString());
        } catch (Exception e) {
            log.error("Failed to log request", e);
        }
    }

    private static String formatAsPrettyJson(Object data) throws Exception {
        String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
        if (json.length() > MAX_LOG_LENGTH) {
            return truncate(json);
        }
        return json;
    }

    /**
     * 记录API响应
     *
     * @param vendor    厂商名称
     * @param response  响应对象
     * @param success   是否成功
     */
    public static void logResponse(String vendor, Object response, boolean success) {
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("\n========== %s API RESPONSE [%s] ==========\n",
                vendor.toUpperCase(), success ? "SUCCESS" : "FAILED"));

            if (response != null) {
                sb.append(String.format("Response type: %s\n", response.getClass().getSimpleName()));

                // 检查是否包含错误信息
                if (!success) {
                    sb.append("Status: FAILED\n");
                    // 尝试提取错误信息，但不包含base64数据
                    sb.append("Note: Base64 data and large content truncated for readability\n");
                } else {
                    sb.append("Status: SUCCESS\n");
                    sb.append("Note: Base64 data and large content truncated for readability\n");
                }
            } else {
                sb.append("Response: null");
            }

            sb.append("\n===========================================\n");
            if (success) {
                log.info(sb.toString());
            } else {
                log.error(sb.toString());
            }
        } catch (Exception e) {
            log.error("Failed to log response", e);
        }
    }

    /**
     * 记录生成的图片信息
     *
     * @param vendor     厂商名称
     * @param count      生成图片数量
     * @param base64Data Base64数据（可选，仅用于统计长度，不打印内容）
     */
    public static void logGeneratedImages(String vendor, int count, String base64Data) {
        try {
            StringBuilder sb = new StringBuilder();
            sb.append(String.format("\n========== %s IMAGE GENERATION RESULT ==========\n", vendor.toUpperCase()));
            sb.append(String.format("Generated %d image(s)\n", count));

            if (StringUtils.hasText(base64Data)) {
                sb.append(String.format("Base64 data length: %d characters (not displayed)\n", base64Data.length()));
            }

            sb.append("=====================================================\n");
            log.info(sb.toString());
        } catch (Exception e) {
            log.error("Failed to log generated images", e);
        }
    }

    /**
     * 格式化参数值
     * 对于base64图片数据，不显示内容，只显示长度标记
     */
    private static String formatParameterValue(Object value) {
        if (value == null) {
            return "null";
        }

        String str = value.toString();

        // 如果是base64数据，完全不显示内容，只显示长度
        if (isLikelyBase64(str)) {
            return String.format("[BASE64_DATA length=%d]", str.length());
        }

        // 对于超长字符串，进行截断
        if (str.length() > TRUNCATE_LENGTH) {
            return truncate(str);
        }

        return str;
    }

    /**
     * 判断是否可能是base64字符串
     */
    private static boolean isLikelyBase64(String str) {
        if (str.length() < 100) {
            return false;
        }

        // Base64字符集检查
        return str.matches("^[A-Za-z0-9+/=]+$");
    }

    /**
     * 截断字符串，如果超过最大长度则在末尾添加省略号
     */
    private static String truncate(String str) {
        if (str == null) {
            return "null";
        }

        if (str.length() <= TRUNCATE_LENGTH) {
            return str;
        }

        return str.substring(0, TRUNCATE_LENGTH) + "...(truncated, total length: " + str.length() + ")";
    }
}
