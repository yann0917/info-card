# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

智能信息卡片生成器 - 一个基于 AI 的内容提取和卡片生成应用。用户可以输入 URL 链接或直接文本，应用会自动提取关键信息并生成美观的信息卡片。支持多种 AI 模型（OpenAI、DeepSeek、Azure、Gemini、Claude、OpenRouter、智谱 AI）和多种卡片风格、配色方案。

## 技术栈

**前端:**
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui 组件库
- React Router + Zustand 状态管理

**后端:**
- Node.js + Express + TypeScript
- Puppeteer (网页内容提取)
- 多个大模型 SDK 集成

## 项目结构

```
info-card/
├── frontend/           # React 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── services/      # API 服务
│   │   ├── types/         # TypeScript 类型
│   │   ├── constants/     # 常量配置
│   │   └── lib/           # 工具函数
│   ├── public/            # 静态资源
│   └── package.json
├── backend/            # Node.js 后端服务
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── services/      # 业务逻辑
│   │   ├── routes/        # 路由
│   │   ├── types/         # TypeScript 类型
│   │   └── utils/         # 工具函数
│   └── package.json
├── shared/             # 共享类型定义
├── docs/               # 项目文档
└── CLAUDE.md          # 本文件
```

## 开发环境设置

### 前端开发

```bash
cd frontend
npm install
npm run dev
```

前端应用运行在 http://localhost:5173

### 后端开发

```bash
cd backend
npm install
cp .env.example .env  # 配置环境变量
npm run dev
```

后端 API 运行在 http://localhost:3001

### 环境变量配置

