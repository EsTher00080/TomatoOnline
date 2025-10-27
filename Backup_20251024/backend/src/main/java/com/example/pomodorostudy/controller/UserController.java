package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.User;
import com.example.pomodorostudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * 用户控制器
 * 提供用户相关的CRUD接口
 */
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 登录页面
     * @return 登录页面视图
     */
    @GetMapping("/login")
    public ModelAndView loginPage() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("redirect:/");
        modelAndView.addObject("showLoginModal", true);
        return modelAndView;
    }
    
    /**
     * 注册页面
     * @return 注册页面视图
     */
    @GetMapping("/register")
    public ModelAndView registerPage() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("redirect:/");
        modelAndView.addObject("showRegisterModal", true);
        return modelAndView;
    }
    
    /**
     * 登录提交处理
     * @param username 用户名
     * @param password 密码
     * @return 登录结果页面
     */
    @PostMapping("/loginSubmit")
    public ModelAndView loginSubmit(@RequestParam(required = false) String username, 
                                   @RequestParam(required = false) String password) {
        ModelAndView modelAndView = new ModelAndView();
        
        try {
            // 参数验证
            if (username == null || username.trim().isEmpty() || 
                password == null || password.trim().isEmpty()) {
                modelAndView.setViewName("redirect:/");
                modelAndView.addObject("error", "用户名和密码不能为空");
                return modelAndView;
            }
            
            // 使用Service层方法验证登录
            User user = userService.validateLogin(username, password);
            
            if (user != null) {
                // 登录成功
                modelAndView.setViewName("redirect:/");
                modelAndView.addObject("message", "登录成功");
                modelAndView.addObject("user", user);
            } else {
                // 登录失败
                modelAndView.setViewName("redirect:/");
                modelAndView.addObject("error", "用户名或密码错误");
            }
        } catch (Exception e) {
            modelAndView.setViewName("redirect:/");
            modelAndView.addObject("error", "登录失败：" + e.getMessage());
        }
        
        return modelAndView;
    }
    
    /**
     * 注册提交处理
     * @param username 用户名
     * @param email 邮箱
     * @param password 密码
     * @return 注册结果页面
     */
    @PostMapping("/registerSubmit")
    public ModelAndView registerSubmit(@RequestParam(required = false) String username, 
                                     @RequestParam(required = false) String email, 
                                     @RequestParam(required = false) String password) {
        ModelAndView modelAndView = new ModelAndView();
        
        try {
            // 参数验证
            if (username == null || username.trim().isEmpty() || 
                email == null || email.trim().isEmpty() ||
                password == null || password.trim().isEmpty()) {
                modelAndView.setViewName("redirect:/");
                modelAndView.addObject("error", "所有字段都不能为空");
                return modelAndView;
            }
            
            // 使用Service层方法检查用户名是否存在
            if (userService.existsByUsername(username)) {
                modelAndView.setViewName("redirect:/");
                modelAndView.addObject("error", "用户名已存在");
                return modelAndView;
            }
            
            // 创建新用户
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setAvatar("default-avatar.png");
            newUser.setSignature("这个人很懒，什么都没有留下");
            newUser.setConsecutiveDays(0);
            newUser.setTotalStudyTime(0);
            newUser.setStatus(1);
            
            userService.save(newUser);
            
            // 注册成功
            modelAndView.setViewName("redirect:/");
            modelAndView.addObject("message", "注册成功，请登录");
            
        } catch (Exception e) {
            modelAndView.setViewName("redirect:/");
            modelAndView.addObject("error", "注册失败：" + e.getMessage());
        }
        
        return modelAndView;
    }
    
    /**
     * 获取用户列表
     * @param current 当前页
     * @param size 每页大小
     * @param username 用户名（可选筛选条件）
     * @return 用户列表
     */
    @GetMapping("/list")
    public Result<Page<User>> list(@RequestParam(defaultValue = "1") Integer current,
                                   @RequestParam(defaultValue = "10") Integer size,
                                   @RequestParam(required = false) String username) {
        Page<User> page = new Page<>(current, size);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (username != null && !username.trim().isEmpty()) {
            queryWrapper.like("username", username);
        }
        queryWrapper.orderByDesc("create_time");
        Page<User> result = userService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加用户
     * @param user 用户信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody User user) {
        try {
            userService.save(user);
            return Result.success("用户添加成功");
        } catch (Exception e) {
            return Result.error("用户添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新用户
     * @param user 用户信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody User user) {
        try {
            userService.updateById(user);
            return Result.success("用户更新成功");
        } catch (Exception e) {
            return Result.error("用户更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除用户
     * @param id 用户ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            userService.removeById(id);
            return Result.success("用户删除成功");
        } catch (Exception e) {
            return Result.error("用户删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取用户详情
     * @param id 用户ID
     * @return 用户详情
     */
    @GetMapping("/{id}")
    public Result<User> getById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user != null) {
            return Result.success(user);
        } else {
            return Result.error("用户不存在");
        }
    }
    
    /**
     * 用户登录
     * @param loginRequest 登录请求（包含用户名和密码）
     * @return 登录结果
     */
    @PostMapping("/login")
    public Result<User> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("登录请求: " + loginRequest.getUsername() + ", " + loginRequest.getPassword());
            
            // 根据用户名查找用户
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", loginRequest.getUsername());
            User user = userService.getOne(queryWrapper);
            
            System.out.println("找到用户: " + (user != null ? user.getUsername() : "null"));
            
            if (user != null && user.getPassword().equals(loginRequest.getPassword())) {
                // 登录成功，返回用户信息（不包含密码）
                user.setPassword(null);
                return Result.success(user);
            } else {
                return Result.error("用户名或密码错误");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("登录失败：" + e.getMessage());
        }
    }
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<String> register(@RequestBody User user) {
        try {
            // 检查用户名是否已存在
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("username", user.getUsername());
            User existingUser = userService.getOne(queryWrapper);
            
            if (existingUser != null) {
                return Result.error("用户名已存在");
            }
            
            // 设置默认值
            if (user.getEmail() == null) {
                user.setEmail(user.getUsername() + "@example.com");
            }
            if (user.getAvatar() == null) {
                user.setAvatar("default-avatar.png");
            }
            if (user.getSignature() == null) {
                user.setSignature("这个人很懒，什么都没有留下");
            }
            if (user.getConsecutiveDays() == null) {
                user.setConsecutiveDays(0);
            }
            if (user.getTotalStudyTime() == null) {
                user.setTotalStudyTime(0);
            }
            
            userService.save(user);
            return Result.success("注册成功");
        } catch (Exception e) {
            return Result.error("注册失败：" + e.getMessage());
        }
    }
    
    /**
     * 登录请求类
     */
    public static class LoginRequest {
        private String username;
        private String password;
        
        public String getUsername() {
            return username;
        }
        
        public void setUsername(String username) {
            this.username = username;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
}
