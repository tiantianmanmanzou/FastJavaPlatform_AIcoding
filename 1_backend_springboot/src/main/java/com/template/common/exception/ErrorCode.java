package com.template.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权"),
    FORBIDDEN(403, "无权限访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "服务器内部错误"),

    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户已存在"),
    WRONG_PASSWORD(1003, "密码错误"),
    ROLE_NOT_FOUND(1101, "角色不存在"),
    ROLE_ALREADY_EXISTS(1102, "角色已存在"),
    PERMISSION_NOT_FOUND(1201, "权限不存在"),
    PERMISSION_ASSIGNED(1202, "存在子权限，无法删除"),
    PERMISSION_ALREADY_EXISTS(1203, "权限编码已存在"),
    INVALID_TOKEN(1300, "Token无效或已过期");

    private final int code;
    private final String message;
}
