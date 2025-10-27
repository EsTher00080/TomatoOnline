package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.Room;
import com.example.pomodorostudy.service.RoomService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 自习室控制器
 * 提供自习室相关的CRUD接口
 */
@RestController
@RequestMapping("/api/room")
public class RoomController {
    
    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }


    /**
     * 获取自习室列表
     * @param current 当前页
     * @param size 每页大小
     * @param roomName 房间名称（可选筛选条件）
     * @param roomType 房间类型（可选筛选条件）
     * @param status 房间状态（可选筛选条件）
     * @return 自习室列表
     */
    @GetMapping("/list")
    public Result<Page<Room>> list(@RequestParam(defaultValue = "1") Integer current,
                                   @RequestParam(defaultValue = "10") Integer size,
                                   @RequestParam(required = false) String roomName,
                                   @RequestParam(required = false) Integer roomType,
                                   @RequestParam(required = false) Integer status) {
        Page<Room> page = new Page<>(current, size);
        QueryWrapper<Room> queryWrapper = new QueryWrapper<>();
        if (roomName != null && !roomName.trim().isEmpty()) {
            queryWrapper.like("room_name", roomName);
        }
        if (roomType != null) {
            queryWrapper.eq("room_type", roomType);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("create_time");
        Page<Room> result = roomService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加自习室
     * @param room 自习室信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody Room room) {
        try {
            roomService.save(room);
            return Result.success("自习室添加成功");
        } catch (Exception e) {
            return Result.error("自习室添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新自习室
     * @param room 自习室信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody Room room) {
        try {
            roomService.updateById(room);
            return Result.success("自习室更新成功");
        } catch (Exception e) {
            return Result.error("自习室更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除自习室
     * @param id 房间ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            roomService.removeById(id);
            return Result.success("自习室删除成功");
        } catch (Exception e) {
            return Result.error("自习室删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取自习室详情
     * @param id 房间ID
     * @return 自习室详情
     */
    @GetMapping("/{id}")
    public Result<Room> getById(@PathVariable Long id) {
        Room room = roomService.getById(id);
        if (room != null) {
            return Result.success(room);
        } else {
            return Result.error("自习室不存在");
        }
    }
    
    /**
     * 创建自习室
     * @param createRoomRequest 创建房间请求
     * @return 操作结果
     */
    @PostMapping("/create")
    public Result<Room> createRoom(@RequestBody CreateRoomRequest createRoomRequest) {
        try {
            Room room = new Room();
            room.setRoomName(createRoomRequest.getRoomName());
            room.setCreatorId(createRoomRequest.getCreatorId());
            room.setDescription(createRoomRequest.getDescription());
            room.setMaxMembers(createRoomRequest.getMaxMembers() != null ? createRoomRequest.getMaxMembers() : 20);
            room.setCurrentMembers(0);
            room.setRoomType(createRoomRequest.getRoomType() != null ? createRoomRequest.getRoomType() : 1);
            room.setPassword(createRoomRequest.getPassword());
            room.setStatus(1); // 开放状态
            room.setStudyTheme(createRoomRequest.getStudyTheme());
            room.setBackgroundMusic(createRoomRequest.getBackgroundMusic());
            
            roomService.save(room);
            return Result.success(room);
        } catch (Exception e) {
            return Result.error("创建自习室失败：" + e.getMessage());
        }
    }
    
    /**
     * 加入自习室
     * @param joinRoomRequest 加入房间请求
     * @return 操作结果
     */
    @PostMapping("/join")
    public Result<String> joinRoom(@RequestBody JoinRoomRequest joinRoomRequest) {
        try {
            return roomService.joinRoom(joinRoomRequest.getUserId(), joinRoomRequest.getRoomId(), joinRoomRequest.getPassword());
        } catch (Exception e) {
            return Result.error("加入自习室失败：" + e.getMessage());
        }
    }
    
    /**
     * 离开自习室
     * @param leaveRoomRequest 离开房间请求
     * @return 操作结果
     */
    @PostMapping("/leave")
    public Result<String> leaveRoom(@RequestBody LeaveRoomRequest leaveRoomRequest) {
        try {
            return roomService.leaveRoom(leaveRoomRequest.getUserId(), leaveRoomRequest.getRoomId());
        } catch (Exception e) {
            return Result.error("离开自习室失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取房间成员排名
     * @param roomId 房间ID
     * @return 成员排名列表
     */
    @GetMapping("/{roomId}/ranking")
    public Result<Object> getRoomRanking(@PathVariable Long roomId) {
        try {
            return roomService.getRoomRanking(roomId);
        } catch (Exception e) {
            return Result.error("获取房间排名失败：" + e.getMessage());
        }
    }
    
    /**
     * 开始学习
     * @param startStudyRequest 开始学习请求
     * @return 操作结果
     */
    @PostMapping("/start-study")
    public Result<String> startStudy(@RequestBody StartStudyRequest startStudyRequest) {
        try {
            return roomService.startStudy(startStudyRequest.getUserId(), startStudyRequest.getRoomId());
        } catch (Exception e) {
            return Result.error("开始学习失败：" + e.getMessage());
        }
    }
    
    /**
     * 结束学习
     * @param endStudyRequest 结束学习请求
     * @return 操作结果
     */
    @PostMapping("/end-study")
    public Result<String> endStudy(@RequestBody EndStudyRequest endStudyRequest) {
        try {
            return roomService.endStudy(endStudyRequest.getUserId(), endStudyRequest.getRoomId(), endStudyRequest.getStudyDuration());
        } catch (Exception e) {
            return Result.error("结束学习失败：" + e.getMessage());
        }
    }
    
    /**
     * 创建房间请求类
     */
    @Setter
    @Getter
    public static class CreateRoomRequest {
        // Getters and Setters
        private String roomName;
        private Long creatorId;
        private String description;
        private Integer maxMembers;
        private Integer roomType;
        private String password;
        private String studyTheme;
        private String backgroundMusic;

    }
    
    /**
     * 加入房间请求类
     */
    @Setter
    @Getter
    public static class JoinRoomRequest {
        // Getters and Setters
        private Long userId;
        private Long roomId;
        private String password;

    }
    
    /**
     * 离开房间请求类
     */
    @Setter
    @Getter
    public static class LeaveRoomRequest {
        // Getters and Setters
        private Long userId;
        private Long roomId;

    }
    
    /**
     * 开始学习请求类
     */
    @Setter
    @Getter
    public static class StartStudyRequest {
        // Getters and Setters
        private Long userId;
        private Long roomId;

    }
    
    /**
     * 结束学习请求类
     */
    @Setter
    @Getter
    public static class EndStudyRequest {
        // Getters and Setters
        private Long userId;
        private Long roomId;
        private Integer studyDuration;

    }
    
    
}
