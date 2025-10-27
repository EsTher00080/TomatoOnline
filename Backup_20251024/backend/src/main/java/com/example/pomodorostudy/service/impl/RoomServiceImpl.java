package com.example.pomodorostudy.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.Room;
import com.example.pomodorostudy.entity.RoomMember;
import com.example.pomodorostudy.entity.User;
import com.example.pomodorostudy.mapper.RoomMapper;
import com.example.pomodorostudy.service.RoomMemberService;
import com.example.pomodorostudy.service.RoomService;
import com.example.pomodorostudy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 自习室Service实现类
 * 继承MyBatis Plus的ServiceImpl，提供基础CRUD操作
 */
@Service
public class RoomServiceImpl extends ServiceImpl<RoomMapper, Room> implements RoomService {
    
    @Autowired
    private RoomMemberService roomMemberService;
    
    @Autowired
    private UserService userService;
    
    @Override
    @Transactional
    public Result<String> joinRoom(Long userId, Long roomId, String password) {
        try {
            // 检查房间是否存在
            Room room = this.getById(roomId);
            if (room == null) {
                return Result.error("房间不存在");
            }
            
            // 检查房间状态
            if (room.getStatus() != 1) {
                return Result.error("房间已关闭或已满");
            }
            
            // 检查房间是否已满
            if (room.getCurrentMembers() >= room.getMaxMembers()) {
                return Result.error("房间已满");
            }
            
            // 检查密码（如果是密码房间）
            if (room.getRoomType() == 3 && !room.getPassword().equals(password)) {
                return Result.error("房间密码错误");
            }
            
            // 检查用户是否已经在房间中
            QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId).eq("room_id", roomId).eq("status", 1);
            RoomMember existingMember = roomMemberService.getOne(queryWrapper);
            if (existingMember != null) {
                return Result.error("您已经在该房间中");
            }
            
            // 创建房间成员记录
            RoomMember roomMember = new RoomMember();
            roomMember.setUserId(userId);
            roomMember.setRoomId(roomId);
            roomMember.setJoinTime(LocalDateTime.now());
            roomMember.setStatus(1); // 在线
            roomMember.setRole(0); // 普通成员
            roomMember.setStudyDuration(0);
            roomMember.setLastActiveTime(LocalDateTime.now());
            
            roomMemberService.save(roomMember);
            
            // 更新房间当前成员数
            room.setCurrentMembers(room.getCurrentMembers() + 1);
            this.updateById(room);
            
            return Result.success("成功加入房间");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("加入房间失败：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public Result<String> leaveRoom(Long userId, Long roomId) {
        try {
            // 查找房间成员记录
            QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId).eq("room_id", roomId).eq("status", 1);
            RoomMember roomMember = roomMemberService.getOne(queryWrapper);
            
            if (roomMember == null) {
                return Result.error("您不在该房间中");
            }
            
            // 更新成员状态为已离开
            roomMember.setStatus(0);
            roomMember.setLeaveTime(LocalDateTime.now());
            roomMemberService.updateById(roomMember);
            
            // 更新房间当前成员数
            Room room = this.getById(roomId);
            if (room != null) {
                room.setCurrentMembers(Math.max(0, room.getCurrentMembers() - 1));
                this.updateById(room);
            }
            
            return Result.success("成功离开房间");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("离开房间失败：" + e.getMessage());
        }
    }
    
    @Override
    public Result<Object> getRoomRanking(Long roomId) {
        try {
            // 获取房间信息
            Room room = this.getById(roomId);
            if (room == null) {
                return Result.error("房间不存在");
            }
            
            // 获取房间成员按学习时长排序
            QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("room_id", roomId).eq("status", 1);
            queryWrapper.orderByDesc("study_duration");
            List<RoomMember> members = roomMemberService.list(queryWrapper);
            
            // 构建排名数据
            Map<String, Object> result = new HashMap<>();
            result.put("roomId", roomId);
            result.put("roomName", room.getRoomName());
            result.put("totalMembers", members.size());
            
            // 构建成员排名列表
            for (int i = 0; i < members.size(); i++) {
                RoomMember member = members.get(i);
                User user = userService.getById(member.getUserId());
                
                Map<String, Object> memberInfo = new HashMap<>();
                memberInfo.put("rank", i + 1);
                memberInfo.put("userId", member.getUserId());
                memberInfo.put("username", user != null ? user.getUsername() : "未知用户");
                memberInfo.put("studyDuration", member.getStudyDuration());
                memberInfo.put("joinTime", member.getJoinTime());
                memberInfo.put("lastActiveTime", member.getLastActiveTime());
                memberInfo.put("role", member.getRole());
                
                members.set(i, member); // 这里需要重新构建数据结构
            }
            
            result.put("members", members);
            return Result.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("获取房间排名失败：" + e.getMessage());
        }
    }
    
    @Override
    public Result<String> startStudy(Long userId, Long roomId) {
        try {
            // 检查用户是否在房间中
            QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId).eq("room_id", roomId).eq("status", 1);
            RoomMember roomMember = roomMemberService.getOne(queryWrapper);
            
            if (roomMember == null) {
                return Result.error("您不在该房间中");
            }
            
            // 更新最后活跃时间
            roomMember.setLastActiveTime(LocalDateTime.now());
            roomMemberService.updateById(roomMember);
            
            return Result.success("开始学习");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("开始学习失败：" + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public Result<String> endStudy(Long userId, Long roomId, Integer studyDuration) {
        try {
            // 检查用户是否在房间中
            QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("user_id", userId).eq("room_id", roomId).eq("status", 1);
            RoomMember roomMember = roomMemberService.getOne(queryWrapper);
            
            if (roomMember == null) {
                return Result.error("您不在该房间中");
            }
            
            // 更新学习时长
            roomMember.setStudyDuration(roomMember.getStudyDuration() + studyDuration);
            roomMember.setLastActiveTime(LocalDateTime.now());
            roomMemberService.updateById(roomMember);
            
            // 更新用户总学习时长
            User user = userService.getById(userId);
            if (user != null) {
                user.setTotalStudyTime(user.getTotalStudyTime() + studyDuration);
                userService.updateById(user);
            }
            
            return Result.success("学习结束，本次学习时长：" + studyDuration + "分钟");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.error("结束学习失败：" + e.getMessage());
        }
    }
}
