package com.template.util;

import java.util.regex.Pattern;
import lombok.experimental.UtilityClass;

@UtilityClass
public class ValidationUtil {

    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{4,20}$");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^\\d{11}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$");

    public boolean isUsernameValid(String username) {
        return username != null && USERNAME_PATTERN.matcher(username).matches();
    }

    public boolean isMobileValid(String mobile) {
        return mobile != null && MOBILE_PATTERN.matcher(mobile).matches();
    }

    public boolean isEmailValid(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}
