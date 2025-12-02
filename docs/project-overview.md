# MetaWiki - 项目概览

**日期**: 2025-12-02  
**类型**: Monorepo（多部分项目）  
**架构**: 分层架构 + App Router

## 执行摘要

MetaWiki 是一个基于 RAG（Retrieval-Augmented Generation）技术的智能知识库平台，提供文档管理、向量存储、知识检索和智能 Agent 等功能。项目采用 Monorepo 架构，包含后端服务（NestJS）和前端应用（Next.js）两个主要部分，通过 REST API 进行通信，共享类型定义和国际化资源。

## 项目分类

- **仓库类型**: Monorepo（多部分项目）
- **项目类型**: Backend + Web
- **主要语言**: TypeScript
- **架构模式**: 分层架构（后端）+ App Router（前端）

## 多部分结构

本项目由 2 个独立部分组成：

### Server（后端服务）

- **类型**: Backend (NestJS)
- **位置**: `apps/server/`
- **用途**: 提供 REST API 服务，处理业务逻辑、数据存储和 AI 能力
- **技术栈**: NestJS 11 + TypeORM + MySQL + Redis + Qdrant + LangChain

### Web（前端应用）

- **类型**: Web (Next.js)
- **位置**: `apps/web/`
- **用途**: 提供用户界面，知识库管理、Agent 对话和用户认证
- **技术栈**: Next.js 16 + React 19 + Tailwind CSS + Jotai + TanStack Query

### 部分集成方式

两个部分通过 REST API 进行通信：

- **通信协议**: HTTP/HTTPS
- **数据格式**: JSON
- **认证方式**: JWT Token（Bearer Token）
- **API 基础路径**: `/api`
- **共享资源**: 
  - 类型定义：`libs/types/`（通过 pnpm workspace 共享）
  - 国际化文件：`locales/`（前后端共享）

## 技术栈摘要

### Server 部分技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | NestJS | 11.1.9 |
| 语言 | TypeScript | 5.9.3 |
| 数据库 | MySQL | >= 8.0 |
| ORM | TypeORM | 0.3.27 |
| 缓存 | Redis | >= 6.0 |
| 向量数据库 | Qdrant | >= 1.0 |
| AI 框架 | LangChain | (via @meta-1/nest-ai) |

### Web 部分技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js | 16.0.4 |
| UI 库 | React | 19.2.0 |
| 语言 | TypeScript | 5 |
| 样式 | Tailwind CSS | 3.4.0 |
| 状态管理 | Jotai | 2.10.2 |
| 数据获取 | TanStack Query | 5.80.3 |

## 核心功能

### 知识库管理

- **文档上传**: 支持多种文档格式（PDF、Word、Markdown、TXT 等）
- **智能分割**: 基于语义的文档分割，支持自定义分割策略
- **向量化存储**: 使用向量数据库存储文档嵌入，支持快速相似度检索
- **知识检索**: 基于向量相似度的语义检索，精准匹配相关内容

### 智能 Agent

- **知识库 Agent**: 基于知识库的智能问答 Agent
- **检索增强生成**: 结合检索到的知识片段生成准确回答
- **多轮对话**: 支持上下文记忆的多轮对话能力
- **可配置策略**: 灵活的检索策略和生成参数配置

### 用户认证

- **用户注册登录**: 完整的用户认证体系
- **OTP 双因素认证**: 增强账号安全性
- **会话管理**: JWT Token 认证和会话管理

## 架构亮点

### 后端架构

- **分层架构**: Controller → Service → Repository 三层架构
- **模块化设计**: 基于 NestJS Module 系统，功能模块独立封装
- **配置中心化**: 使用 Nacos 配置中心管理配置
- **向量数据库集成**: 集成 Qdrant 向量数据库，支持 RAG 检索

### 前端架构

- **App Router**: Next.js 16 App Router 架构，基于文件系统的路由
- **组件化设计**: React 组件化开发，组件按功能分类
- **双状态管理**: Jotai（客户端状态）+ TanStack Query（服务端状态）
- **服务端渲染**: 支持 SSR/SSG，优化首屏加载和 SEO

### 集成架构

- **REST API**: 前后端通过 REST API 通信
- **类型安全**: 通过共享类型定义（`@meta-1/wiki-types`）确保类型安全
- **国际化共享**: 前后端共享国际化文件（`locales/`）

## 开发概览

### 先决条件

- **Node.js**: >= 18
- **包管理器**: pnpm >= 8
- **数据库**: MySQL >= 8.0（用于元数据存储）
- **缓存**: Redis >= 6.0（用于缓存和会话存储）
- **向量数据库**: Qdrant >= 1.0（可选，支持其他向量数据库）
- **配置中心**: Nacos >= 2.0（可选，用于配置管理）

### 快速开始

#### 1. 安装依赖

```bash
# 在项目根目录安装所有依赖（包括 workspace 依赖）
pnpm install
```

#### 2. 配置环境变量

**后端** (`apps/server/.env`):
```env
NODE_ENV=development
PORT=3710
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server
```

**前端** (`apps/web/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3710
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key
```

#### 3. 启动服务

```bash
# 启动后端服务（开发模式）
pnpm run dev:server

# 启动前端应用（开发模式）
pnpm run dev:web
```

### 关键命令

#### Server（后端）

- **安装**: `pnpm install`
- **开发**: `pnpm run dev:server`
- **构建**: `pnpm run build:server`
- **测试**: `pnpm test`

#### Web（前端）

- **安装**: `pnpm install`
- **开发**: `pnpm run dev:web`
- **构建**: `pnpm run build:web`
- **测试**: `pnpm test`

## 仓库结构

```
wiki/
├── apps/
│   ├── server/          # 后端服务 (NestJS)
│   │   ├── src/
│   │   │   ├── controller/    # API 控制器
│   │   │   ├── dto/          # 数据传输对象
│   │   │   ├── shared/       # 共享模块
│   │   │   ├── app.module.ts # 主模块
│   │   │   └── main.ts      # 应用入口
│   │   └── README.md
│   └── web/             # 前端应用 (Next.js)
│       ├── src/
│       │   ├── app/          # Next.js App Router 页面
│       │   ├── components/   # React 组件
│       │   ├── hooks/        # 自定义 Hooks
│       │   ├── rest/         # API 请求客户端
│       │   ├── state/        # 状态管理
│       │   └── ...
│       └── README.md
├── libs/
│   ├── account/         # 账号管理模块（后端）
│   ├── kb/              # 知识库模块（后端）
│   └── types/           # 共享类型定义
├── locales/            # 国际化文件（前后端共享）
├── scripts/            # 工具脚本
├── docs/               # 项目文档
└── README.md          # 项目说明文档
```

## 文档地图

详细文档请参考：

- [index.md](./index.md) - 主文档索引
- [architecture-server.md](./architecture-server.md) - Server 架构文档
- [architecture-web.md](./architecture-web.md) - Web 架构文档
- [source-tree-analysis.md](./source-tree-analysis.md) - 源码树分析
- [development-guide.md](./development-guide.md) - 开发指南
- [integration-architecture.md](./integration-architecture.md) - 集成架构文档
- [api-contracts-server.md](./api-contracts-server.md) - API 合约文档
- [data-models-server.md](./data-models-server.md) - 数据模型文档
- [state-management-web.md](./state-management-web.md) - 前端状态管理
- [ui-component-inventory-web.md](./ui-component-inventory-web.md) - UI 组件清单

---

_文档由 BMAD Method `document-project` 工作流生成_

