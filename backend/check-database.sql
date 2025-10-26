-- 检查数据库表结构
DESCRIBE room;
DESCRIBE user;

-- 检查是否有current_music字段
SELECT COLUMN_NAME 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'room' 
AND COLUMN_NAME = 'current_music';

-- 如果存在，删除该字段
ALTER TABLE room DROP COLUMN IF EXISTS current_music;





