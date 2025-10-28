#!/bin/bash

# 智能信息卡片生成器 - 一键启动脚本
# 支持 macOS 和 Linux

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        log_error "$1 未安装，请先安装 $1"
        exit 1
    fi
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "端口 $port 已被占用"
        return 1
    fi
    return 0
}

# 等待服务启动
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    log_info "等待 $service_name 服务启动..."

    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            sleep 1
            attempt=$((attempt + 1))
        else
            log_success "$service_name 服务已启动 (端口 $port)"
            return 0
        fi
    done

    log_error "$service_name 服务启动超时"
    return 1
}

# 安装依赖
install_dependencies() {
    log_info "检查并安装依赖..."

    # 检查 Node.js
    check_command "node"
    check_command "npm"

    node_version=$(node --version)
    log_info "Node.js 版本: $node_version"

    # 安装后端依赖
    if [ ! -d "backend/node_modules" ]; then
        log_info "安装后端依赖..."
        cd backend
        npm install
        cd ..
        log_success "后端依赖安装完成"
    else
        log_info "后端依赖已存在，跳过安装"
    fi

    # 安装前端依赖
    if [ ! -d "frontend/node_modules" ]; then
        log_info "安装前端依赖..."
        cd frontend
        npm install
        cd ..
        log_success "前端依赖安装完成"
    else
        log_info "前端依赖已存在，跳过安装"
    fi
}

# 检查环境变量
check_env() {
    log_info "检查环境配置..."

    if [ ! -f "backend/.env" ]; then
        if [ -f "backend/.env.example" ]; then
            log_warning "未找到 backend/.env 文件，将从 .env.example 复制"
            cp backend/.env.example backend/.env
            log_warning "请在 backend/.env 文件中配置你的 API 密钥"
            log_info "至少需要配置一个 AI 提供商的 API 密钥:"
            log_info "  - OPENAI_API_KEY (OpenAI)"
            log_info "  - DEEPSEEK_API_KEY (DeepSeek)"
            log_info "  - GEMINI_API_KEY (Google Gemini)"
            log_info "  - CLAUDE_API_KEY (Anthropic Claude)"
            log_info "  - ZHIPU_API_KEY (智谱 AI)"
        else
            log_error "未找到环境变量配置文件"
            return 1
        fi
    fi

    # 检查前端环境变量
    if [ ! -f "frontend/.env" ]; then
        if [ -f "frontend/.env.example" ]; then
            log_info "从前端 .env.example 创建环境变量文件"
            cp frontend/.env.example frontend/.env
        fi
    fi

    log_success "环境配置检查完成"
}

# 启动后端服务
start_backend() {
    log_info "启动后端服务..."

    cd backend

    # 检查端口
    if ! check_port 3001; then
        log_info "检测到后端服务可能已在运行，尝试停止..."
        pkill -f "node.*backend" || true
        sleep 2
    fi

    # 启动后端
    npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../logs/backend.pid

    cd ..
    log_success "后端服务启动中 (PID: $BACKEND_PID)"
}

# 启动前端服务
start_frontend() {
    log_info "启动前端服务..."

    cd frontend

    # 检查端口
    if ! check_port 5173; then
        log_info "检测到前端服务可能已在运行，尝试停止..."
        pkill -f "vite" || true
        sleep 2
    fi

    # 启动前端
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../logs/frontend.pid

    cd ..
    log_success "前端服务启动中 (PID: $FRONTEND_PID)"
}

# 显示服务状态
show_status() {
    echo ""
    echo "==================================="
    echo "🚀 智能信息卡片生成器已启动！"
    echo "==================================="
    echo ""
    echo "📱 前端应用: http://localhost:5173"
    echo "🔧 后端 API: http://localhost:3001"
    echo ""
    echo "📋 服务状态:"
    if ps -p $(cat logs/backend.pid 2>/dev/null) > /dev/null 2>&1; then
        echo "  ✅ 后端服务运行中 (PID: $(cat logs/backend.pid))"
    else
        echo "  ❌ 后端服务未运行"
    fi

    if ps -p $(cat logs/frontend.pid 2>/dev/null) > /dev/null 2>&1; then
        echo "  ✅ 前端服务运行中 (PID: $(cat logs/frontend.pid))"
    else
        echo "  ❌ 前端服务未运行"
    fi

    echo ""
    echo "📝 日志文件:"
    echo "  - 后端日志: logs/backend.log"
    echo "  - 前端日志: logs/frontend.log"
    echo ""
    echo "🛑 停止服务: ./stop.sh"
    echo ""
}

# 清理函数
cleanup() {
    log_info "正在清理..."
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            kill $BACKEND_PID || true
        fi
    fi

    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null 2>&1; then
            kill $FRONTEND_PID || true
        fi
    fi

    log_info "清理完成"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 主函数
main() {
    echo "==================================="
    echo "🚀 智能信息卡片生成器"
    echo "==================================="
    echo ""

    # 创建日志目录
    mkdir -p logs

    # 安装依赖
    install_dependencies

    # 检查环境配置
    check_env

    # 启动服务
    start_backend
    start_frontend

    # 等待服务启动
    sleep 3

    # 显示状态
    show_status

    # 保持脚本运行
    log_info "按 Ctrl+C 停止所有服务"

    # 监控服务状态
    while true; do
        sleep 10

        # 检查后端服务
        if ! ps -p $(cat logs/backend.pid 2>/dev/null) > /dev/null 2>&1; then
            log_error "后端服务意外停止，重新启动..."
            start_backend
        fi

        # 检查前端服务
        if ! ps -p $(cat logs/frontend.pid 2>/dev/null) > /dev/null 2>&1; then
            log_error "前端服务意外停止，重新启动..."
            start_frontend
        fi
    done
}

# 检查是否在项目根目录
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    log_error "请在项目根目录运行此脚本"
    exit 1
fi

# 运行主函数
main