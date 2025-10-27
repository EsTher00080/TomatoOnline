package com.example.pomodorostudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.pomodorostudy.entity.User;

/**
 * 用户Service接口
 * 继承MyBatis Plus的IService，提供基础CRUD操作
 */
public interface UserService extends IService<User> {
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 用户信息
     */
    User findByUsername(String username);
    
    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);
    
    /**
     * 用户登录验证
     * @param username 用户名
     * @param password 密码
     * @return 用户信息，验证失败返回null
     */
    User validateLogin(String username, String password);
}
