package com.example.pomodorostudy.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 房间成员实体类
 * 对应数据库表：room_member
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("room_member")
public class RoomMember {
    
    /**
     * 成员关系ID，主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID，逻辑外键
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 房间ID，逻辑外键
     */
    @TableField("room_id")
    private Long roomId;
    
    /**
     * 加入时间
     */
    @TableField("join_time")
    private LocalDateTime joinTime;
    
    /**
     * 离开时间
     */
    @TableField("leave_time")
    private LocalDateTime leaveTime;
    
    /**
     * 成员状态：0-已离开，1-在线，2-离线
     */
    @TableField("status")
    private Integer status;
    
    /**
     * 角色：0-普通成员，1-管理员，2-房主
     */
    @TableField("role")
    private Integer role;
    
    /**
     * 在房间内学习时长（分钟）
     */
    @TableField("study_duration")
    private Integer studyDuration;
    
    /**
     * 最后活跃时间
     */
    @TableField("last_active_time")
    private LocalDateTime lastActiveTime;
    
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
