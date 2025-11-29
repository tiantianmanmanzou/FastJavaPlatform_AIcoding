package com.template.module.auth.service.impl;

import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.module.auth.dto.LoginRequest;
import com.template.module.auth.dto.LoginResponse;
import com.template.module.auth.service.AuthService;
import com.template.module.user.dto.UserVO;
import com.template.module.user.entity.User;
import com.template.module.user.service.UserService;
import com.template.security.util.JwtUtil;
import com.template.security.util.SecurityUtil;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${jwt.expiration}")
    private long expiration;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userService.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        if (user.getStatus() != null && user.getStatus().equals(CommonConstants.STATUS_DISABLED)) {
            throw new BusinessException(ErrorCode.FORBIDDEN, "用户已被禁用");
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorCode.WRONG_PASSWORD);
        }
        UserVO userVO = userService.getUserDetail(user.getId());
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), extractRoleCodes(userVO));
        return LoginResponse.builder()
            .token(token)
            .expireAt(Instant.now().plusMillis(expiration))
            .user(userVO)
            .build();
    }

    @Override
    public void logout() {
        // 无状态应用，登出交由前端删除Token
    }

    @Override
    public String refreshToken() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        UserVO userVO = userService.getUserDetail(userId);
        return jwtUtil.generateToken(userId, userVO.getUsername(), extractRoleCodes(userVO));
    }

    @Override
    public UserVO currentUser() {
        Long userId = SecurityUtil.getCurrentUserId();
        if (userId == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }
        return userService.getUserDetail(userId);
    }

    private List<String> extractRoleCodes(UserVO userVO) {
        return userVO.getRoles() == null ? List.of() : userVO.getRoles().stream()
            .map(UserVO.RoleSimple::getRoleCode)
            .toList();
    }
}
