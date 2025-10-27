package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 排行榜记录实体类
 * 对应数据库表：rank_record
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("rank_record")
public class RankRecord {
    
    /**
     * 排行记录ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID，逻辑外键
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 学习时长（分钟）
     */
    @TableField("study_duration")
    private Integer studyDuration;
    
    /**
     * 排行类型：1-日榜，2-周榜，3-月榜，4-总榜
     */
    @TableField("rank_type")
    private Integer rankType;
    
    /**
     * 排名位置
     */
    @TableField("rank_position")
    private Integer rankPosition;
    
    /**
     * 排行日期
     */
    @TableField("rank_date")
    private LocalDate rankDate;
    
    /**
     * 专注会话数
     */
    @TableField("focus_sessions")
    private Integer focusSessions;
    
    /**
     * 完成任务数
     */
    @TableField("completed_tasks")
    private Integer completedTasks;
    
    /**
     * 平均效率评分
     */
    @TableField("efficiency_avg")
    private Double efficiencyAvg;
    
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
