package com.template.module.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 4, max = 20, message = "用户名长度需在4-20之间")
    private String username;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String realName;

    @Pattern(regexp = "^\\d{11}$", message = "手机号需为11位数字")
    private String mobile;

    private String department;

    private Integer status;

    private List<Long> roleIds;
}
