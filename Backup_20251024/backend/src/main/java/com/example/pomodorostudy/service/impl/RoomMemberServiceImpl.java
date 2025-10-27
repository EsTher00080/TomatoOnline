package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.entity.RoomMember;
import com.example.pomodorostudy.mapper.RoomMemberMapper;
import com.example.pomodorostudy.service.RoomMemberService;
import org.springframework.stereotype.Service;

/**
 * 房间成员Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class RoomMemberServiceImpl extends ServiceImpl<RoomMemberMapper, RoomMember> implements RoomMemberService {
    
}
