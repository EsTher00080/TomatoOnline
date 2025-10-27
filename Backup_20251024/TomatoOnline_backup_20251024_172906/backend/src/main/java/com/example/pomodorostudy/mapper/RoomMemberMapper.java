package com.example.pomodorostudy.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pomodorostudy.entity.RoomMember;
import org.apache.ibatis.annotations.Mapper;

/**
 * 房间成员Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 */
@Mapper
public interface RoomMemberMapper extends BaseMapper<RoomMember> {
    
}
