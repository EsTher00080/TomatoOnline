package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.PomodoroTask;
import com.example.pomodorostudy.mapper.PomodoroTaskMapper;
import com.example.pomodorostudy.service.PomodoroTaskService;
import org.springframework.stereotype.Service;

/**
 * 番茄任务Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class PomodoroTaskServiceImpl extends ServiceImpl<PomodoroTaskMapper, PomodoroTask> implements PomodoroTaskService {
    
}
