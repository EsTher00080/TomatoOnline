package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.StudyLog;
import com.example.pomodorostudy.service.StudyLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 学习记录控制器
 * 提供学习记录相关的CRUD接口
 */
@RestController
@RequestMapping("/api/study_log")
public class StudyLogController {
    
    @Autowired
    private StudyLogService studyLogService;
    
    /**
     * 获取学习记录列表
     * @param current 当前页
     * @param size 每页大小
     * @param userId 用户ID（可选筛选条件）
     * @param taskId 任务ID（可选筛选条件）
     * @return 学习记录列表
     */
    @GetMapping("/list")
    public Result<Page<StudyLog>> list(@RequestParam(defaultValue = "1") Integer current,
                                       @RequestParam(defaultValue = "10") Integer size,
                                       @RequestParam(required = false) Long userId,
                                       @RequestParam(required = false) Long taskId) {
        Page<StudyLog> page = new Page<>(current, size);
        QueryWrapper<StudyLog> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (taskId != null) {
            queryWrapper.eq("task_id", taskId);
        }
        queryWrapper.orderByDesc("start_time");
        Page<StudyLog> result = studyLogService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加学习记录
     * @param studyLog 学习记录信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody StudyLog studyLog) {
        try {
            studyLogService.save(studyLog);
            return Result.success("学习记录添加成功");
        } catch (Exception e) {
            return Result.error("学习记录添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新学习记录
     * @param studyLog 学习记录信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody StudyLog studyLog) {
        try {
            studyLogService.updateById(studyLog);
            return Result.success("学习记录更新成功");
        } catch (Exception e) {
            return Result.error("学习记录更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除学习记录
     * @param id 学习记录ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            studyLogService.removeById(id);
            return Result.success("学习记录删除成功");
        } catch (Exception e) {
            return Result.error("学习记录删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取学习记录详情
     * @param id 学习记录ID
     * @return 学习记录详情
     */
    @GetMapping("/{id}")
    public Result<StudyLog> getById(@PathVariable Long id) {
        StudyLog studyLog = studyLogService.getById(id);
        if (studyLog != null) {
            return Result.success(studyLog);
        } else {
            return Result.error("学习记录不存在");
        }
    }
}
