package com.template.module.auth.service;

import com.template.module.auth.dto.LoginRequest;
import com.template.module.auth.dto.LoginResponse;
import com.template.module.user.dto.UserVO;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    void logout();

    String refreshToken();

    UserVO currentUser();
}
