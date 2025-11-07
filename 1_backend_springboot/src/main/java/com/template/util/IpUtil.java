package com.template.util;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.experimental.UtilityClass;
import org.springframework.util.StringUtils;

@UtilityClass
public class IpUtil {

    private static final List<String> IP_HEADER_CANDIDATES = List.of(
        "X-Forwarded-For",
        "X-Real-IP",
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP",
        "HTTP_CLIENT_IP",
        "HTTP_X_FORWARDED_FOR"
    );

    public String getClientIp(HttpServletRequest request) {
        for (String header : IP_HEADER_CANDIDATES) {
            String value = request.getHeader(header);
            if (StringUtils.hasText(value) && !"unknown".equalsIgnoreCase(value)) {
                return value.split(",")[0].trim();
            }
        }
        return request.getRemoteAddr();
    }
}
