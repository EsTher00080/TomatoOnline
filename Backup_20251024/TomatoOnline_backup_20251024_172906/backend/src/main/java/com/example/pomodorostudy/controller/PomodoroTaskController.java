package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.PomodoroTask;
import com.example.pomodorostudy.service.PomodoroTaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 番茄任务控制器
 * 提供番茄任务相关的CRUD接口
 */
@RestController
@RequestMapping("/api/pomodoro_task")
public class PomodoroTaskController {
    
    @Autowired
    private PomodoroTaskService pomodoroTaskService;
    
    /**
     * 获取番茄任务列表
     * @param current 当前页
     * @param size 每页大小
     * @param userId 用户ID（可选筛选条件）
     * @param status 任务状态（可选筛选条件）
     * @return 番茄任务列表
     */
    @GetMapping("/list")
    public Result<Page<PomodoroTask>> list(@RequestParam(defaultValue = "1") Integer current,
                                           @RequestParam(defaultValue = "10") Integer size,
                                           @RequestParam(required = false) Long userId,
                                           @RequestParam(required = false) Integer status) {
        Page<PomodoroTask> page = new Page<>(current, size);
        QueryWrapper<PomodoroTask> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        Page<PomodoroTask> result = pomodoroTaskService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加番茄任务
     * @param pomodoroTask 番茄任务信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody PomodoroTask pomodoroTask) {
        try {
            // 设置默认值
            if (pomodoroTask.getUserId() == null) {
                pomodoroTask.setUserId(1L); // 默认用户ID
            }
            if (pomodoroTask.getStatus() == null) {
                pomodoroTask.setStatus(0); // 0-未开始
            }
            if (pomodoroTask.getPriority() == null) {
                pomodoroTask.setPriority(2); // 2-中等优先级
            }
            if (pomodoroTask.getCategory() == null) {
                pomodoroTask.setCategory("学习"); // 默认分类
            }
            
            pomodoroTaskService.save(pomodoroTask);
            return Result.success("番茄任务添加成功");
        } catch (Exception e) {
            e.printStackTrace(); // 打印详细错误信息
            return Result.error("番茄任务添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新番茄任务
     * @param pomodoroTask 番茄任务信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody PomodoroTask pomodoroTask) {
        try {
            pomodoroTaskService.updateById(pomodoroTask);
            return Result.success("番茄任务更新成功");
        } catch (Exception e) {
            return Result.error("番茄任务更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除番茄任务
     * @param id 任务ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            pomodoroTaskService.removeById(id);
            return Result.success("番茄任务删除成功");
        } catch (Exception e) {
            return Result.error("番茄任务删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取番茄任务详情
     * @param id 任务ID
     * @return 番茄任务详情
     */
    @GetMapping("/{id}")
    public Result<PomodoroTask> getById(@PathVariable Long id) {
        PomodoroTask pomodoroTask = pomodoroTaskService.getById(id);
        if (pomodoroTask != null) {
            return Result.success(pomodoroTask);
        } else {
            return Result.error("番茄任务不存在");
        }
    }
}
