# 智能信息卡片生成器

一个基于 AI 的智能内容提取和卡片生成应用，支持多种 AI 模型和自定义样式。

## 🚀 快速开始

### 一键启动
```bash
./start.sh
```

### 停止服务
```bash
./stop.sh
```

## 📋 系统要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

## ⚙️ 配置

1. **复制环境变量文件**:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **配置 AI API 密钥**:
   编辑 `backend/.env` 文件，至少配置一个 AI 提供商的 API 密钥：

   ```env
   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # DeepSeek
   DEEPSEEK_API_KEY=your_deepseek_api_key

   # Google Gemini
   GEMINI_API_KEY=your_gemini_api_key

   # 其他 AI 提供商...
   ```

## 🎯 功能特性

- **多 AI 模型支持**: OpenAI、DeepSeek、Azure、Gemini、Claude、OpenRouter、智谱 AI
- **智能内容提取**: 支持网页链接和直接文本输入
- **多样化样式**: 5种风格 × 6种配色 = 30种卡片样式
- **实时预览**: 所见即所得的卡片效果预览
- **响应式设计**: 适配各种设备屏幕

## 🌐 访问地址

- **前端应用**: http://localhost:5173
- **后端 API**: http://localhost:3001

## 📖 使用说明

1. 启动应用后，在浏览器中打开 http://localhost:5173
2. 选择输入方式：URL 链接或直接文本
3. 配置 AI 提供商和模型（可选 API 密钥）
4. 选择卡片风格和配色方案
5. 点击"生成信息卡片"按钮
6. 查看生成的精美信息卡片

## 🛠️ 开发模式

### 前端开发
```bash
cd frontend
npm run dev
```

### 后端开发
```bash
cd backend
npm run dev
```

### 构建生产版本
```bash
# 前端构建
cd frontend
npm run build

# 后端构建
cd backend
npm run build
```

## 📁 项目结构

```
info-card/
├── frontend/           # React 前端应用
├── backend/            # Node.js 后端服务
├── shared/             # 共享类型定义
├── docs/               # 项目文档
├── logs/               # 运行日志
├── start.sh            # 一键启动脚本
├── stop.sh             # 停止服务脚本
├── .gitignore          # Git 忽略文件
└── README.md           # 本文件
```

## 🔧 故障排除

### 端口被占用
如果遇到端口占用问题，可以：
1. 运行 `./stop.sh` 停止服务
2. 或者手动修改端口配置

### API 密钥错误
1. 检查 `backend/.env` 文件中的 API 密钥是否正确
2. 确认 API 密钥有足够的额度和权限

### 网页内容提取失败
1. 检查 URL 是否可访问
2. 某些网站可能有反爬虫机制，建议尝试其他网页

## 📝 日志文件

- **后端日志**: `logs/backend.log`
- **前端日志**: `logs/frontend.log`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License