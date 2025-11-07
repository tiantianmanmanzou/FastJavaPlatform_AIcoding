package com.template.module.permission.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.permission.dto.PermissionCreateRequest;
import com.template.module.permission.dto.PermissionQueryRequest;
import com.template.module.permission.dto.PermissionTreeVO;
import com.template.module.permission.dto.PermissionVO;
import com.template.module.permission.service.PermissionService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Validated
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    public PageResult<PermissionVO> pagePermissions(@Valid PermissionQueryRequest request) {
        return permissionService.pagePermissions(request);
    }

    @GetMapping("/tree")
    public Result<List<PermissionTreeVO>> permissionTree() {
        return Result.success(permissionService.permissionTree());
    }

    @PostMapping
    public Result<PermissionVO> createPermission(@Valid @RequestBody PermissionCreateRequest request) {
        return Result.success(permissionService.createPermission(request));
    }

    @GetMapping("/{id}")
    public Result<PermissionVO> getPermission(@PathVariable Long id) {
        return Result.success(permissionService.getPermission(id));
    }

    @PutMapping("/{id}")
    public Result<PermissionVO> updatePermission(@PathVariable Long id,
        @Valid @RequestBody PermissionCreateRequest request) {
        return Result.success(permissionService.updatePermission(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return Result.success();
    }
}
