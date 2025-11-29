package com.template.module.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.template.common.response.PageResult;
import com.template.module.user.dto.UserCreateRequest;
import com.template.module.user.dto.UserQueryRequest;
import com.template.module.user.dto.UserUpdateRequest;
import com.template.module.user.dto.UserVO;
import com.template.module.user.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService extends IService<User> {

    Optional<User> findByUsername(String username);

    UserVO getUserDetail(Long id);

    PageResult<UserVO> pageUsers(UserQueryRequest request);

    UserVO createUser(UserCreateRequest request);

    UserVO updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);

    void deleteUsers(List<Long> ids);

    void updatePassword(Long id, String password);

    void updateStatus(Long id, Integer status);

    List<UserVO> listUsersByRole(Long roleId);
}
