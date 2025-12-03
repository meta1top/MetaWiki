# 技术栈分析

## Server 部分 (apps/server/)

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | Node.js | >= 18 | JavaScript 运行时环境 |
| **语言** | TypeScript | 5.9.3 | 类型安全的 JavaScript 超集 |
| **框架** | NestJS | 11.1.9 | 企业级 Node.js 框架 |
| **HTTP服务器** | Express | (via NestJS) | HTTP 服务器基础 |
| **数据库** | MySQL | >= 8.0 | 关系型数据库（元数据存储） |
| **ORM** | TypeORM | 0.3.27 | 数据库 ORM 框架 |
| **缓存** | Redis | >= 6.0 | 缓存和会话存储 |
| **Redis客户端** | ioredis | 5.8.2 | Redis 客户端库 |
| **向量数据库** | Qdrant | >= 1.0 | 向量数据库（RAG 核心） |
| **AI框架** | LangChain | (via @meta-1/nest-ai) | LLM 应用开发框架 |
| **AI模块** | @meta-1/nest-ai | 0.0.1 | AI 能力封装模块 |
| **配置管理** | Nacos | >= 2.0 | 配置中心和服务发现 |
| **Nacos集成** | @meta-1/nest-nacos | 0.0.7 | Nacos 集成模块 |
| **国际化** | nestjs-i18n | 10.5.1 | 多语言支持 |
| **API文档** | Swagger | 11.2.1 | API 文档自动生成 |
| **数据验证** | Zod | 3.25.76 | Schema 验证库 |
| **Zod集成** | nestjs-zod | 5.0.1 | NestJS Zod 集成 |
| **邮件服务** | @meta-1/nest-message | 0.0.9 | 邮件发送服务 |
| **资源管理** | @meta-1/nest-assets | 0.0.5 | 文件上传和存储 |
| **安全模块** | @meta-1/nest-security | 0.0.8 | 认证和授权 |
| **通用工具** | @meta-1/nest-common | 0.0.13 | 通用工具和装饰器 |
| **业务模块** | @meta-1/wiki-account | (local) | 账号管理模块 |
| **业务模块** | @meta-1/wiki-kb | (local) | 知识库模块 |
| **类型定义** | @meta-1/wiki-types | (local) | 共享类型定义 |

### 架构模式
- **分层架构**: Controller → Service → Repository
- **模块化设计**: 基于 NestJS Module 系统
- **依赖注入**: NestJS DI 容器
- **配置驱动**: Nacos 配置中心管理配置

---

## Web 部分 (apps/web/)

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | Node.js | >= 18 | JavaScript 运行时环境 |
| **语言** | TypeScript | 5 | 类型安全的 JavaScript 超集 |
| **框架** | Next.js | 16.0.4 | React 应用框架（App Router） |
| **UI库** | React | 19.2.0 | 用户界面库 |
| **DOM库** | React DOM | 19.2.0 | React DOM 渲染 |
| **样式框架** | Tailwind CSS | 3.4.0 | 原子化 CSS 框架 |
| **PostCSS** | PostCSS | 8.4.0 | CSS 后处理器 |
| **Autoprefixer** | Autoprefixer | 10.4.0 | CSS 自动前缀 |
| **状态管理** | Jotai | 2.10.2 | 轻量级原子状态管理 |
| **数据获取** | TanStack Query | 5.80.3 | 数据获取和缓存 |
| **HTTP客户端** | Axios | (via rest client) | HTTP 请求库 |
| **表单管理** | React Hook Form | 7.55.0 | 表单状态管理 |
| **国际化** | i18next | 23.11.5 | 国际化框架 |
| **React i18n** | react-i18next | 15.5.1 | React i18n 集成 |
| **语言检测** | i18next-browser-languagedetector | 8.0.4 | 浏览器语言检测 |
| **主题切换** | next-themes | 0.4.4 | 主题切换支持 |
| **URL状态** | nuqs | 2.4.3 | URL 查询参数状态管理 |
| **加密** | JSEncrypt | 3.3.2 | RSA 加密库 |
| **图片裁剪** | Cropper.js | 1.6.2 | 图片裁剪库 |
| **React裁剪** | react-cropper | 2.3.3 | React Cropper 组件 |
| **OTP输入** | input-otp | 1.4.2 | OTP 输入组件 |
| **Cookie管理** | js-cookie | 3.0.5 | Cookie 操作库 |
| **Next.js Cookie** | cookies-next | 5.0.2 | Next.js Cookie 工具 |
| **工具库** | es-toolkit | 1.35.0 | 现代工具库 |
| **3D图形** | ogl | 1.0.11 | WebGL 库 |
| **UI组件库** | @meta-1/design | 0.0.178 | 内部 UI 组件库 |
| **编辑器** | @meta-1/editor | 0.0.29 | 富文本编辑器 |
| **图标库** | Radix UI Icons | (via @meta-1/design) | 图标组件 |

### 架构模式
- **App Router**: Next.js 16 App Router 架构
- **组件化**: React 组件化开发
- **服务端渲染**: Next.js SSR/SSG 支持
- **客户端状态**: Jotai 原子状态管理
- **服务端状态**: TanStack Query 数据缓存

---

## 共享库 (libs/)

### account 模块
- **类型**: NestJS Library
- **功能**: 账号管理、认证、授权
- **依赖**: @meta-1/nest-security, TypeORM

### kb 模块
- **类型**: NestJS Library
- **功能**: 知识库管理、文档处理
- **依赖**: @meta-1/nest-ai, TypeORM

### types 模块
- **类型**: TypeScript Library
- **功能**: 共享类型定义和 Schema
- **依赖**: Zod

---

## 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| **包管理** | pnpm | >= 8 | 包管理器 |
| **代码检查** | Biome | 2.3.5 | 代码格式化和检查 |
| **测试框架** | Jest | 30.2.0 | 单元测试和 E2E 测试 |
| **测试工具** | ts-jest | 29.4.5 | TypeScript Jest 支持 |
| **构建工具** | NestJS CLI | 11.0.10 | NestJS 项目构建 |
| **TypeScript** | TypeScript | 5.9.3 | TypeScript 编译器 |
| **类型检查** | @types/node | 22.18.12 | Node.js 类型定义 |

---

## 架构模式总结

### Server (Backend)
- **模式**: 分层架构 + 模块化设计
- **特点**: 
  - Controller 层处理 HTTP 请求
  - Service 层处理业务逻辑
  - Repository 层处理数据访问
  - 模块化设计，便于扩展和维护
  - 配置中心化管理（Nacos）
  - 支持向量数据库（Qdrant）用于 RAG

### Web (Frontend)
- **模式**: App Router + 组件化
- **特点**:
  - Next.js App Router 架构
  - React Server Components 支持
  - 客户端和服务端状态分离
  - 原子化状态管理（Jotai）
  - 服务端数据缓存（TanStack Query）

### 集成方式
- **REST API**: Web 通过 REST API 调用 Server
- **共享类型**: 通过 `@meta-1/wiki-types` 共享类型定义
- **Monorepo**: 使用 pnpm workspace 管理多包项目

### 类型包名规范

**项目特定类型包**:
- Wiki 项目: `@meta-1/wiki-types`
- Authub 项目: `@meta-1/authub-types`

**公共组件共享类型**:
- `@meta-1/nest-types` - Meta1 Support 提供的公共组件共享类型

**注意**: `@meta-1/types` 不存在，不要使用。

