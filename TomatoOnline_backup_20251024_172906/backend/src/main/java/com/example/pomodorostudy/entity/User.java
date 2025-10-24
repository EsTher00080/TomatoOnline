package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库表：user
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("user")
public class User {
    
    /**
     * 用户ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户名，唯一
     */
    @TableField("username")
    private String username;
    
    /**
     * 密码，加密存储
     */
    @TableField("password")
    private String password;
    
    /**
     * 邮箱地址，唯一
     */
    @TableField("email")
    private String email;
    
    /**
     * 头像URL
     */
    @TableField("avatar")
    private String avatar;
    
    /**
     * 个性签名
     */
    @TableField("signature")
    private String signature;
    
    /**
     * 连续打卡天数
     */
    @TableField("consecutive_days")
    private Integer consecutiveDays;
    
    /**
     * 总学习时长（分钟）
     */
    @TableField("total_study_time")
    private Integer totalStudyTime;
    
    /**
     * 用户状态：0-禁用，1-正常
     */
    @TableField("status")
    private Integer status;
    
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
