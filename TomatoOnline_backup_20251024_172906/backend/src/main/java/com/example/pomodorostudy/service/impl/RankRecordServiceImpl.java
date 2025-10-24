package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.RankRecord;
import com.example.pomodorostudy.mapper.RankRecordMapper;
import com.example.pomodorostudy.service.RankRecordService;
import org.springframework.stereotype.Service;

/**
 * 排行榜记录Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class RankRecordServiceImpl extends ServiceImpl<RankRecordMapper, RankRecord> implements RankRecordService {
    
}
