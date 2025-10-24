package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.Achievement;
import com.example.pomodorostudy.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 成就控制器
 * 提供成就相关的CRUD接口
 */
@RestController
@RequestMapping("/api/achievement")
public class AchievementController {
    
    @Autowired
    private AchievementService achievementService;
    
    /**
     * 获取成就列表
     * @param current 当前页
     * @param size 每页大小
     * @param userId 用户ID（可选筛选条件）
     * @param achievementType 成就类型（可选筛选条件）
     * @return 成就列表
     */
    @GetMapping("/list")
    public Result<Page<Achievement>> list(@RequestParam(defaultValue = "1") Integer current,
                                          @RequestParam(defaultValue = "10") Integer size,
                                          @RequestParam(required = false) Long userId,
                                          @RequestParam(required = false) String achievementType) {
        Page<Achievement> page = new Page<>(current, size);
        QueryWrapper<Achievement> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (achievementType != null && !achievementType.trim().isEmpty()) {
            queryWrapper.eq("achievement_type", achievementType);
        }
        queryWrapper.orderByDesc("achieved_time");
        Page<Achievement> result = achievementService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加成就
     * @param achievement 成就信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody Achievement achievement) {
        try {
            achievementService.save(achievement);
            return Result.success("成就添加成功");
        } catch (Exception e) {
            return Result.error("成就添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新成就
     * @param achievement 成就信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody Achievement achievement) {
        try {
            achievementService.updateById(achievement);
            return Result.success("成就更新成功");
        } catch (Exception e) {
            return Result.error("成就更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除成就
     * @param id 成就ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            achievementService.removeById(id);
            return Result.success("成就删除成功");
        } catch (Exception e) {
            return Result.error("成就删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取成就详情
     * @param id 成就ID
     * @return 成就详情
     */
    @GetMapping("/{id}")
    public Result<Achievement> getById(@PathVariable Long id) {
        Achievement achievement = achievementService.getById(id);
        if (achievement != null) {
            return Result.success(achievement);
        } else {
            return Result.error("成就不存在");
        }
    }
}
