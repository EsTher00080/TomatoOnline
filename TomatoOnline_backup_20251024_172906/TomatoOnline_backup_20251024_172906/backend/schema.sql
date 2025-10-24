-- =============================================
-- 番茄自习室（Pomodoro Study Room）数据库设计
-- 技术栈：MySQL 8.0 + Spring Boot + MyBatis Plus + Vue3 + Element Plus
-- 字符集：utf8mb4
-- 外键策略：逻辑关联（存储id）
-- =============================================

-- 1. 用户表
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名，唯一',
    `password` VARCHAR(255) NOT NULL COMMENT '密码，加密存储',
    `email` VARCHAR(100) NOT NULL COMMENT '邮箱地址，唯一',
    `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
    `consecutive_days` INT DEFAULT 0 COMMENT '连续打卡天数',
    `total_study_time` INT DEFAULT 0 COMMENT '总学习时长（分钟）',
    `status` TINYINT DEFAULT 1 COMMENT '用户状态：0-禁用，1-正常',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 番茄任务表
CREATE TABLE `pomodoro_task` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '任务ID，主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID，逻辑外键',
    `task_name` VARCHAR(100) NOT NULL COMMENT '任务名称',
    `description` TEXT DEFAULT NULL COMMENT '任务描述',
    `planned_duration` INT NOT NULL COMMENT '计划时长（分钟）',
    `actual_duration` INT DEFAULT 0 COMMENT '实际完成时长（分钟）',
    `status` TINYINT DEFAULT 0 COMMENT '任务状态：0-未开始，1-进行中，2-已完成，3-已取消',
    `priority` TINYINT DEFAULT 1 COMMENT '优先级：1-低，2-中，3-高',
    `category` VARCHAR(50) DEFAULT NULL COMMENT '任务分类',
    `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
    `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    KEY `idx_priority` (`priority`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='番茄任务表';

-- 3. 学习记录表
CREATE TABLE `study_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '学习记录ID，主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID，逻辑外键',
    `task_id` BIGINT DEFAULT NULL COMMENT '任务ID，逻辑外键',
    `session_name` VARCHAR(100) DEFAULT NULL COMMENT '学习会话名称',
    `start_time` DATETIME NOT NULL COMMENT '开始时间',
    `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
    `focus_duration` INT DEFAULT 0 COMMENT '专注时长（分钟）',
    `break_duration` INT DEFAULT 0 COMMENT '休息时长（分钟）',
    `efficiency_score` DECIMAL(3,1) DEFAULT NULL COMMENT '效率评分（0-10）',
    `notes` TEXT DEFAULT NULL COMMENT '学习笔记',
    `mood` TINYINT DEFAULT NULL COMMENT '学习心情：1-很差，2-较差，3-一般，4-较好，5-很好',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_task_id` (`task_id`),
    KEY `idx_start_time` (`start_time`),
    KEY `idx_focus_duration` (`focus_duration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学习记录表';

-- 4. 自习室表
CREATE TABLE `room` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '房间ID，主键',
    `room_name` VARCHAR(100) NOT NULL COMMENT '房间名称',
    `creator_id` BIGINT NOT NULL COMMENT '创建者ID，逻辑外键',
    `description` TEXT DEFAULT NULL COMMENT '房间描述',
    `max_members` INT DEFAULT 20 COMMENT '最大成员数',
    `current_members` INT DEFAULT 0 COMMENT '当前成员数',
    `room_type` TINYINT DEFAULT 1 COMMENT '房间类型：1-公开，2-私密，3-密码房间',
    `password` VARCHAR(50) DEFAULT NULL COMMENT '房间密码（密码房间）',
    `status` TINYINT DEFAULT 1 COMMENT '房间状态：0-关闭，1-开放，2-已满',
    `study_theme` VARCHAR(50) DEFAULT NULL COMMENT '学习主题',
    `background_music` VARCHAR(200) DEFAULT NULL COMMENT '背景音乐URL',
    `current_music` VARCHAR(255) DEFAULT NULL COMMENT '当前播放音乐文件路径',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_creator_id` (`creator_id`),
    KEY `idx_room_type` (`room_type`),
    KEY `idx_status` (`status`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='自习室表';

-- 5. 房间成员表
CREATE TABLE `room_member` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '成员关系ID，主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID，逻辑外键',
    `room_id` BIGINT NOT NULL COMMENT '房间ID，逻辑外键',
    `join_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    `leave_time` DATETIME DEFAULT NULL COMMENT '离开时间',
    `status` TINYINT DEFAULT 1 COMMENT '成员状态：0-已离开，1-在线，2-离线',
    `role` TINYINT DEFAULT 0 COMMENT '角色：0-普通成员，1-管理员，2-房主',
    `study_duration` INT DEFAULT 0 COMMENT '在房间内学习时长（分钟）',
    `last_active_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '最后活跃时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_room` (`user_id`, `room_id`),
    KEY `idx_room_id` (`room_id`),
    KEY `idx_status` (`status`),
    KEY `idx_join_time` (`join_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间成员表';

-- 6. 成就表
CREATE TABLE `achievement` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '成就ID，主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID，逻辑外键',
    `achievement_name` VARCHAR(100) NOT NULL COMMENT '成就名称',
    `achievement_type` VARCHAR(50) NOT NULL COMMENT '成就类型',
    `description` TEXT DEFAULT NULL COMMENT '成就描述',
    `icon_url` VARCHAR(500) DEFAULT NULL COMMENT '成就图标URL',
    `points` INT DEFAULT 0 COMMENT '成就积分',
    `unlock_condition` TEXT DEFAULT NULL COMMENT '解锁条件描述',
    `achieved_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '达成时间',
    `is_notified` TINYINT DEFAULT 0 COMMENT '是否已通知：0-未通知，1-已通知',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_achievement_type` (`achievement_type`),
    KEY `idx_achieved_time` (`achieved_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成就表';

-- 7. 排行榜缓存表
CREATE TABLE `rank_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '排行记录ID，主键',
    `user_id` BIGINT NOT NULL COMMENT '用户ID，逻辑外键',
    `study_duration` INT NOT NULL COMMENT '学习时长（分钟）',
    `rank_type` TINYINT NOT NULL COMMENT '排行类型：1-日榜，2-周榜，3-月榜，4-总榜',
    `rank_position` INT NOT NULL COMMENT '排名位置',
    `rank_date` DATE NOT NULL COMMENT '排行日期',
    `focus_sessions` INT DEFAULT 0 COMMENT '专注会话数',
    `completed_tasks` INT DEFAULT 0 COMMENT '完成任务数',
    `efficiency_avg` DECIMAL(3,1) DEFAULT NULL COMMENT '平均效率评分',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_rank_date` (`user_id`, `rank_type`, `rank_date`),
    KEY `idx_rank_type` (`rank_type`),
    KEY `idx_rank_date` (`rank_date`),
    KEY `idx_rank_position` (`rank_position`),
    KEY `idx_study_duration` (`study_duration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='排行榜缓存表';

-- =============================================
-- 索引优化建议
-- =============================================

-- 为常用查询添加复合索引
ALTER TABLE `pomodoro_task` ADD INDEX `idx_user_status_time` (`user_id`, `status`, `create_time`);
ALTER TABLE `study_log` ADD INDEX `idx_user_time` (`user_id`, `start_time`);
ALTER TABLE `room_member` ADD INDEX `idx_room_status` (`room_id`, `status`);
ALTER TABLE `rank_record` ADD INDEX `idx_type_date_position` (`rank_type`, `rank_date`, `rank_position`);

-- =============================================
-- 数据初始化建议
-- =============================================

-- 插入默认成就类型数据（可选）
-- INSERT INTO `achievement` (`user_id`, `achievement_name`, `achievement_type`, `description`, `points`) VALUES
-- (0, '首次登录', 'login', '欢迎来到番茄自习室！', 10),
-- (0, '专注达人', 'focus', '连续专注学习30分钟', 50),
-- (0, '学习狂人', 'study', '单日学习超过4小时', 100);

-- =============================================
-- 对应的Java实体类
-- =============================================

/*
package com.pomodoro.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("user")
public class User {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("username")
    private String username;
    
    @TableField("password")
    private String password;
    
    @TableField("email")
    private String email;
    
    @TableField("avatar")
    private String avatar;
    
    @TableField("signature")
    private String signature;
    
    @TableField("consecutive_days")
    private Integer consecutiveDays;
    
    @TableField("total_study_time")
    private Integer totalStudyTime;
    
    @TableField("status")
    private Integer status;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 番茄任务实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("pomodoro_task")
public class PomodoroTask {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("task_name")
    private String taskName;
    
    @TableField("description")
    private String description;
    
    @TableField("planned_duration")
    private Integer plannedDuration;
    
    @TableField("actual_duration")
    private Integer actualDuration;
    
    @TableField("status")
    private Integer status;
    
    @TableField("priority")
    private Integer priority;
    
    @TableField("category")
    private String category;
    
    @TableField("start_time")
    private LocalDateTime startTime;
    
    @TableField("end_time")
    private LocalDateTime endTime;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 学习记录实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("study_log")
public class StudyLog {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("task_id")
    private Long taskId;
    
    @TableField("session_name")
    private String sessionName;
    
    @TableField("start_time")
    private LocalDateTime startTime;
    
    @TableField("end_time")
    private LocalDateTime endTime;
    
    @TableField("focus_duration")
    private Integer focusDuration;
    
    @TableField("break_duration")
    private Integer breakDuration;
    
    @TableField("efficiency_score")
    private Double efficiencyScore;
    
    @TableField("notes")
    private String notes;
    
    @TableField("mood")
    private Integer mood;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 自习室实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("room")
public class Room {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("room_name")
    private String roomName;
    
    @TableField("creator_id")
    private Long creatorId;
    
    @TableField("description")
    private String description;
    
    @TableField("max_members")
    private Integer maxMembers;
    
    @TableField("current_members")
    private Integer currentMembers;
    
    @TableField("room_type")
    private Integer roomType;
    
    @TableField("password")
    private String password;
    
    @TableField("status")
    private Integer status;
    
    @TableField("study_theme")
    private String studyTheme;
    
    @TableField("background_music")
    private String backgroundMusic;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 房间成员实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("room_member")
public class RoomMember {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("room_id")
    private Long roomId;
    
    @TableField("join_time")
    private LocalDateTime joinTime;
    
    @TableField("leave_time")
    private LocalDateTime leaveTime;
    
    @TableField("status")
    private Integer status;
    
    @TableField("role")
    private Integer role;
    
    @TableField("study_duration")
    private Integer studyDuration;
    
    @TableField("last_active_time")
    private LocalDateTime lastActiveTime;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 成就实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("achievement")
public class Achievement {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("achievement_name")
    private String achievementName;
    
    @TableField("achievement_type")
    private String achievementType;
    
    @TableField("description")
    private String description;
    
    @TableField("icon_url")
    private String iconUrl;
    
    @TableField("points")
    private Integer points;
    
    @TableField("unlock_condition")
    private String unlockCondition;
    
    @TableField("achieved_time")
    private LocalDateTime achievedTime;
    
    @TableField("is_notified")
    private Integer isNotified;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

/**
 * 排行榜记录实体类
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@TableName("rank_record")
public class RankRecord {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("study_duration")
    private Integer studyDuration;
    
    @TableField("rank_type")
    private Integer rankType;
    
    @TableField("rank_position")
    private Integer rankPosition;
    
    @TableField("rank_date")
    private LocalDate rankDate;
    
    @TableField("focus_sessions")
    private Integer focusSessions;
    
    @TableField("completed_tasks")
    private Integer completedTasks;
    
    @TableField("efficiency_avg")
    private Double efficiencyAvg;
    
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
*/
