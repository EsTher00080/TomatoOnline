package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 成就实体类
 * 对应数据库表：achievement
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("achievement")
public class Achievement {
    
    /**
     * 成就ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID，逻辑外键
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 成就名称
     */
    @TableField("achievement_name")
    private String achievementName;
    
    /**
     * 成就类型
     */
    @TableField("achievement_type")
    private String achievementType;
    
    /**
     * 成就描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 成就图标URL
     */
    @TableField("icon_url")
    private String iconUrl;
    
    /**
     * 成就积分
     */
    @TableField("points")
    private Integer points;
    
    /**
     * 解锁条件描述
     */
    @TableField("unlock_condition")
    private String unlockCondition;
    
    /**
     * 达成时间
     */
    @TableField("achieved_time")
    private LocalDateTime achievedTime;
    
    /**
     * 是否已通知：0-未通知，1-已通知
     */
    @TableField("is_notified")
    private Integer isNotified;
    
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
