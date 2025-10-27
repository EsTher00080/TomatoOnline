package com.example.pomodorostudy.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pomodorostudy.entity.PomodoroTask;
import org.apache.ibatis.annotations.Mapper;

/**
 * 番茄任务Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 */
@Mapper
public interface PomodoroTaskMapper extends BaseMapper<PomodoroTask> {
    
}
