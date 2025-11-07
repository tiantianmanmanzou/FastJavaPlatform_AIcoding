package com.template.module.role.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.role.dto.RoleCreateRequest;
import com.template.module.role.dto.RoleQueryRequest;
import com.template.module.role.dto.RoleVO;
import com.template.module.role.entity.Role;
import com.template.module.user.dto.UserVO;
import java.util.List;

public interface RoleService extends IService<Role> {

    PageResult<RoleVO> pageRoles(RoleQueryRequest request);

    RoleVO createRole(RoleCreateRequest request);

    RoleVO updateRole(Long id, RoleCreateRequest request);

    void deleteRole(Long id);

    RoleVO getRoleDetail(Long id);

    void assignPermissions(Long roleId, List<Long> permissionIds);

    List<Long> listPermissionIds(Long roleId);

    List<UserVO> listRoleUsers(Long roleId);

    List<RoleVO> listAll();
}
