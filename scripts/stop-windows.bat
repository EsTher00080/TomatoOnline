@echo off
echo =================================
echo 停止番茄自习室服务 (Docker)
echo =================================

cd ..

echo 🛑 正在停止所有服务...

if exist "docker-compose.exe" (
    docker-compose down
) else (
    docker compose down
)

if %ERRORLEVEL% equ 0 (
    echo.
    echo ✅ 所有服务已停止
    echo =================================
) else (
    echo ❌ 停止失败，请检查错误信息
)

pause