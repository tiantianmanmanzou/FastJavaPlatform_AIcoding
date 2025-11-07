package com.template.module.auth.controller;

import com.template.common.response.Result;
import com.template.module.auth.dto.LoginRequest;
import com.template.module.auth.dto.LoginResponse;
import com.template.module.auth.service.AuthService;
import com.template.module.user.dto.UserVO;
import com.template.util.IpUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        log.info("用户 {} 尝试登录，来源 IP: {}", request.getUsername(), IpUtil.getClientIp(httpRequest));
        return Result.success(authService.login(request));
    }

    @PostMapping("/logout")
    public Result<Void> logout() {
        authService.logout();
        return Result.success();
    }

    @PostMapping("/refresh")
    public Result<String> refreshToken() {
        return Result.success(authService.refreshToken());
    }

    @GetMapping("/info")
    public Result<UserVO> currentUser() {
        return Result.success(authService.currentUser());
    }
}
