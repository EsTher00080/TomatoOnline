package com.example.pomodorostudy.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 全局统一响应结果类
 * 用于封装API返回结果
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Result<T> {
    
    /**
     * 响应状态码
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 成功响应（带数据）
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 成功结果
     */
    public static <T> Result<T> success(T data) {
        return new Result<>(200, "操作成功", data);
    }
    
    /**
     * 成功响应（无数据）
     * @return 成功结果
     */
    public static <T> Result<T> success() {
        return new Result<>(200, "操作成功", null);
    }
    
    /**
     * 成功响应（自定义消息）
     * @param message 响应消息
     * @param data 响应数据
     * @param <T> 数据类型
     * @return 成功结果
     */
    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data);
    }
    
    /**
     * 错误响应
     * @param message 错误消息
     * @param <T> 数据类型
     * @return 错误结果
     */
    public static <T> Result<T> error(String message) {
        return new Result<>(500, message, null);
    }
    
    /**
     * 错误响应（自定义状态码）
     * @param code 状态码
     * @param message 错误消息
     * @param <T> 数据类型
     * @return 错误结果
     */
    public static <T> Result<T> error(Integer code, String message) {
        return new Result<>(code, message, null);
    }
    
    /**
     * 判断是否成功
     * @return 是否成功
     */
    public boolean isSuccess() {
        return this.code != null && this.code == 200;
    }
}
