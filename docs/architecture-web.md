# Web 架构文档

**生成日期**: 2025-12-02  
**项目类型**: Web (Next.js)  
**架构模式**: App Router + 组件化

## 执行摘要

MetaWiki Web 是基于 Next.js 16 和 React 19 构建的现代化 RAG 知识库管理平台前端应用。采用 Next.js App Router 架构，支持服务端渲染和客户端交互，使用 Jotai 进行轻量级状态管理，TanStack Query 管理服务端状态，提供完整的知识库管理、Agent 对话和用户认证功能。

## 项目分类

- **仓库类型**: Monorepo（多部分项目）
- **项目类型**: Web
- **主要语言**: TypeScript 5
- **架构模式**: App Router + 组件化

## 技术栈

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

### 架构模式

- **App Router**: Next.js 16 App Router 架构
- **组件化**: React 组件化开发
- **服务端渲染**: Next.js SSR/SSG 支持
- **客户端状态**: Jotai 原子状态管理
- **服务端状态**: TanStack Query 数据缓存

## 架构模式详解

### App Router 架构

Next.js 16 使用 App Router 架构，基于文件系统的路由：

```
app/
├── (login)/          # 路由组（不影响 URL）
│   ├── login/       # /login
│   └── register/    # /register
├── (main)/          # 路由组
│   ├── page.tsx     # /
│   ├── wiki/        # /wiki
│   └── profile/      # /profile
└── layout.tsx       # 根布局
```

### 组件化设计

采用 React 组件化开发，组件按功能分类：

- **Layout Components**: 布局组件（Header、Footer、Sidebar）
- **Common Components**: 通用组件（Button、Input、Form）
- **Feature Components**: 功能组件（Wiki、Agent、Profile）

### 状态管理策略

采用双状态管理策略：

- **Jotai**: 客户端轻量级状态（UI 状态、表单状态）
- **TanStack Query**: 服务端状态（API 数据、缓存）

### 数据流

```
User Interaction
    ↓
Component (React)
    ↓
┌──────────────┬──────────────┐
│   Jotai      │ TanStack     │
│ (客户端状态)  │ Query        │
│              │ (服务端状态)  │
└──────────────┴──────┬───────┘
                      │
                 REST API
                      │
                  Server
```

## 实施模式

### 命名约定

为确保代码一致性和可维护性，项目遵循以下命名约定：

#### 文件命名

- **页面文件**: `page.tsx`（Next.js App Router 约定）
- **布局文件**: `layout.tsx`（Next.js App Router 约定）
- **组件文件**: `{ComponentName}.tsx`（PascalCase）
  - 示例: `RegisterPage.tsx`, `WikiList.tsx`, `EmailCodeInput.tsx`
- **Hook 文件**: `use{Feature}.ts`（camelCase，以 `use` 开头）
  - 示例: `useAuth.ts`, `useWiki.ts`, `useEncrypt.ts`
- **API 客户端文件**: `{module}.ts`（kebab-case）
  - 示例: `account.ts`, `wiki-repo.ts`
- **状态文件**: `{feature}.ts`（kebab-case）
  - 示例: `access.ts`, `config.ts`, `wiki.ts`
- **类型文件**: `{module}.types.ts`（kebab-case）
  - 示例: `account.types.ts`, `wiki.types.ts`
- **工具文件**: `{feature}.ts`（kebab-case）
  - 示例: `rest.ts`, `token.ts`, `query.ts`

#### 组件命名

- **页面组件**: `{Page}Page`（PascalCase，以 `Page` 结尾）
  - 示例: `RegisterPage`, `LoginPage`, `WikiPage`
- **布局组件**: `{Layout}Layout`（PascalCase，以 `Layout` 结尾）
  - 示例: `RootLayout`, `MainLayout`, `LoginLayout`
- **功能组件**: `{Feature}`（PascalCase）
  - 示例: `WikiList`, `WikiItem`, `EmailCodeInput`
- **通用组件**: `{Component}`（PascalCase）
  - 示例: `Button`, `Input`, `Form`, `Dialog`

#### 变量和函数命名

- **变量**: `camelCase`
  - 示例: `userData`, `wikiList`, `isLoading`
- **函数**: `camelCase`
  - 示例: `handleSubmit()`, `fetchWikiList()`, `validateEmail()`
- **Hook**: `use{Feature}`（camelCase，以 `use` 开头）
  - 示例: `useAuth()`, `useWiki()`, `useMutation()`
