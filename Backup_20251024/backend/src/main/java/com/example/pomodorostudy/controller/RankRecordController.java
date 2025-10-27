package com.example.pomodorostudy.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.pomodorostudy.common.Result;
import com.example.pomodorostudy.entity.RankRecord;
import com.example.pomodorostudy.service.RankRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 排行榜记录控制器
 * 提供排行榜记录相关的CRUD接口
 */
@RestController
@RequestMapping("/api/rank_record")
public class RankRecordController {
    
    @Autowired
    private RankRecordService rankRecordService;
    
    /**
     * 获取排行榜记录列表
     * @param current 当前页
     * @param size 每页大小
     * @param userId 用户ID（可选筛选条件）
     * @param rankType 排行类型（可选筛选条件）
     * @param rankDate 排行日期（可选筛选条件）
     * @return 排行榜记录列表
     */
    @GetMapping("/list")
    public Result<Page<RankRecord>> list(@RequestParam(defaultValue = "1") Integer current,
                                         @RequestParam(defaultValue = "10") Integer size,
                                         @RequestParam(required = false) Long userId,
                                         @RequestParam(required = false) Integer rankType,
                                         @RequestParam(required = false) String rankDate) {
        Page<RankRecord> page = new Page<>(current, size);
        QueryWrapper<RankRecord> queryWrapper = new QueryWrapper<>();
        if (userId != null) {
            queryWrapper.eq("user_id", userId);
        }
        if (rankType != null) {
            queryWrapper.eq("rank_type", rankType);
        }
        if (rankDate != null && !rankDate.trim().isEmpty()) {
            queryWrapper.eq("rank_date", rankDate);
        }
        queryWrapper.orderByAsc("rank_position");
        Page<RankRecord> result = rankRecordService.page(page, queryWrapper);
        return Result.success(result);
    }
    
    /**
     * 添加排行榜记录
     * @param rankRecord 排行榜记录信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public Result<String> add(@RequestBody RankRecord rankRecord) {
        try {
            rankRecordService.save(rankRecord);
            return Result.success("排行榜记录添加成功");
        } catch (Exception e) {
            return Result.error("排行榜记录添加失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新排行榜记录
     * @param rankRecord 排行榜记录信息
     * @return 操作结果
     */
    @PutMapping("/update")
    public Result<String> update(@RequestBody RankRecord rankRecord) {
        try {
            rankRecordService.updateById(rankRecord);
            return Result.success("排行榜记录更新成功");
        } catch (Exception e) {
            return Result.error("排行榜记录更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除排行榜记录
     * @param id 排行记录ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public Result<String> delete(@PathVariable Long id) {
        try {
            rankRecordService.removeById(id);
            return Result.success("排行榜记录删除成功");
        } catch (Exception e) {
            return Result.error("排行榜记录删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取排行榜记录详情
     * @param id 排行记录ID
     * @return 排行榜记录详情
     */
    @GetMapping("/{id}")
    public Result<RankRecord> getById(@PathVariable Long id) {
        RankRecord rankRecord = rankRecordService.getById(id);
        if (rankRecord != null) {
            return Result.success(rankRecord);
        } else {
            return Result.error("排行榜记录不存在");
        }
    }
}
