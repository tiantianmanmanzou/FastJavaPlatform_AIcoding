package com.template.module.role.controller;

import com.template.common.response.PageResult;
import com.template.common.response.Result;
import com.template.module.role.dto.RoleCreateRequest;
import com.template.module.role.dto.RolePermissionRequest;
import com.template.module.role.dto.RoleQueryRequest;
import com.template.module.role.dto.RoleVO;
import com.template.module.role.service.RoleService;
import com.template.module.user.dto.UserVO;
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
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Validated
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public PageResult<RoleVO> pageRoles(@Valid RoleQueryRequest request) {
        return roleService.pageRoles(request);
    }

    @GetMapping("/all")
    public Result<List<RoleVO>> listAllRoles() {
        return Result.success(roleService.listAll());
    }

    @PostMapping
    public Result<RoleVO> createRole(@Valid @RequestBody RoleCreateRequest request) {
        return Result.success(roleService.createRole(request));
    }

    @GetMapping("/{id}")
    public Result<RoleVO> getRole(@PathVariable Long id) {
        return Result.success(roleService.getRoleDetail(id));
    }

    @PutMapping("/{id}")
    public Result<RoleVO> updateRole(@PathVariable Long id, @Valid @RequestBody RoleCreateRequest request) {
        return Result.success(roleService.updateRole(id, request));
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return Result.success();
    }

    @PostMapping("/{id}/permissions")
    public Result<Void> assignPermissions(@PathVariable Long id, @Valid @RequestBody RolePermissionRequest request) {
        roleService.assignPermissions(id, request.getPermissionIds());
        return Result.success();
    }

    @GetMapping("/{id}/permissions")
    public Result<List<Long>> getRolePermissions(@PathVariable Long id) {
        return Result.success(roleService.listPermissionIds(id));
    }

    @GetMapping("/{id}/users")
    public Result<List<UserVO>> getRoleUsers(@PathVariable Long id) {
        return Result.success(roleService.listRoleUsers(id));
    }
}
