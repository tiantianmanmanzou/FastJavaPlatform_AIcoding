package com.template.module.permission.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.permission.dto.PermissionCreateRequest;
import com.template.module.permission.dto.PermissionQueryRequest;
import com.template.module.permission.dto.PermissionTreeVO;
import com.template.module.permission.dto.PermissionVO;
import com.template.module.permission.entity.Permission;
import com.template.module.permission.mapper.PermissionMapper;
import com.template.module.permission.service.PermissionService;
import com.template.module.role.entity.RolePermission;
import com.template.module.role.mapper.RolePermissionMapper;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl extends ServiceImpl<PermissionMapper, Permission> implements PermissionService {

    private final RolePermissionMapper rolePermissionMapper;

    @Override
    public PageResult<PermissionVO> pagePermissions(PermissionQueryRequest request) {
        Page<Permission> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<Permission> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getPermissionName())) {
            wrapper.like(Permission::getPermissionName, request.getPermissionName());
        }
        if (StringUtils.hasText(request.getPermissionCode())) {
            wrapper.like(Permission::getPermissionCode, request.getPermissionCode());
        }
        if (StringUtils.hasText(request.getType())) {
            wrapper.eq(Permission::getType, request.getType());
        }
        this.page(page, wrapper);
        List<PermissionVO> list = page.getRecords().stream().map(this::toVO).toList();
        return PageResult.of(list, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PermissionVO createPermission(PermissionCreateRequest request) {
        validateCodeUnique(request.getPermissionCode(), null);
        Permission permission = new Permission();
        permission.setPermissionName(request.getPermissionName());
        permission.setPermissionCode(request.getPermissionCode());
        permission.setType(request.getType());
        permission.setParentId(request.getParentId());
        permission.setPath(request.getPath());
        permission.setMethod(request.getMethod());
        permission.setSort(request.getSort());
        save(permission);
        return toVO(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PermissionVO updatePermission(Long id, PermissionCreateRequest request) {
        Permission permission = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.PERMISSION_NOT_FOUND));
        validateCodeUnique(request.getPermissionCode(), id);
        permission.setPermissionName(request.getPermissionName());
        permission.setPermissionCode(request.getPermissionCode());
        permission.setType(request.getType());
        permission.setParentId(request.getParentId());
        permission.setPath(request.getPath());
        permission.setMethod(request.getMethod());
        permission.setSort(request.getSort());
        updateById(permission);
        return toVO(permission);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deletePermission(Long id) {
        if (getById(id) == null) {
            throw new BusinessException(ErrorCode.PERMISSION_NOT_FOUND);
        }
        long childCount = lambdaQuery().eq(Permission::getParentId, id).count();
        if (childCount > 0) {
            throw new BusinessException(ErrorCode.PERMISSION_ASSIGNED);
        }
        LambdaQueryWrapper<RolePermission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(RolePermission::getPermissionId, id);
        long relationCount = rolePermissionMapper.selectCount(wrapper);
        if (relationCount > 0) {
            throw new BusinessException(ErrorCode.PERMISSION_ASSIGNED, "权限已分配，无法删除");
        }
        removeById(id);
    }

    @Override
    public PermissionVO getPermission(Long id) {
        Permission permission = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.PERMISSION_NOT_FOUND));
        return toVO(permission);
    }

    @Override
    public List<PermissionTreeVO> permissionTree() {
        List<Permission> permissions = list();
        if (CollectionUtils.isEmpty(permissions)) {
            return Collections.emptyList();
        }
        Map<Long, List<Permission>> childrenMap = permissions.stream()
            .collect(Collectors.groupingBy(permission -> permission.getParentId() == null ? 0L : permission.getParentId()));
        return buildTree(childrenMap, 0L);
    }

    private List<PermissionTreeVO> buildTree(Map<Long, List<Permission>> childrenMap, Long parentId) {
        List<Permission> children = childrenMap.getOrDefault(parentId, new ArrayList<>());
        children.sort(Comparator.comparing(permission -> Optional.ofNullable(permission.getSort()).orElse(0)));
        return children.stream().map(permission -> PermissionTreeVO.builder()
                .id(permission.getId())
                .permissionName(permission.getPermissionName())
                .permissionCode(permission.getPermissionCode())
                .type(permission.getType())
                .path(permission.getPath())
                .method(permission.getMethod())
                .children(buildTree(childrenMap, permission.getId()))
                .build())
            .collect(Collectors.toList());
    }

    private void validateCodeUnique(String permissionCode, Long excludeId) {
        LambdaQueryWrapper<Permission> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Permission::getPermissionCode, permissionCode);
        if (excludeId != null) {
            wrapper.ne(Permission::getId, excludeId);
        }
        if (this.count(wrapper) > 0) {
            throw new BusinessException(ErrorCode.PERMISSION_ALREADY_EXISTS);
        }
    }

    private PermissionVO toVO(Permission permission) {
        return PermissionVO.builder()
            .id(permission.getId())
            .permissionName(permission.getPermissionName())
            .permissionCode(permission.getPermissionCode())
            .type(permission.getType())
            .parentId(permission.getParentId())
            .path(permission.getPath())
            .method(permission.getMethod())
            .sort(permission.getSort())
            .createTime(permission.getCreateTime())
            .updateTime(permission.getUpdateTime())
            .build();
    }
}
