package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 番茄任务实体类
 * 对应数据库表：pomodoro_task
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("pomodoro_task")
public class PomodoroTask {
    
    /**
     * 任务ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID，逻辑外键
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 任务名称
     */
    @TableField("task_name")
    private String taskName;
    
    /**
     * 任务描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 计划时长（分钟）
     */
    @TableField("planned_duration")
    private Integer plannedDuration;
    
    /**
     * 实际完成时长（分钟）
     */
    @TableField("actual_duration")
    private Integer actualDuration;
    
    /**
     * 任务状态：0-未开始，1-进行中，2-已完成，3-已取消
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 优先级：1-低，2-中，3-高
     */
    @TableField("priority")
    private Integer priority;
    
    /**
     * 任务分类
     */
    @TableField("category")
    private String category;
    
    /**
     * 开始时间
     */
    @TableField("start_time")
    private LocalDateTime startTime;
    
    /**
     * 结束时间
     */
    @TableField("end_time")
    private LocalDateTime endTime;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
