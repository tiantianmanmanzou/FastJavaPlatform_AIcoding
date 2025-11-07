package com.template.module.role.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.permission.entity.Permission;
import com.template.module.permission.mapper.PermissionMapper;
import com.template.module.role.dto.RoleCreateRequest;
import com.template.module.role.dto.RoleQueryRequest;
import com.template.module.role.dto.RoleVO;
import com.template.module.role.entity.Role;
import com.template.module.role.entity.RolePermission;
import com.template.module.role.mapper.RoleMapper;
import com.template.module.role.mapper.RolePermissionMapper;
import com.template.module.role.service.RoleService;
import com.template.module.user.dto.UserVO;
import com.template.module.user.service.UserService;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl extends ServiceImpl<RoleMapper, Role> implements RoleService {

    private final RolePermissionMapper rolePermissionMapper;
    private final PermissionMapper permissionMapper;
    private final UserService userService;

    @Override
    public PageResult<RoleVO> pageRoles(RoleQueryRequest request) {
        Page<Role> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getRoleName())) {
            wrapper.like(Role::getRoleName, request.getRoleName());
        }
        if (request.getStatus() != null) {
            wrapper.eq(Role::getStatus, request.getStatus());
        }
        this.page(page, wrapper);
        List<RoleVO> list = page.getRecords().stream().map(this::toRoleVO).toList();
        return PageResult.of(list, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RoleVO createRole(RoleCreateRequest request) {
        validateRoleUnique(request.getRoleName(), request.getRoleCode(), null);
        Role role = new Role();
        role.setRoleName(request.getRoleName());
        role.setRoleCode(request.getRoleCode());
        role.setDescription(request.getDescription());
        role.setStatus(request.getStatus() == null ? CommonConstants.STATUS_ENABLED : request.getStatus());
        save(role);
        return toRoleVO(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RoleVO updateRole(Long id, RoleCreateRequest request) {
        Role role = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));
        validateRoleUnique(request.getRoleName(), request.getRoleCode(), id);
        role.setRoleName(request.getRoleName());
        role.setRoleCode(request.getRoleCode());
        role.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            role.setStatus(request.getStatus());
        }
        updateById(role);
        return toRoleVO(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRole(Long id) {
        if (getById(id) == null) {
            throw new BusinessException(ErrorCode.ROLE_NOT_FOUND);
        }
        removeById(id);
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, id);
        rolePermissionMapper.delete(wrapper);
    }

    @Override
    public RoleVO getRoleDetail(Long id) {
        Role role = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));
        return toRoleVO(role);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, roleId);
        rolePermissionMapper.delete(wrapper);
        if (CollectionUtils.isEmpty(permissionIds)) {
            return;
        }
        List<Permission> permissions = permissionMapper.selectBatchIds(permissionIds);
        if (permissions.size() != permissionIds.size()) {
            throw new BusinessException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        permissionIds.forEach(permissionId -> {
            RolePermission relation = new RolePermission();
            relation.setRoleId(roleId);
            relation.setPermissionId(permissionId);
            rolePermissionMapper.insert(relation);
        });
    }

    @Override
    public List<Long> listPermissionIds(Long roleId) {
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getRoleId, roleId);
        List<RolePermission> relations = rolePermissionMapper.selectList(wrapper);
        if (CollectionUtils.isEmpty(relations)) {
            return Collections.emptyList();
        }
        return relations.stream().map(RolePermission::getPermissionId).toList();
    }

    @Override
    public List<UserVO> listRoleUsers(Long roleId) {
        return userService.listUsersByRole(roleId);
    }

    @Override
    public List<RoleVO> listAll() {
        return list().stream().map(this::toRoleVO).toList();
    }

    private void validateRoleUnique(String roleName, String roleCode, Long excludeId) {
        LambdaQueryWrapper<Role> nameWrapper = new LambdaQueryWrapper<>();
        nameWrapper.eq(Role::getRoleName, roleName);
        if (excludeId != null) {
            nameWrapper.ne(Role::getId, excludeId);
        }
        if (this.count(nameWrapper) > 0) {
            throw new BusinessException(ErrorCode.ROLE_ALREADY_EXISTS, "角色名称重复");
        }
        LambdaQueryWrapper<Role> codeWrapper = new LambdaQueryWrapper<>();
        codeWrapper.eq(Role::getRoleCode, roleCode);
        if (excludeId != null) {
            codeWrapper.ne(Role::getId, excludeId);
        }
        if (this.count(codeWrapper) > 0) {
            throw new BusinessException(ErrorCode.ROLE_ALREADY_EXISTS, "角色编码重复");
        }
    }

    private RoleVO toRoleVO(Role role) {
        return RoleVO.builder()
            .id(role.getId())
            .roleName(role.getRoleName())
            .roleCode(role.getRoleCode())
            .description(role.getDescription())
            .status(role.getStatus())
            .createTime(role.getCreateTime())
            .updateTime(role.getUpdateTime())
            .permissionIds(listPermissionIds(role.getId()))
            .build();
    }
}