- **常量**: `UPPER_SNAKE_CASE`
  - 示例: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`
- **状态变量**: `camelCase`（通常以 `is`、`has`、`should` 开头表示布尔值）
  - 示例: `isLoading`, `hasError`, `shouldRefresh`

#### 目录命名

- **路由目录**: `{route}/`（kebab-case）
  - 示例: `(login)/`, `(main)/`, `wiki/`
- **组件目录**: `{feature}/`（kebab-case）
  - 示例: `layout/`, `common/`, `wiki/`
- **Hook 目录**: `hooks/`（固定名称）
- **API 客户端目录**: `rest/`（固定名称）
- **状态目录**: `state/`（固定名称）

#### 路由命名

- **页面路由**: 基于文件系统路由（Next.js App Router）
  - 示例: `app/(login)/login/page.tsx` → `/login`
  - 示例: `app/(main)/wiki/page.tsx` → `/wiki`
- **路由组**: `(group-name)/`（括号包裹，不影响 URL）
  - 示例: `(login)/`, `(main)/`, `(wiki)/`

### 错误处理模式

#### API 错误响应格式

前端通过 REST API 接收统一的错误响应格式：

```typescript
interface ErrorResponse {
  code: number;           // 错误码（数字）
  success: false;         // 固定为 false
  message: string;        // 错误消息（可国际化）
  data: unknown | null;   // 错误详情数据（可选）
  timestamp: string;      // ISO 8601 时间戳
  path: string;           // 请求路径
}
```

#### REST 客户端错误处理

使用统一的 REST 客户端（`apps/web/src/utils/rest.ts`）进行 API 调用：

```typescript
import { get, post } from "@/utils/rest";
import type { WikiRepo } from "@meta-1/wiki-types";

// GET 请求
export const listRepo = () => get<WikiRepo[], null>("@api/wiki/repo/list", null);

// POST 请求
export const createRepo = (data: CreateWikiRepoData) => 
  post<WikiRepo, CreateWikiRepoData>("@api/wiki/repo/create", data);
```

**REST 客户端特性**:
- 自动添加认证 Header（JWT Token）
- 统一错误处理（抛出 `RestError`）
- 类型安全（TypeScript 类型推断）
- 别名映射（`@api` → `/api`）

#### TanStack Query 错误处理

使用封装的 `useQuery` 和 `useMutation` Hook 进行数据获取和变更：

```typescript
import { useQuery, useMutation } from "@/hooks";
import { listRepo } from "@/rest/wiki/repo";

// Query 示例
const { data, isLoading, error } = useQuery({
  queryKey: ["wiki-repo-list"],
  queryFn: () => listRepo(),
});

// Mutation 示例
const { mutate, isPending, error } = useMutation({
  mutationFn: createRepo,
  onSuccess: (data) => {
    // 成功处理
    console.log("创建成功", data);
  },
  onError: (error) => {
    // 错误处理（已全局处理，此处可自定义）
    console.error("创建失败", error);
  },
});
```

**全局错误处理**:
- TanStack Query 封装了全局错误处理
- 错误会自动显示错误提示（通过 UI 组件）
- 支持自定义错误处理逻辑（`onError` 回调）

#### 错误类型

前端定义 `RestError` 类用于错误处理：

```typescript
export class RestError extends Error {
  code: number;
  message: string;
  data: unknown;
  timestamp: string;
  path: string;

  constructor(response: ErrorResponse) {
    super(response.message);
    this.code = response.code;
    this.message = response.message;
    this.data = response.data;
    this.timestamp = response.timestamp;
    this.path = response.path;
  }
}
```

#### 表单验证错误处理

使用 React Hook Form + Zod Schema 进行表单验证：

```typescript
import { Form, FormItem } from "@meta-1/design";
import { RegisterSchema, type RegisterData } from "@meta-1/wiki-types";

<Form<RegisterData>
  onSubmit={handleSubmit}
  schema={RegisterSchema}  // Zod Schema 自动验证
>
  <FormItem label="邮箱" name="email">
    <Input placeholder="请输入邮箱" />
  </FormItem>
  {/* 验证错误自动显示 */}