**后端 (.env):**
- `PORT`: 服务端口 (默认 3001)
- `FRONTEND_URL`: 前端地址 (默认 http://localhost:5173)
- `OPENAI_API_KEY`: OpenAI API 密钥
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
- `AZURE_OPENAI_API_KEY`: Azure OpenAI API 密钥
- `AZURE_OPENAI_ENDPOINT`: Azure OpenAI 端点
- `GEMINI_API_KEY`: Google Gemini API 密钥
- `CLAUDE_API_KEY`: Anthropic Claude API 密钥
- `OPENROUTER_API_KEY`: OpenRouter API 密钥
- `ZHIPU_API_KEY`: 智谱 AI API 密钥

**前端 (.env):**
- `VITE_API_URL`: 后端 API 地址 (默认 http://localhost:3001/api)

## 常用命令

### 前端命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 代码检查
```

### 后端命令
```bash
npm run dev          # 启动开发服务器 (热重载)
npm run build        # 编译 TypeScript
npm start            # 运行生产版本
```

## 核心功能

### AI 模型集成
- 支持 7 种主流 AI 提供商
- 统一的接口设计，易于扩展新模型
- 支持自定义 API 密钥

### 内容提取
- 基于 Puppeteer 的网页内容提取
- 智能内容清理和结构化
- 支持直接文本输入

### 卡片样式
- 5 种预设风格：现代、极简、优雅、活泼、商务
- 6 种配色方案：蓝、绿、紫、红、橙、灰
- 响应式设计，支持多种设备

### API 接口
- `GET /api/health` - 健康检查
- `GET /api/providers` - 获取支持的 AI 提供商
- `POST /api/extract` - 提取信息并生成卡片

## 代码架构要点

### 前端架构
- 组件化设计，使用 shadcn/ui 组件库
- 类型安全的 API 调用
- 响应式状态管理
- 模块化的样式配置

### 后端架构
- 分层架构：Controller → Service → Utils
- 统一的错误处理
- 类型安全的请求/响应
- 可扩展的 AI 提供商接口

### 共享类型
- 前后端共享 TypeScript 类型定义
- 确保接口一致性
- 减少类型不匹配错误

## MCP 工具使用指南

本项目可以使用多个 MCP (Model Context Protocol) 工具来提高开发效率和问题解决能力：

### 1. Context7 MCP - 技术文档查询
**使用时机：**
- 遇到框架/库版本升级问题时（如 Tailwind CSS v3 → v4）
- 需要最新的 API 文档和最佳实践时
- 对某个技术栈不熟悉，需要权威资料时
- 解决配置问题时，需要官方文档参考

**示例场景：**
- 当遇到 `Cannot apply unknown utility class` 错误时，用 Context7 获取 Tailwind CSS v4 的最新配置方法
- 需要了解某个 React Hook 的正确用法时，查询最新文档
- 配置 PostCSS、Vite 等工具时，获取官方推荐的配置方式

### 2. Chrome DevTools MCP - 浏览器调试
**使用时机：**
- 前端页面渲染异常，需要实时查看 DOM 结构
- CSS 样式问题，需要检查样式计算和调试
- JavaScript 运行时错误，需要查看控制台和网络请求
- 响应式布局问题，需要不同设备尺寸测试
- 性能分析，需要查看页面加载和渲染性能

**示例场景：**
- 页面样式不生效时，用 Chrome MCP 查看元素计算样式
- API 请求失败时，查看网络面板的错误信息
- 页面白屏时，检查控制台错误和 DOM 结构

### 3. Playwright MCP - 端到端测试和页面验证
**使用时机：**
- 需要验证页面功能是否正常工作
- 进行跨浏览器兼容性测试
- 自动化测试页面交互流程
- 验证表单提交和页面跳转

**示例场景：**
- 验证信息卡片生成功能是否完整
- 测试不同输入类型的表单交互
- 验证 AI 模型选择的下拉菜单功能

### 4. Tavily Search MCP - 网络信息搜索
**使用时机：**
- 需要搜索最新的技术解决方案
- 遇到错误信息，需要查找相关解决方案
- 了解某个功能的市场实现方式
- 寻找最佳实践和设计模式

**示例场景：**
- 搜索最新的 AI 模型集成方案
- 查找类似的卡片生成应用的设计参考
- 解决特定错误信息的解决方案

### 5. Filesystem MCP - 文件系统操作
**使用时机：**
- 需要批量创建或修改文件时
- 检查项目结构和文件依赖关系
- 搜索特定代码模式或配置
- 批量重构和代码组织

**示例场景：**
- 创建缺失的 UI 组件文件
- 搜索项目中所有的 API 配置
- 检查项目的依赖关系

### 6. Sequential Thinking MCP - 复杂问题分析
**使用时机：**
- 遇到复杂的架构问题需要逐步分析
- 需要设计新的功能模块
- 解决性能优化问题
- 制定代码重构计划

**示例场景：**
- 设计新的 AI 提供商接入架构
- 优化 Puppeteer 内容提取流程
- 制定前端状态管理优化方案

## MCP 工具组合使用策略

**问题诊断流程：**
1. **初步分析** → 用 Sequential Thinking 分析问题复杂度
2. **信息收集** → 用 Tavily Search 搜索相关解决方案
3. **技术文档** → 用 Context7 获取权威文档
4. **代码检查** → 用 Filesystem 检查相关文件
5. **实际验证** → 用 Chrome DevTools 或 Playwright 验证修复效果

**开发流程：**
1. **需求分析** → Sequential Thinking 设计方案
2. **技术调研** → Context7 + Tavily Search 了解最佳实践
3. **代码实现** → Filesystem 创建和修改文件
4. **测试验证** → Chrome DevTools + Playwright 验证功能
5. **文档更新** → 更新项目文档和说明

## 开发注意事项

1. **API 密钥安全**: 不要在代码中硬编码 API 密钥，使用环境变量
2. **错误处理**: 前后端都要有完善的错误处理机制
3. **类型安全**: 充分利用 TypeScript 的类型检查
4. **响应式设计**: 确保在不同设备上的用户体验
5. **性能优化**: Puppeteer 实例要及时释放，避免内存泄露
6. **MCP 工具优先级**: 优先使用 Context7 获取最新文档，避免过时的配置方法
7. **版本兼容性**: 使用 Tavily Search 查询最新版本的兼容性问题
8. **官方文档优先原则**:
   - **严禁**：遇到技术问题时自己猜测、试错或编写"可能有用的"解决方案
   - **必须**：第一时间查找官方文档、GitHub README、API 文档等权威资源
   - **标准流程**：
     1. 使用 Context7 查找官方文档和最新用法
     2. 使用 WebSearch 搜索官方示例和最佳实践
     3. 严格遵循官方推荐的 API 使用方式和配置选项
     4. 只有在官方文档不足时才考虑社区解决方案
   - **反例教训**：html2canvas 问题应该先查找 `html2canvas-pro` 官方文档，而不是自己实现复杂的颜色转换逻辑，导致反复修复和更多 bug
