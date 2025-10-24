package com.example.pomodorostudy.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pomodorostudy.entity.StudyLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 学习记录Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 */
@Mapper
public interface StudyLogMapper extends BaseMapper<StudyLog> {
    
}
