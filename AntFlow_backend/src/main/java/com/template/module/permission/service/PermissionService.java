package com.template.module.permission.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.permission.dto.PermissionCreateRequest;
import com.template.module.permission.dto.PermissionQueryRequest;
import com.template.module.permission.dto.PermissionTreeVO;
import com.template.module.permission.dto.PermissionVO;
import com.template.module.permission.entity.Permission;
import java.util.List;

public interface PermissionService extends IService<Permission> {

    PageResult<PermissionVO> pagePermissions(PermissionQueryRequest request);

    PermissionVO createPermission(PermissionCreateRequest request);

    PermissionVO updatePermission(Long id, PermissionCreateRequest request);

    void deletePermission(Long id);

    PermissionVO getPermission(Long id);

    List<PermissionTreeVO> permissionTree();
}
