package com.example.pomodorostudy.controller;

import com.example.pomodorostudy.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 首页控制器
 * 提供应用基本信息接口
 */
@RestController
@RequestMapping("/api")
public class HomeController {
    
    /**
     * 应用健康检查
     * @return 应用状态信息
     */
    @GetMapping("/")
    public Result<Map<String, Object>> home() {
        Map<String, Object> data = new HashMap<>();
        data.put("app", "番茄自习室");
        data.put("version", "1.0.0");
        data.put("description", "在线自律学习平台");
        data.put("status", "running");
        data.put("timestamp", LocalDateTime.now());
        data.put("endpoints", new String[]{
            "/user - 用户管理",
            "/pomodoro_task - 番茄任务管理", 
            "/study_log - 学习记录管理",
            "/room - 自习室管理",
            "/achievement - 成就管理",
            "/rank_record - 排行榜管理"
        });
        return Result.success(data);
    }
    
    /**
     * 健康检查接口
     * @return 健康状态
     */
    @GetMapping("/health")
    public Result<String> health() {
        return Result.success("OK");
    }
}
