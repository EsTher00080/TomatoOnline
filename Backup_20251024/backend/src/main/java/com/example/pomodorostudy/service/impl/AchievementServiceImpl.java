package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.Achievement;
import com.example.pomodorostudy.mapper.AchievementMapper;
import com.example.pomodorostudy.service.AchievementService;
import org.springframework.stereotype.Service;

/**
 * 成就Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class AchievementServiceImpl extends ServiceImpl<AchievementMapper, Achievement> implements AchievementService {
    
}
