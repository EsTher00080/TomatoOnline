@echo off
echo =================================
echo 启动番茄自习室完整服务 (Docker)
echo =================================

echo 正在检查 Docker 环境...
docker --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker 未安装，请先安装 Docker Desktop
    echo 下载地址: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    docker compose version >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo ❌ Docker Compose 未安装
        pause
        exit /b 1
    )
)

echo ✅ Docker 环境检查通过

echo 📦 构建并启动所有服务...
echo 这可能需要几分钟时间，请耐心等待...

if exist "docker-compose.exe" (
    docker-compose up --build -d
) else (
    docker compose up --build -d
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo 🎉 所有服务启动成功！
    echo =================================
    echo 前端访问地址: http://localhost
    echo 后端API地址: http://localhost:8080
    echo 数据库地址: localhost:3306
    echo.
    echo 停止服务: .\scripts\stop-windows.bat
    echo 查看日志: docker-compose logs -f
    echo 查看后端日志: docker-compose logs -f backend
    echo 查看前端日志: docker-compose logs -f frontend
) else (
    echo ❌ 启动失败，请检查错误信息
)

pause