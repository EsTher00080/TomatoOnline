#!/bin/bash

# TomatoOnline 一键启动完整服务脚本 (macOS)
# 使用Docker Compose启动所有服务

echo "🍅 TomatoOnline 一键启动完整服务脚本 (macOS)"
echo "======================================"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker Desktop for Mac"
    echo "下载地址: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# 检查Docker Compose是否可用
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose 未安装"
    exit 1
fi

# 检查Docker是否运行
if ! docker info &> /dev/null; then
    echo "❌ Docker 未运行，请启动 Docker Desktop"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 进入项目根目录
cd "$(dirname "$0")/.."

echo "📦 构建并启动所有服务..."
echo "这可能需要几分钟时间，请耐心等待..."

# 使用docker-compose启动所有服务
if command -v docker-compose &> /dev/null; then
    docker-compose up --build -d
else
    docker compose up --build -d
fi

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 所有服务启动成功！"
    echo "======================================"
    echo "前端访问地址: http://localhost"
    echo "后端API地址: http://localhost:8080"
    echo "数据库地址: localhost:3306"
    echo ""
    echo "停止服务: ./scripts/stop-macos.sh"
    echo "查看日志: docker-compose logs -f"
    echo "查看后端日志: docker-compose logs -f backend"
    echo "查看前端日志: docker-compose logs -f frontend"
else
    echo "❌ 启动失败，请检查错误信息"
    exit 1
fi