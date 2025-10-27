-- 修复数据库字段问题
-- 移除room表中的current_music字段（如果存在）
ALTER TABLE room DROP COLUMN IF EXISTS current_music;

-- 检查表结构
DESCRIBE room;
DESCRIBE user;

