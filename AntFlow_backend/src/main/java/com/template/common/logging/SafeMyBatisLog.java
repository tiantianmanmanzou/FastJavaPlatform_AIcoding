package com.template.common.logging;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.ibatis.logging.Log;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

/**
 * 自定义 MyBatis 日志实现，截断过长的 Base64/数据 URL 输出，避免在日志中刷屏。
 */
public class SafeMyBatisLog implements Log {

    private static final Pattern BASE64_PATTERN = Pattern.compile("(data:[^,]+,)?[A-Za-z0-9+/=]{256,}");

    private final Logger delegate;

    public SafeMyBatisLog(String clazz) {
        this.delegate = LoggerFactory.getLogger(clazz);
    }

    private String sanitize(String message) {
        if (!StringUtils.hasText(message)) {
            return message;
        }
        Matcher matcher = BASE64_PATTERN.matcher(message);
        StringBuffer buffer = new StringBuffer();
        while (matcher.find()) {
            String prefix = matcher.group(1);
            int matchLength = matcher.group().length();
            String replacement;
            if (prefix != null) {
                replacement = prefix + "[BASE64 length=" + (matchLength - prefix.length()) + "]";
            } else {
                replacement = "[BASE64 length=" + matchLength + "]";
            }
            matcher.appendReplacement(buffer, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(buffer);
        return buffer.toString();
    }

    @Override
    public boolean isDebugEnabled() {
        return delegate.isDebugEnabled();
    }

    @Override
    public boolean isTraceEnabled() {
        return delegate.isTraceEnabled();
    }

    @Override
    public void error(String message, Throwable t) {
        delegate.error(sanitize(message), t);
    }

    @Override
    public void error(String message) {
        delegate.error(sanitize(message));
    }

    @Override
    public void debug(String message) {
        if (delegate.isDebugEnabled()) {
            delegate.debug(sanitize(message));
        }
    }

    @Override
    public void trace(String message) {
        if (delegate.isTraceEnabled()) {
            delegate.trace(sanitize(message));
        }
    }

    @Override
    public void warn(String message) {
        delegate.warn(sanitize(message));
    }
}
