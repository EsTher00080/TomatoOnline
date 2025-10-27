package com.example.pomodorostudy.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pomodorostudy.entity.Achievement;
import org.apache.ibatis.annotations.Mapper;

/**
 * 成就Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 */
@Mapper
public interface AchievementMapper extends BaseMapper<Achievement> {
    
}
