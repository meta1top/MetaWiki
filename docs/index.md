# MetaWiki 文档索引

**类型**: Monorepo（多部分项目）with 2 parts  
**主要语言**: TypeScript  
**架构**: 分层架构 + App Router  
**最后更新**: 2025-12-02

## 项目概览

MetaWiki 是一个基于 RAG（Retrieval-Augmented Generation）技术的智能知识库平台，提供文档管理、向量存储、知识检索和智能 Agent 等功能。项目采用 Monorepo 架构，包含后端服务（NestJS）和前端应用（Next.js）两个主要部分。

## 项目结构

本项目由 2 个独立部分组成：

### Server（后端服务）

- **类型**: Backend (NestJS)
- **位置**: `apps/server/`
- **技术栈**: NestJS 11 + TypeORM + MySQL + Redis + Qdrant + LangChain
- **入口点**: `apps/server/src/main.ts`

### Web（前端应用）

- **类型**: Web (Next.js)
- **位置**: `apps/web/`
- **技术栈**: Next.js 16 + React 19 + Tailwind CSS + Jotai + TanStack Query
- **入口点**: `apps/web/src/app/layout.tsx`

## 跨部分集成

两个部分通过 REST API 进行通信：

- **通信协议**: HTTP/HTTPS
- **数据格式**: JSON
- **认证方式**: JWT Token（Bearer Token）
- **API 基础路径**: `/api`
- **共享资源**: 
  - 类型定义：`libs/types/`（通过 pnpm workspace 共享）
  - 国际化文件：`locales/`（前后端共享）

## 快速参考

### Server（后端）快速参考

- **技术栈**: NestJS 11 + TypeORM + MySQL + Redis + Qdrant
- **入口点**: `apps/server/src/main.ts`
- **架构模式**: 分层架构（Controller → Service → Repository）
- **数据库**: MySQL（元数据）+ Qdrant（向量数据）
- **部署**: Node.js 应用

### Web（前端）快速参考

- **技术栈**: Next.js 16 + React 19 + Tailwind CSS
- **入口点**: `apps/web/src/app/layout.tsx`
- **架构模式**: App Router + 组件化
- **状态管理**: Jotai（客户端）+ TanStack Query（服务端）
- **部署**: Next.js 应用

## 生成的文档

### 核心文档

- [项目概览](./project-overview.md) - 项目执行摘要和高级架构
- [源码树分析](./source-tree-analysis.md) - 带注释的目录结构
- [技术栈分析](./technology-stack.md) - 技术栈详细分析

### 部分特定文档

#### Server（后端）

- [架构文档](./architecture-server.md) - Server 技术架构详解
- [开发指南](./development-guide.md) - 本地设置和开发工作流
- [API 合约](./api-contracts-server.md) - API 端点文档
- [数据模型](./data-models-server.md) - 数据库架构和模型

#### Web（前端）

- [架构文档](./architecture-web.md) - Web 技术架构详解
- [状态管理](./state-management-web.md) - 前端状态管理详解
- [UI 组件清单](./ui-component-inventory-web.md) - UI 组件列表

### 集成文档

- [集成架构](./integration-architecture.md) - 前后端如何通信
- [开发指南](./development-guide.md) - 开发和部署指南

## 开始使用

### Server（后端）设置

**先决条件**: Node.js >= 18, pnpm >= 8, MySQL >= 8.0, Redis >= 6.0, Qdrant >= 1.0（可选）

**安装和运行**:

```bash
# 在项目根目录
pnpm install

# 配置环境变量（apps/server/.env）
NODE_ENV=development
PORT=3710
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server

# 启动开发服务器
pnpm run dev:server
```

服务将在 http://localhost:3710 启动。

### Web（前端）设置

**先决条件**: Node.js >= 18, pnpm >= 8

**安装和运行**:

```bash
# 在项目根目录（如果还没安装依赖）
pnpm install

# 配置环境变量（apps/web/.env.local）
NEXT_PUBLIC_API_URL=http://localhost:3710
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key

# 启动开发服务器
pnpm run dev:web
```

应用将在 http://localhost:3110 启动。

### 运行测试

```bash
# 运行所有测试
pnpm test

# 测试覆盖率
pnpm test:cov

# E2E 测试
pnpm test:e2e
```

## 用于 AI 辅助开发

本文档专门为帮助 AI 代理理解和扩展此代码库而生成。

### 规划新功能时：

**仅 UI 功能**:
→ 参考: `architecture-web.md`, `ui-component-inventory-web.md`

**仅 API/后端功能**:
→ 参考: `architecture-server.md`, `api-contracts-server.md`, `data-models-server.md`

**全栈功能**:
→ 参考: 所有架构文档 + `integration-architecture.md`

**部署变更**:
→ 参考: `development-guide.md` 中的部署部分

### 文档使用建议

1. **了解项目整体**: 先阅读 `project-overview.md` 和 `source-tree-analysis.md`
2. **开发后端功能**: 参考 `architecture-server.md`、`api-contracts-server.md` 和 `data-models-server.md`
3. **开发前端功能**: 参考 `architecture-web.md`、`state-management-web.md` 和 `ui-component-inventory-web.md`
4. **集成开发**: 参考 `integration-architecture.md` 了解前后端通信方式
5. **环境设置**: 参考 `development-guide.md` 进行本地开发环境配置

## 文档导航

### 按主题分类

**架构和设计**:
- [项目概览](./project-overview.md)
- [Server 架构](./architecture-server.md)
- [Web 架构](./architecture-web.md)
- [集成架构](./integration-architecture.md)

**API 和数据**:
- [API 合约 - Server](./api-contracts-server.md)
- [数据模型 - Server](./data-models-server.md)

**前端开发**:
- [状态管理 - Web](./state-management-web.md)
- [UI 组件清单 - Web](./ui-component-inventory-web.md)

**开发和部署**:
- [开发指南](./development-guide.md)
- [技术栈分析](./technology-stack.md)
- [源码树分析](./source-tree-analysis.md)

---

_文档由 BMAD Method `document-project` 工作流生成_

