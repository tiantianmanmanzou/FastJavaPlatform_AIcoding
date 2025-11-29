package com.template.security.util;

import io.jsonwebtoken.Claims;
import lombok.experimental.UtilityClass;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@UtilityClass
public class SecurityUtil {

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public String getCurrentUsername() {
        Authentication authentication = getAuthentication();
        return authentication == null ? null : (String) authentication.getPrincipal();
    }

    public Long getCurrentUserId() {
        Authentication authentication = getAuthentication();
        if (authentication != null && authentication.getDetails() instanceof Claims claims) {
            Number userId = claims.get("uid", Number.class);
            return userId == null ? null : userId.longValue();
        }
        return null;
    }
}
