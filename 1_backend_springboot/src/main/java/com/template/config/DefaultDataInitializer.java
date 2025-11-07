package com.template.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.template.common.constants.CommonConstants;
import com.template.module.permission.entity.Permission;
import com.template.module.permission.mapper.PermissionMapper;
import com.template.module.role.entity.Role;
import com.template.module.role.entity.RolePermission;
import com.template.module.role.mapper.RoleMapper;
import com.template.module.role.mapper.RolePermissionMapper;
import com.template.module.user.entity.User;
import com.template.module.user.entity.UserRole;
import com.template.module.user.mapper.UserMapper;
import com.template.module.user.mapper.UserRoleMapper;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
@Slf4j
public class DefaultDataInitializer implements ApplicationRunner {

    private final RoleMapper roleMapper;
    private final PermissionMapper permissionMapper;
    private final RolePermissionMapper rolePermissionMapper;
    private final UserMapper userMapper;
    private final UserRoleMapper userRoleMapper;
    private final PasswordEncoder passwordEncoder;

    @Value("${security.admin.username:admin}")
    private String adminUsername;

    @Value("${security.admin.password:Admin@123}")
    private String adminPassword;

    @Value("${security.admin.real-name:系统管理员}")
    private String adminRealName;

    @Value("${security.admin.email:admin@example.com}")
    private String adminEmail;

    private static final String ADMIN_ROLE_CODE = "SYSTEM_ADMIN";

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void run(ApplicationArguments args) {
        Role adminRole = ensureAdminRole();
        Map<String, Long> permissionMap = ensureDefaultPermissions();
        if (!permissionMap.isEmpty()) {
            bindRolePermissions(adminRole.getId(), permissionMap.values());
        }
        ensureAdminUser(adminRole.getId());
    }

    private Role ensureAdminRole() {
        Role role = roleMapper.selectOne(new LambdaQueryWrapper<Role>().eq(Role::getRoleCode, ADMIN_ROLE_CODE));
        if (role != null) {
            return role;
        }
        Role adminRole = new Role();
        adminRole.setRoleName("系统管理员");
        adminRole.setRoleCode(ADMIN_ROLE_CODE);
        adminRole.setDescription("拥有系统所有权限");
        adminRole.setStatus(CommonConstants.STATUS_ENABLED);
        roleMapper.insert(adminRole);
        log.info("[INIT] 创建默认系统管理员角色 (code={})", ADMIN_ROLE_CODE);
        return adminRole;
    }

    private Map<String, Long> ensureDefaultPermissions() {
        List<PermissionSeed> seeds = List.of(
            new PermissionSeed("系统管理", "system:root", "menu", null, "/system", "GET", 1),
            new PermissionSeed("用户管理", "system:user", "menu", "system:root", "/user-management", "GET", 10),
            new PermissionSeed("用户新增", "system:user:create", "button", "system:user", null, "POST", 11),
            new PermissionSeed("用户编辑", "system:user:update", "button", "system:user", null, "PUT", 12),
            new PermissionSeed("用户删除", "system:user:delete", "button", "system:user", null, "DELETE", 13),
            new PermissionSeed("角色管理", "system:role", "menu", "system:root", "/role-management", "GET", 20),
            new PermissionSeed("角色新增", "system:role:create", "button", "system:role", null, "POST", 21),
            new PermissionSeed("角色授权", "system:role:permission", "button", "system:role", null, "POST", 22),
            new PermissionSeed("权限管理", "system:permission", "menu", "system:root", "/permission-management", "GET", 30),
            new PermissionSeed("权限编辑", "system:permission:update", "button", "system:permission", null, "PUT", 31)
        );

        Map<String, Long> codeIdMap = permissionMapper.selectList(new LambdaQueryWrapper<>()).stream()
            .collect(Collectors.toMap(Permission::getPermissionCode, Permission::getId));

        for (PermissionSeed seed : seeds) {
            Long parentId = seed.parentCode() == null ? null : codeIdMap.get(seed.parentCode());
            Permission permission = permissionMapper.selectOne(
                new LambdaQueryWrapper<Permission>().eq(Permission::getPermissionCode, seed.code()));
            if (permission == null) {
                permission = new Permission();
                permission.setPermissionName(seed.name());
                permission.setPermissionCode(seed.code());
                permission.setType(seed.type());
                permission.setParentId(parentId);
                permission.setPath(seed.path());
                permission.setMethod(seed.method());
                permission.setSort(seed.sort());
                permissionMapper.insert(permission);
                codeIdMap.put(seed.code(), permission.getId());
                log.debug("[INIT] 新增默认权限 {}", seed.code());
            } else {
                boolean needUpdate = false;
                if (!Objects.equals(permission.getPermissionName(), seed.name())) {
                    permission.setPermissionName(seed.name());
                    needUpdate = true;
                }
                if (!Objects.equals(permission.getType(), seed.type())) {
                    permission.setType(seed.type());
                    needUpdate = true;
                }
                if (!Objects.equals(permission.getParentId(), parentId)) {
                    permission.setParentId(parentId);
                    needUpdate = true;
                }
                if (!Objects.equals(permission.getPath(), seed.path())) {
                    permission.setPath(seed.path());
                    needUpdate = true;
                }
                if (!Objects.equals(permission.getMethod(), seed.method())) {
                    permission.setMethod(seed.method());
                    needUpdate = true;
                }
                if (!Objects.equals(permission.getSort(), seed.sort())) {
                    permission.setSort(seed.sort());
                    needUpdate = true;
                }
                if (needUpdate) {
                    permissionMapper.updateById(permission);
                }
            }
        }
        return codeIdMap;
    }

    private void bindRolePermissions(Long roleId, Collection<Long> permissionIds) {
        if (CollectionUtils.isEmpty(permissionIds)) {
            return;
        }
        Set<Long> existing = rolePermissionMapper.selectList(
                new LambdaQueryWrapper<RolePermission>().eq(RolePermission::getRoleId, roleId))
            .stream()
            .map(RolePermission::getPermissionId)
            .collect(Collectors.toSet());
        for (Long permissionId : permissionIds) {
            if (permissionId == null || existing.contains(permissionId)) {
                continue;
            }
            RolePermission relation = new RolePermission();
            relation.setRoleId(roleId);
            relation.setPermissionId(permissionId);
            rolePermissionMapper.insert(relation);
        }
    }

    private void ensureAdminUser(Long adminRoleId) {
        User admin = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, adminUsername));
        if (admin == null) {
            admin = new User();
            admin.setUsername(adminUsername);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRealName(StringUtils.hasText(adminRealName) ? adminRealName : "系统管理员");
            admin.setEmail(adminEmail);
            admin.setStatus(CommonConstants.STATUS_ENABLED);
            userMapper.insert(admin);
            log.info("[INIT] 创建默认管理员账号 username={}", adminUsername);
        }
        ensureUserRole(admin.getId(), adminRoleId);
    }

    private void ensureUserRole(Long userId, Long roleId) {
        boolean exists = userRoleMapper.selectCount(new LambdaQueryWrapper<UserRole>()
            .eq(UserRole::getUserId, userId)
            .eq(UserRole::getRoleId, roleId)) > 0;
        if (exists) {
            return;
        }
        UserRole relation = new UserRole();
        relation.setUserId(userId);
        relation.setRoleId(roleId);
        userRoleMapper.insert(relation);
    }

    private record PermissionSeed(String name, String code, String type, String parentCode,
                                  String path, String method, int sort) {
    }
}
