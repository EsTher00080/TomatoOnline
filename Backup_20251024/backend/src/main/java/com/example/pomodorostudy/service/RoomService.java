package com.example.pomodorostudy.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.Room;

/**
 * 自习室Service接口
 * 继承MyBatis Plus的IService，提供基础CRUD操作
 */
public interface RoomService extends IService<Room> {
    
    /**
     * 加入自习室
     * @param userId 用户ID
     * @param roomId 房间ID
     * @param password 房间密码（如果需要）
     * @return 操作结果
     */
    Result<String> joinRoom(Long userId, Long roomId, String password);
    
    /**
     * 离开自习室
     * @param userId 用户ID
     * @param roomId 房间ID
     * @return 操作结果
     */
    Result<String> leaveRoom(Long userId, Long roomId);
    
    /**
     * 获取房间成员排名
     * @param roomId 房间ID
     * @return 成员排名列表
     */
    Result<Object> getRoomRanking(Long roomId);
    
    /**
     * 开始学习
     * @param userId 用户ID
     * @param roomId 房间ID
     * @return 操作结果
     */
    Result<String> startStudy(Long userId, Long roomId);
    
    /**
     * 结束学习
     * @param userId 用户ID
     * @param roomId 房间ID
     * @param studyDuration 学习时长（分钟）
     * @return 操作结果
     */
    Result<String> endStudy(Long userId, Long roomId, Integer studyDuration);
}