</Form>
```

**验证错误显示**:
- 字段级错误自动显示在表单项下方
- 使用国际化消息（`locales/`）
- 支持自定义错误消息

#### 状态管理错误处理

**Jotai 状态错误**:
- 使用 `atom` 定义状态，错误通过组件状态管理
- 错误状态通常存储在独立的 `errorAtom` 中

**TanStack Query 状态错误**:
- 错误自动存储在 Query 状态中
- 通过 `error` 对象访问错误信息
- 支持错误重试机制（自动或手动）

#### 用户友好的错误提示

- **Toast 通知**: 使用 UI 组件库的 Toast 组件显示错误
- **表单错误**: 在表单项下方显示字段级错误
- **页面级错误**: 使用 Error Boundary 捕获渲染错误
- **国际化**: 所有错误消息支持多语言（中文/英文）

## 数据架构

### 状态管理

#### Jotai 原子状态

位于 `apps/web/src/state/`：

- **access.ts**: 访问控制状态
- **config.ts**: 配置状态
- **layout.ts**: 布局状态
- **profile.ts**: 用户资料状态
- **public.ts**: 公共状态
- **wiki.ts**: 知识库状态

#### TanStack Query

用于管理服务端状态：

- **自动缓存**: API 响应自动缓存
- **自动重试**: 失败请求自动重试
- **后台更新**: 数据后台自动更新
- **SSR 支持**: 服务端预取数据

### API 客户端

位于 `apps/web/src/rest/`：

- **account.ts**: 账号 API
- **assets.ts**: 资源 API
- **profile/**: 个人资料 API
- **wiki/**: 知识库 API

使用统一的 REST 客户端，支持：

- 别名映射（`@api` → `/api`）
- 自动添加认证 Header
- 统一错误处理
- 类型安全

### 数据流示例

**知识库列表获取**:

```
1. 组件调用
   → useQuery({ queryKey: ['wiki-repo-list'] })
   
2. TanStack Query
   → 检查缓存
   → 如果缓存存在，返回缓存数据
   → 如果缓存不存在，调用 API
   
3. REST 客户端
   → apps/web/src/rest/wiki/repo.ts
   → listRepo()
   
4. API 请求
   → GET /api/wiki/repo/list
   → 携带 JWT Token
   
5. 响应处理
   → 类型安全的 TypeScript 类型
   → 自动缓存到 TanStack Query
   → 更新组件状态
```

## API 设计

### REST API 集成

前端通过 REST API 与后端通信：

- **Base URL**: `http://localhost:3710`（开发环境）
- **API 前缀**: `/api`
- **认证方式**: JWT Token（Bearer Token）

### API 调用封装

使用统一的 REST 客户端封装：

```typescript
// apps/web/src/rest/wiki/repo.ts
export const listRepo = () => get<WikiRepo[], null>("@api/wiki/repo/list", null);
```

### 类型安全

使用共享类型定义确保类型安全：

```typescript
import type { WikiRepo } from "@meta-1/wiki-types";
```

### 错误处理

使用 TanStack Query 的全局错误处理：

- 统一错误格式
- 自动重试机制
- 错误提示展示

## 组件概述

### Layout Components

位于 `apps/web/src/components/layout/`：

