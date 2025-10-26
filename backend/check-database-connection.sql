-- 检查数据库连接和表结构
-- 执行此SQL来验证数据库状态

-- 1. 检查数据库是否存在
SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'pomodoro_study_db';

-- 2. 检查user表是否存在
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'pomodoro_study_db' AND TABLE_NAME = 'user';

-- 3. 检查user表结构
DESCRIBE user;

-- 4. 检查user表数据
SELECT COUNT(*) as user_count FROM user;

-- 5. 如果表不存在，执行以下创建语句
-- 注意：请根据实际需要执行

-- 创建数据库（如果不存在）
-- CREATE DATABASE IF NOT EXISTS pomodoro_study_db 
-- CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
-- USE pomodoro_study_db;

-- 创建user表（如果不存在）
-- CREATE TABLE IF NOT EXISTS `user` (
--     `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
--     `username` VARCHAR(50) NOT NULL COMMENT '用户名，唯一',
--     `password` VARCHAR(255) NOT NULL COMMENT '密码，加密存储',
--     `email` VARCHAR(100) NOT NULL COMMENT '邮箱地址，唯一',
--     `avatar` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
--     `signature` VARCHAR(200) DEFAULT NULL COMMENT '个性签名',
--     `consecutive_days` INT DEFAULT 0 COMMENT '连续打卡天数',
--     `total_study_time` INT DEFAULT 0 COMMENT '总学习时长（分钟）',
--     `status` TINYINT DEFAULT 1 COMMENT '用户状态：0-禁用，1-正常',
--     `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
--     `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
--     PRIMARY KEY (`id`),
--     UNIQUE KEY `uk_username` (`username`),
--     UNIQUE KEY `uk_email` (`email`),
--     KEY `idx_status` (`status`),
--     KEY `idx_create_time` (`create_time`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';



