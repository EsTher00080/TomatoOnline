package com.example.pomodorostudy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 首页控制器
 * 处理根路径访问
 */
@Controller
public class IndexController {

    /**
     * 根路径访问，直接返回index.html
     */
    @GetMapping("/")
    public String home() {
        return "index.html";
    }
}