- **html/**: HTML 布局组件
- **root/**: 根布局组件
- **login/**: 登录布局组件
- **main/**: 主布局组件（Header、Footer、Sidebar）
- **wiki/**: Wiki 布局组件

### Common Components

位于 `apps/web/src/components/common/`：

- **account/**: 账号相关组件
- **breadcrumb/**: 面包屑导航
- **cropper/**: 图片裁剪组件
- **input/**: 输入组件（邮箱验证码输入等）
- **page/**: 页面组件
- **server-state-loader/**: 服务端状态加载器

### Feature Components

功能相关组件：

- **wiki/**: 知识库管理组件
- **agent/**: Agent 管理组件
- **profile/**: 个人资料组件

### UI 组件库

使用 `@meta-1/design` 组件库：

- 基于 shadcn/ui 的高阶组件
- 包含 Form、Button、Input、Dialog 等常用组件
- 支持主题切换和国际化

## 源码树

```
apps/web/
├── src/
│   ├── app/                # Next.js App Router 页面
│   │   ├── (login)/       # 登录注册路由组
│   │   │   ├── login/     # 登录页面
│   │   │   └── register/  # 注册页面
│   │   ├── (main)/        # 主应用路由组
│   │   │   ├── agent/     # Agent 管理
│   │   │   ├── components/ # 组件页面
│   │   │   ├── profile/   # 个人资料
│   │   │   ├── wiki/      # 知识库管理
│   │   │   ├── layout.tsx # 主布局
│   │   │   └── page.tsx   # 首页
│   │   ├── (wiki)/        # Wiki 路由组
│   │   │   └── wiki/      # Wiki 页面
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx        # 根页面
│   ├── components/         # React 组件
│   │   ├── background/    # 背景组件
│   │   │   └── iridescence/ # 虹彩动画
│   │   ├── common/         # 通用组件
│   │   └── layout/         # 布局组件
│   ├── hooks/              # 自定义 Hooks
│   ├── rest/               # API 请求客户端
│   ├── state/              # 状态管理 (Jotai)
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── config/             # 配置文件
│   ├── events/             # 事件定义
│   └── plugin/             # 插件配置
├── public/                 # 静态资源
└── next.config.ts         # Next.js 配置
```

**关键目录说明**:
- `app/`: Next.js App Router 页面和路由
- `components/`: React 组件库
- `rest/`: API 请求封装
- `state/`: Jotai 原子状态定义
- `hooks/`: 自定义 React Hooks
- `plugin/`: 应用级插件配置

## 开发工作流

### 启动开发服务器

```bash
# 启动前端应用（端口 3110）
pnpm run dev:web
```

访问 http://localhost:3110 查看应用。

### 添加新的页面

1. 在 `apps/web/src/app/` 创建页面文件
2. 在 `apps/web/src/components/` 创建组件
3. 在 `apps/web/src/rest/` 添加 API 请求函数
4. 在 `apps/web/src/state/` 添加状态管理（如需要）

### 添加新的组件

1. 在 `apps/web/src/components/` 创建组件目录
2. 使用 `@meta-1/design` 组件库的基础组件
3. 遵循组件化设计原则

### 添加新的 API 调用

1. 在 `apps/web/src/rest/` 添加 API 函数
2. 使用共享类型定义（`@meta-1/wiki-types`）
3. 在组件中使用 `useQuery` 或 `useMutation`

## 部署架构

### 构建过程

```bash
# 构建前端应用
pnpm run build:web

# 构建输出: apps/web/.next/
```

### 环境变量

创建 `apps/web/.env.local` 文件：

```env
# API 基础地址
NEXT_PUBLIC_API_URL=http://localhost:3710

# 公钥配置（用于 RSA 加密）
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key
```

### 生产部署

```bash
# 构建生产版本
pnpm run build:web

# 启动生产服务器
cd apps/web
pnpm start
```

### 静态资源

静态资源位于 `public/` 目录：

- **assets/**: 图片资源
- **favicon**: 网站图标
- **manifest**: PWA 配置

## 测试策略

### 单元测试

使用 Jest 进行单元测试：

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch
```

### 组件测试

使用 React Testing Library 进行组件测试：

- 测试组件渲染
- 测试用户交互
- 测试状态变化

### E2E 测试

使用 Playwright 或 Cypress 进行端到端测试：

```bash
# E2E 测试
pnpm test:e2e
```

## 性能优化

### 代码分割

Next.js 自动进行代码分割：

- 按路由分割
- 按组件分割
- 动态导入

### 数据缓存

使用 TanStack Query 进行数据缓存：

- API 响应自动缓存
- 后台自动更新
- 减少不必要的请求

### 图片优化

使用 Next.js Image 组件：

- 自动图片优化
- 懒加载
- 响应式图片

### 服务端渲染

使用 Next.js SSR/SSG：

- 服务端预取数据
- 减少客户端加载时间
- SEO 优化

## 国际化

### 多语言支持

使用 i18next 进行国际化：

- **支持语言**: 中文、英文
- **语言文件**: `locales/` 目录
- **自动检测**: 浏览器语言自动检测

### 使用方式

```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
const text = t("键名");
```

## 主题管理

### 主题切换

使用 `next-themes` 进行主题管理：

- **支持主题**: 明暗主题
- **持久化**: 主题选择持久化到 localStorage
- **系统偏好**: 自动检测系统主题偏好

## 安全考虑

### 认证安全

- **JWT Token**: Token 存储在 Cookie 或 LocalStorage
- **Token 过期**: 自动处理 Token 过期
- **自动登出**: Token 无效时自动登出

### 数据加密

- **密码加密**: 使用 RSA 公钥加密密码
- **传输加密**: HTTPS 加密传输

### XSS 防护

- **React 自动转义**: React 自动转义用户输入
- **Content Security Policy**: CSP 策略

## 集成点

### 与 Server 部分的集成

- **REST API**: 通过 REST API 调用 Server
- **共享类型**: 通过 `@meta-1/wiki-types` 共享类型定义
- **国际化**: 共享 `locales/` 目录

### 与外部服务的集成

- **API 服务**: 通过 REST API 调用后端服务
- **文件上传**: 通过预签名 URL 上传文件

## 相关文档

- [状态管理文档](./state-management-web.md) - 前端状态管理详解
- [UI 组件清单](./ui-component-inventory-web.md) - UI 组件列表
- [集成架构文档](./integration-architecture.md) - 前后端集成架构
- [开发指南](./development-guide.md) - 开发和部署指南

---

_文档由 BMAD Method `document-project` 工作流生成_

