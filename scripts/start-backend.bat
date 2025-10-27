@echo off
echo =================================
echo 启动番茄自习室后端服务
echo =================================

cd backend
echo 正在编译项目...
mvn clean compile

if %ERRORLEVEL% neq 0 (
    echo 编译失败，请检查错误信息
    pause
    exit /b 1
)

echo 正在启动 Spring Boot 应用...
echo 后端服务将在 http://localhost:8080 启动
echo 前端页面将在 http://localhost:8080 显示
mvn spring-boot:run

pause
