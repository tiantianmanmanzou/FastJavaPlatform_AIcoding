package com.template.module.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.template.module.user.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
