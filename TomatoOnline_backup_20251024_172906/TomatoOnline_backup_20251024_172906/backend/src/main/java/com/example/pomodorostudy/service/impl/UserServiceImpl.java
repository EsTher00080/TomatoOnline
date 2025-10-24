package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.User;
import com.example.pomodorostudy.mapper.UserMapper;
import com.example.pomodorostudy.service.UserService;
import org.springframework.stereotype.Service;

/**
 * 用户Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Override
    public User findByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return getOne(queryWrapper);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username", username);
        return count(queryWrapper) > 0;
    }
    
    @Override
    public User validateLogin(String username, String password) {
        User user = findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
}
