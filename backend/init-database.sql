-- 番茄自习室数据库初始化脚本
-- 执行此脚本来创建完整的数据库结构

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS pomodoro_study_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 使用数据库
USE pomodoro_study_db;

-- 3. 创建用户表
CREATE TABLE IF NOT EXISTS `user` (
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

-- 4. 插入测试用户数据
INSERT INTO `user` (`username`, `password`, `email`, `avatar`, `signature`, `consecutive_days`, `total_study_time`, `status`) VALUES
('admin', 'admin123', 'admin@example.com', NULL, '管理员账号', 0, 0, 1),
('testuser', 'test123', 'test@example.com', NULL, '测试用户', 0, 0, 1),
('demo', 'demo123', 'demo@example.com', NULL, '演示用户', 0, 0, 1);

-- 5. 验证数据插入
SELECT * FROM user;

