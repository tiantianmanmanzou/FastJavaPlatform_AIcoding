package com.template.module.user.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.template.common.constants.CommonConstants;
import com.template.common.exception.BusinessException;
import com.template.common.exception.ErrorCode;
import com.template.common.response.PageResult;
import com.template.module.role.entity.Role;
import com.template.module.role.mapper.RoleMapper;
import com.template.module.user.dto.UserCreateRequest;
import com.template.module.user.dto.UserQueryRequest;
import com.template.module.user.dto.UserUpdateRequest;
import com.template.module.user.dto.UserVO;
import com.template.module.user.entity.User;
import com.template.module.user.entity.UserRole;
import com.template.module.user.mapper.UserMapper;
import com.template.module.user.mapper.UserRoleMapper;
import com.template.module.user.service.UserService;
import com.template.util.ValidationUtil;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserRoleMapper userRoleMapper;
    private final RoleMapper roleMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Optional<User> findByUsername(String username) {
        if (!StringUtils.hasText(username)) {
            return Optional.empty();
        }
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        return Optional.ofNullable(this.getOne(wrapper));
    }

    @Override
    public UserVO getUserDetail(Long id) {
        User user = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return toUserVO(user);
    }

    @Override
    public PageResult<UserVO> pageUsers(UserQueryRequest request) {
        Page<User> page = new Page<>(request.getPage(), request.getPageSize());
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(request.getUsername())) {
            wrapper.like(User::getUsername, request.getUsername());
        }
        if (StringUtils.hasText(request.getEmail())) {
            wrapper.like(User::getEmail, request.getEmail());
        }
        if (request.getStatus() != null) {
            wrapper.eq(User::getStatus, request.getStatus());
        }
        if (StringUtils.hasText(request.getRoleCode())) {
            Long roleId = findRoleIdByCode(request.getRoleCode());
            if (roleId == null) {
                return PageResult.of(Collections.emptyList(), 0, page.getCurrent(), page.getSize());
            }
            LambdaQueryWrapper<UserRole> userRoleWrapper = new LambdaQueryWrapper<>();
            userRoleWrapper.eq(UserRole::getRoleId, roleId);
            List<UserRole> relations = userRoleMapper.selectList(userRoleWrapper);
            if (CollectionUtils.isEmpty(relations)) {
                return PageResult.of(Collections.emptyList(), 0, page.getCurrent(), page.getSize());
            }
            wrapper.in(User::getId, relations.stream().map(UserRole::getUserId).collect(Collectors.toSet()));
        }
        this.page(page, wrapper);
        List<UserVO> list = page.getRecords().stream()
            .map(this::toUserVO)
            .collect(Collectors.toList());
        return PageResult.of(list, page.getTotal(), page.getCurrent(), page.getSize());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVO createUser(UserCreateRequest request) {
        validateUsernameUnique(request.getUsername());
        validateUserPayload(request.getUsername(), request.getEmail(), request.getMobile());
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setDepartment(request.getDepartment());
        user.setStatus(request.getStatus() == null ? CommonConstants.STATUS_ENABLED : request.getStatus());
        save(user);
        bindRoles(user.getId(), request.getRoleIds());
        return getUserDetail(user.getId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVO updateUser(Long id, UserUpdateRequest request) {
        User user = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        validateUsernameUniqueForUpdate(request.getUsername(), id);
        validateUserPayload(request.getUsername(), request.getEmail(), request.getMobile());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setDepartment(request.getDepartment());
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        updateById(user);
        if (request.getRoleIds() != null) {
            bindRoles(id, request.getRoleIds());
        }
        return getUserDetail(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(Long id) {
        removeById(id);
        LambdaQueryWrapper<UserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRole::getUserId, id);
        userRoleMapper.delete(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUsers(List<Long> ids) {
        if (CollectionUtils.isEmpty(ids)) {
            return;
        }
        removeBatchByIds(ids);
        LambdaQueryWrapper<UserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(UserRole::getUserId, ids);
        userRoleMapper.delete(wrapper);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updatePassword(Long id, String password) {
        User user = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(password));
        updateById(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, Integer status) {
        User user = Optional.ofNullable(getById(id))
            .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(status);
        updateById(user);
    }

    @Override
    public List<UserVO> listUsersByRole(Long roleId) {
        LambdaQueryWrapper<UserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRole::getRoleId, roleId);
        List<UserRole> relations = userRoleMapper.selectList(wrapper);
        if (CollectionUtils.isEmpty(relations)) {
            return Collections.emptyList();
        }
        Set<Long> userIds = relations.stream().map(UserRole::getUserId).collect(Collectors.toSet());
        List<User> users = this.listByIds(userIds);
        return users.stream().map(this::toUserVO).toList();
    }

    private void bindRoles(Long userId, List<Long> roleIds) {
        LambdaQueryWrapper<UserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRole::getUserId, userId);
        userRoleMapper.delete(wrapper);
        if (CollectionUtils.isEmpty(roleIds)) {
            return;
        }
        List<UserRole> relations = new ArrayList<>();
        for (Long roleId : roleIds) {
            UserRole relation = new UserRole();
            relation.setUserId(userId);
            relation.setRoleId(roleId);
            relations.add(relation);
        }
        relations.forEach(userRoleMapper::insert);
    }

    private void validateUsernameUnique(String username) {
        boolean exists = lambdaQuery().eq(User::getUsername, username).exists();
        if (exists) {
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
    }

    private void validateUsernameUniqueForUpdate(String username, Long userId) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        wrapper.ne(User::getId, userId);
        if (this.count(wrapper) > 0) {
            throw new BusinessException(ErrorCode.USER_ALREADY_EXISTS);
        }
    }

    private UserVO toUserVO(User user) {
        return UserVO.builder()
            .id(user.getId())
            .username(user.getUsername())
            .realName(user.getRealName())
            .email(user.getEmail())
            .mobile(user.getMobile())
            .department(user.getDepartment())
            .status(user.getStatus())
            .createTime(user.getCreateTime())
            .updateTime(user.getUpdateTime())
            .roles(loadRoleSimples(user.getId()))
            .build();
    }

    private List<UserVO.RoleSimple> loadRoleSimples(Long userId) {
        LambdaQueryWrapper<UserRole> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(UserRole::getUserId, userId);
        List<UserRole> userRoles = userRoleMapper.selectList(wrapper);
        if (CollectionUtils.isEmpty(userRoles)) {
            return Collections.emptyList();
        }
        Set<Long> roleIds = userRoles.stream().map(UserRole::getRoleId).collect(Collectors.toSet());
        List<Role> roles = roleMapper.selectBatchIds(roleIds);
        if (CollectionUtils.isEmpty(roles)) {
            return Collections.emptyList();
        }
        return roles.stream()
            .map(role -> UserVO.RoleSimple.builder()
                .roleId(role.getId())
                .roleName(role.getRoleName())
                .roleCode(role.getRoleCode())
                .build())
            .collect(Collectors.toList());
    }

    private Long findRoleIdByCode(String roleCode) {
        if (!StringUtils.hasText(roleCode)) {
            return null;
        }
        LambdaQueryWrapper<Role> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Role::getRoleCode, roleCode);
        Role role = roleMapper.selectOne(wrapper);
        return role == null ? null : role.getId();
    }

    private void validateUserPayload(String username, String email, String mobile) {
        if (!ValidationUtil.isUsernameValid(username)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "用户名格式不正确");
        }
        if (StringUtils.hasText(email) && !ValidationUtil.isEmailValid(email)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "邮箱格式不正确");
        }
        if (StringUtils.hasText(mobile) && !ValidationUtil.isMobileValid(mobile)) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "手机号格式不正确");
        }
    }
}
