package com.template.module.auth.dto;

import com.template.module.user.dto.UserVO;
import java.time.Instant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String token;
    private Instant expireAt;
    private UserVO user;
}
