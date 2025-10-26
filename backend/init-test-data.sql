-- 初始化测试数据脚本
USE pomodoro_study_db;

-- 清空现有用户数据（可选）
-- DELETE FROM user;

-- 插入测试用户数据
INSERT INTO user (username, password, email, avatar, signature, consecutive_days, total_study_time, status) VALUES
('testuser', 'test123', 'test@example.com', NULL, '测试用户', 0, 0, 1),
('admin', 'admin123', 'admin@example.com', NULL, '管理员', 0, 0, 1),
('demo', 'demo123', 'demo@example.com', NULL, '演示用户', 0, 0, 1),
('user1', 'password123', 'user1@example.com', NULL, '用户1', 0, 0, 1),
('user2', 'password123', 'user2@example.com', NULL, '用户2', 0, 0, 1)
ON DUPLICATE KEY UPDATE 
password = VALUES(password),
email = VALUES(email),
signature = VALUES(signature);

-- 验证数据
SELECT id, username, email, status, create_time FROM user;



