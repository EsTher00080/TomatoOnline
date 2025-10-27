package com.example.pomodorostudy;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 番茄自习室应用启动类
 * 
 * @author PomodoroStudy Team
 * @version 1.0.0
 * @since 2024-01-01
 */
@SpringBootApplication
@MapperScan("com.example.pomodorostudy.mapper")
public class PomodoroStudyApplication {

    public static void main(String[] args) {
        SpringApplication.run(PomodoroStudyApplication.class, args);
        System.out.println("=================================");
        System.out.println("🍅 番茄自习室应用启动成功！");
        System.out.println("📚 在线自律学习平台");
        System.out.println("🌐 访问地址: http://localhost:8080/api");
        System.out.println("📖 API文档: http://localhost:8080/api/doc");
        System.out.println("=================================");
    }
}
