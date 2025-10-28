#!/bin/bash

# 智能信息卡片生成器 - 停止服务脚本

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

# 停止服务
stop_service() {
    local pid_file=$1
    local service_name=$2

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            log_info "停止 $service_name 服务 (PID: $pid)..."
            kill $pid

            # 等待进程结束
            local count=0
            while ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
            done

            # 如果进程仍在运行，强制杀死
            if ps -p $pid > /dev/null 2>&1; then
                log_warning "$service_name 服务未能正常停止，强制终止..."
                kill -9 $pid || true
            fi

            log_success "$service_name 服务已停止"
        else
            log_warning "$service_name 服务未运行 (PID: $pid)"
        fi

        rm -f "$pid_file"
    else
        log_warning "$service_name 服务 PID 文件不存在"
    fi
}

# 强制停止所有相关进程
force_stop() {
    log_info "强制停止所有相关进程..."

    # 停止后端进程
    pkill -f "node.*backend" || true
    pkill -f "nodemon.*backend" || true

    # 停止前端进程
    pkill -f "vite" || true

    # 停止可能的 Puppeteer 进程
    pkill -f "puppeteer" || true

    log_success "所有进程已强制停止"
}

# 显示停止后状态
show_status() {
    echo ""
    echo "==================================="
    echo "🛑 所有服务已停止"
    echo "==================================="
    echo ""
    echo "📝 日志文件保留在:"
    echo "  - logs/backend.log"
    echo "  - logs/frontend.log"
    echo ""
    echo "🚀 重新启动: ./start.sh"
    echo ""
}

# 主函数
main() {
    echo "==================================="
    echo "🛑 停止智能信息卡片生成器"
    echo "==================================="
    echo ""

    # 检查是否在项目根目录
    if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
        log_error "请在项目根目录运行此脚本"
        exit 1
    fi

    # 停止后端服务
    stop_service "logs/backend.pid" "后端"

    # 停止前端服务
    stop_service "logs/frontend.pid" "前端"

    # 检查是否还有残留进程
    sleep 1

    if pgrep -f "node.*backend" > /dev/null || pgrep -f "vite" > /dev/null; then
        log_warning "检测到残留进程，进行强制清理..."
        force_stop
    fi

    # 显示状态
    show_status
}

# 解析命令行参数
if [ "$1" = "--force" ] || [ "$1" = "-f" ]; then
    force_stop
    show_status
    exit 0
fi

# 运行主函数
main