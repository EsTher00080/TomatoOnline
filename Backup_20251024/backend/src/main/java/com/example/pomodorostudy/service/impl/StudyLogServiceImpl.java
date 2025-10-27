package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.StudyLog;
import com.example.pomodorostudy.mapper.StudyLogMapper;
import com.example.pomodorostudy.service.StudyLogService;
import org.springframework.stereotype.Service;

/**
 * 学习记录Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class StudyLogServiceImpl extends ServiceImpl<StudyLogMapper, StudyLog> implements StudyLogService {
    
}
