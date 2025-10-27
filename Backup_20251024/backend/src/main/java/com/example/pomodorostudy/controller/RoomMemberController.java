package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.RoomMember;
import com.example.pomodorostudy.service.RoomMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 房间成员控制器
 * 提供房间成员相关的CRUD接口
 */
@RestController
@RequestMapping("/api/room_member")
public class RoomMemberController {
    
    @Autowired
    private RoomMemberService roomMemberService;
    
    /**
     * 获取房间成员列表
     * @param current 当前页
     * @param size 每页大小
     * @param userId 用户ID（可选筛选条件）
     * @param roomId 房间ID（可选筛选条件）
     * @param status 成员状态（可选筛选条件）
     * @return 房间成员列表
     */
    @GetMapping("/list")
    public Result<Page<RoomMember>> list(@RequestParam(defaultValue = "1") Integer current,
                                          @RequestParam(defaultValue = "10") Integer size,
                                          @RequestParam(required = false) Long userId,
                                          @RequestParam(required = false) Long roomId,
                                          @RequestParam(required = false) Integer status) {
        Page<RoomMember> page = new Page<>(current, size);
        QueryWrapper<RoomMember> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (roomId != null) {
            queryWrapper.eq("room_id", roomId);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }
        queryWrapper.orderByDesc("join_time");
        Page<RoomMember> result = roomMemberService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加房间成员
     * @param roomMember 房间成员信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody RoomMember roomMember) {
        try {
            roomMemberService.save(roomMember);
            return Result.success("房间成员添加成功");
        } catch (Exception e) {
            return Result.error("房间成员添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新房间成员
     * @param roomMember 房间成员信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody RoomMember roomMember) {
        try {
            roomMemberService.updateById(roomMember);
            return Result.success("房间成员更新成功");
        } catch (Exception e) {
            return Result.error("房间成员更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除房间成员
     * @param id 成员关系ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            roomMemberService.removeById(id);
            return Result.success("房间成员删除成功");
        } catch (Exception e) {
            return Result.error("房间成员删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取房间成员详情
     * @param id 成员关系ID
     * @return 房间成员详情
     */
    @GetMapping("/{id}")
    public Result<RoomMember> getById(@PathVariable Long id) {
        RoomMember roomMember = roomMemberService.getById(id);
        if (roomMember != null) {
            return Result.success(roomMember);
        } else {
            return Result.error("房间成员不存在");
        }
    }
}
