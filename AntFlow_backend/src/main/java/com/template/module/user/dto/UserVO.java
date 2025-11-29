package com.template.module.user.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserVO {

    private Long id;
    private String username;
    private String realName;
    private String email;
    private String mobile;
    private String department;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private List<RoleSimple> roles;

    @Data
    @Builder
    public static class RoleSimple {
        private Long roleId;
        private String roleName;
        private String roleCode;
    }
}
