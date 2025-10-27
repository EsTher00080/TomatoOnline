#!/bin/bash

# TomatoOnline 停止服务脚本 (macOS)
# 使用Docker Compose停止所有服务

echo "🍅 TomatoOnline 停止服务脚本 (macOS)"
echo "======================================"

# 进入项目根目录
cd "$(dirname "$0")/.."

echo "🛑 正在停止所有服务..."

# 使用docker-compose停止服务
if command -v docker-compose &> /dev/null; then
    docker-compose down
else
    docker compose down
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 所有服务已停止"
    echo "======================================"
else
    echo "❌ 停止失败，请检查错误信息"
    exit 1
fi