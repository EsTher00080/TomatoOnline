package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 自习室实体类
 * 对应数据库表：room
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("room")
public class Room {
    
    /**
     * 房间ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 房间名称
     */
    @TableField("room_name")
    private String roomName;
    
    /**
     * 创建者ID，逻辑外键
     */
    @TableField("creator_id")
    private Long creatorId;
    
    /**
     * 房间描述
     */
    @TableField("description")
    private String description;
    
    /**
     * 最大成员数
     */
    @TableField("max_members")
    private Integer maxMembers;
    
    /**
     * 当前成员数
     */
    @TableField("current_members")
    private Integer currentMembers;
    
    /**
     * 房间类型：1-公开，2-私密，3-密码房间
     */
    @TableField("room_type")
    private Integer roomType;
    
    /**
     * 房间密码（密码房间）
     */
    @TableField("password")
    private String password;
    
    /**
     * 房间状态：0-关闭，1-开放，2-已满
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 学习主题
     */
    @TableField("study_theme")
    private String studyTheme;
    
    /**
     * 背景音乐URL
     */
    @TableField("background_music")
    private String backgroundMusic;
    
    
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
