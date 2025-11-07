package com.template.common.exception;

import com.template.common.response.Result;
import com.template.common.response.ResultCode;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {}", ex.getMessage());
        return Result.failure(ex.getCode(), ex.getMessage());
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class, ConstraintViolationException.class,
        MissingServletRequestParameterException.class, HttpMessageNotReadableException.class})
    public Result<Void> handleValidationException(Exception ex) {
        log.warn("Validation exception", ex);
        String message = resolveValidationMessage(ex);
        return Result.failure(ResultCode.BAD_REQUEST.getCode(), message);
    }

    @ExceptionHandler(AuthenticationException.class)
    public Result<Void> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication failed", ex);
        return Result.failure(ResultCode.UNAUTHORIZED.getCode(), ResultCode.UNAUTHORIZED.getMessage());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDeniedException(AccessDeniedException ex) {
        log.warn("Access denied", ex);
        return Result.failure(ResultCode.FORBIDDEN.getCode(), ResultCode.FORBIDDEN.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception ex) {
        log.error("Unexpected exception", ex);
        return Result.failure(ResultCode.ERROR.getCode(), ResultCode.ERROR.getMessage());
    }

    private String resolveValidationMessage(Exception ex) {
        if (ex instanceof MethodArgumentNotValidException manve && manve.getBindingResult().getFieldError() != null) {
            return manve.getBindingResult().getFieldError().getDefaultMessage();
        }
        if (ex instanceof BindException bindException && bindException.getFieldError() != null) {
            return bindException.getFieldError().getDefaultMessage();
        }
        if (ex instanceof ConstraintViolationException cve) {
            return cve.getConstraintViolations().stream().findFirst()
                .map(violation -> violation.getMessage())
                .orElse(ResultCode.BAD_REQUEST.getMessage());
        }
        return ex.getMessage();
    }
}
