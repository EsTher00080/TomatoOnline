package com.example.pomodorostudy.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.pomodorostudy.entity.Room;
import org.apache.ibatis.annotations.Mapper;

/**
 * 自习室Mapper接口
 * 继承MyBatis Plus的BaseMapper，提供基础CRUD操作
 */
@Mapper
public interface RoomMapper extends BaseMapper<Room> {
    
}
