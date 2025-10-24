package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 学习记录实体类
 * 对应数据库表：study_log
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("study_log")
public class StudyLog {
    
    /**
     * 学习记录ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID，逻辑外键
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 任务ID，逻辑外键
     */
    @TableField("task_id")
    private Long taskId;
    
    /**
     * 学习会话名称
     */
    @TableField("session_name")
    private String sessionName;
    
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
     * 专注时长（分钟）
     */
    @TableField("focus_duration")
    private Integer focusDuration;
    
    /**
     * 休息时长（分钟）
     */
    @TableField("break_duration")
    private Integer breakDuration;
    
    /**
     * 效率评分（0-10）
     */
    @TableField("efficiency_score")
    private Double efficiencyScore;
    
    /**
     * 学习笔记
     */
    @TableField("notes")
    private String notes;
    
    /**
     * 学习心情：1-很差，2-较差，3-一般，4-较好，5-很好
     */
    @TableField("mood")
    private Integer mood;
    
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
