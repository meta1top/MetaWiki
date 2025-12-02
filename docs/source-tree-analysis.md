# 源码树分析

## 项目结构概览

MetaWiki 是一个 Monorepo 项目，使用 pnpm workspace 管理多个包。

```
wiki/
├── apps/                    # 应用程序
│   ├── server/             # 后端服务 (NestJS)
│   └── web/                # 前端应用 (Next.js)
├── libs/                    # 共享库
│   ├── account/           # 账号管理模块
│   ├── kb/                # 知识库模块
│   └── types/             # 类型定义
├── docs/                   # 文档目录
├── locales/                # 国际化文件
├── scripts/                # 工具脚本
└── [配置文件]              # 根目录配置文件
```

---

## Server 部分 (apps/server/)

```
apps/server/
├── src/
│   ├── controller/        # API 控制器
│   │   ├── assets.controller.ts      # 资源上传
│   │   ├── config.controller.ts     # 配置管理
│   │   ├── mail-code.controller.ts  # 邮件验证码
│   │   └── index.ts
│   ├── dto/                # 数据传输对象
│   │   ├── config.dto.ts
│   │   └── index.ts
│   ├── shared/             # 共享模块
│   │   ├── app.error-code.ts    # 错误码定义
│   │   ├── app.types.ts         # 类型定义
│   │   └── index.ts
│   ├── app.module.ts       # 主模块
│   ├── app.swagger.ts      # Swagger 配置
│   └── main.ts             # 应用入口
└── tsconfig.app.json       # TypeScript 配置
```

**关键目录说明**:
- `controller/`: REST API 端点定义
- `dto/`: API 请求/响应数据传输对象
- `shared/`: 应用级共享代码（错误码、类型等）
- `main.ts`: 应用启动入口，初始化 NestJS 应用

---

## Web 部分 (apps/web/)

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
│   │   │   ├── account/    # 账号组件
│   │   │   ├── breadcrumb/ # 面包屑
│   │   │   ├── cropper/    # 图片裁剪
│   │   │   ├── input/      # 输入组件
│   │   │   ├── page/       # 页面组件
│   │   │   └── ...
│   │   └── layout/         # 布局组件
│   │       ├── hooks/      # 布局 Hooks
│   │       ├── html/       # HTML 布局
│   │       ├── login/      # 登录布局
│   │       ├── main/       # 主布局
│   │       │   ├── footer/ # 页脚
│   │       │   ├── header/ # 头部
│   │       │   └── ...
│       │       ├── root/  # 根布局
│   │       └── wiki/       # Wiki 布局
│   ├── hooks/              # 自定义 Hooks
│   ├── rest/               # API 请求客户端
│   │   ├── account.ts      # 账号 API
│   │   ├── assets.ts       # 资源 API
│   │   ├── profile/        # 个人资料 API
│   │   └── wiki/           # 知识库 API
│   ├── state/              # 状态管理 (Jotai)
│   │   ├── access.ts       # 访问控制状态
│   │   ├── config.ts       # 配置状态
│   │   ├── layout.ts       # 布局状态
│   │   ├── profile.ts      # 用户资料状态
│   │   ├── public.ts       # 公共状态
│   │   └── wiki.ts         # 知识库状态
│   ├── types/              # TypeScript 类型定义
│   ├── utils/              # 工具函数
│   ├── config/             # 配置文件
│   ├── events/             # 事件定义
│   ├── plugin/             # 插件配置
│   │   ├── formatters.ts   # 格式化器
│   │   ├── locales.ts      # 国际化插件
│   │   ├── middleware.ts   # 中间件
│   │   ├── rest.client.ts  # REST 客户端插件
│   │   └── rest.server.ts  # REST 服务端插件
│   └── schema/             # 数据验证 Schema
├── public/                 # 静态资源
│   ├── assets/            # 图片资源
│   └── [favicon等]        # 网站图标
├── next.config.ts         # Next.js 配置
└── tsconfig.json          # TypeScript 配置
```

**关键目录说明**:
- `app/`: Next.js App Router 页面和路由
- `components/`: React 组件库
- `rest/`: API 请求封装
- `state/`: Jotai 原子状态定义
- `hooks/`: 自定义 React Hooks
- `plugin/`: 应用级插件配置

---

## Account 库 (libs/account/)

```
libs/account/
├── src/
│   ├── controller/        # 账号控制器
│   │   ├── account.controller.ts      # 账号 API
│   │   ├── account-otp.controller.ts  # OTP API
│   │   └── index.ts
│   ├── dto/               # 数据传输对象
│   │   ├── account.dto.ts
│   │   ├── account-otp.dto.ts
│   │   └── index.ts
│   ├── entity/            # 数据库实体
│   │   ├── account.entity.ts          # 账号实体
│   │   ├── account-token.entity.ts    # 令牌实体
│   │   └── index.ts
│   ├── guards/            # 守卫（认证/授权）
│   │   ├── auth.guard.ts
│   │   ├── auth.guard.types.ts
│   │   └── index.ts
│   ├── service/           # 业务逻辑服务
│   │   ├── account.service.ts         # 账号服务
│   │   ├── account-otp.service.ts     # OTP 服务
│   │   ├── account-config.service.ts  # 配置服务
│   │   └── index.ts
│   ├── shared/            # 共享代码
│   │   ├── account.const.ts      # 常量定义
│   │   ├── account.error-code.ts # 错误码
│   │   ├── account.types.ts       # 类型定义
│   │   └── index.ts
│   ├── account.module.ts  # NestJS 模块
│   └── index.ts           # 导出入口
└── tsconfig.lib.json      # TypeScript 配置
```

**关键目录说明**:
- `controller/`: 账号相关 API 端点
- `entity/`: 数据库实体定义
- `service/`: 业务逻辑实现
- `guards/`: 认证授权守卫

---

## KB 库 (libs/kb/)

```
libs/kb/
├── src/
│   ├── controller/        # 知识库控制器
│   │   ├── wiki-repo.controller.ts
│   │   └── index.ts
│   ├── dto/               # 数据传输对象
│   │   ├── wiki-repo.dto.ts
│   │   └── index.ts
│   ├── entity/            # 数据库实体
│   │   ├── wiki-repo.entity.ts
│   │   └── index.ts
│   ├── service/           # 业务逻辑服务
│   │   ├── wiki-repo.service.ts
│   │   └── index.ts
│   ├── shared/            # 共享代码
│   │   ├── kb.error-code.ts
│   │   └── index.ts
│   ├── kb.module.ts       # NestJS 模块
│   └── index.ts           # 导出入口
└── tsconfig.lib.json      # TypeScript 配置
```

**关键目录说明**:
- `controller/`: 知识库 API 端点
- `entity/`: 知识库实体定义
- `service/`: 知识库业务逻辑

---

## Types 库 (libs/types/)

```
libs/types/
├── src/
│   ├── account/           # 账号类型
│   │   ├── account.schema.ts    # Zod Schema
│   │   ├── account.types.ts     # TypeScript 类型
│   │   ├── account-otp.schema.ts
│   │   └── index.ts
│   ├── wiki/              # 知识库类型
│   │   ├── wiki-repo.schema.ts
│   │   └── index.ts
│   ├── common.types.ts    # 通用类型
│   └── index.ts           # 导出入口
└── tsconfig.lib.json      # TypeScript 配置
```

**关键目录说明**:
- `account/`: 账号相关类型和 Schema
- `wiki/`: 知识库相关类型和 Schema
- `common.types.ts`: 跨模块通用类型

---

## 根目录文件

```
wiki/
├── package.json           # 根 package.json (workspace 配置)
├── pnpm-workspace.yaml    # pnpm workspace 配置
├── tsconfig.json          # 根 TypeScript 配置
├── tsconfig.build.json    # 构建配置
├── tsconfig.web.json      # Web 专用配置
├── nest-cli.json          # NestJS CLI 配置
├── webpack.config.js      # Webpack 配置
├── biome.json             # Biome 代码格式化配置
├── README.md              # 项目说明文档
└── locales/               # 国际化文件
    ├── en.json           # 英文翻译
    └── zh-CN.json        # 中文翻译
```

---

## 关键目录说明

### 入口点

- **Server**: `apps/server/src/main.ts`
- **Web**: `apps/web/src/app/layout.tsx` (根布局)

### 集成点

- **Server ↔ Web**: REST API (`/api/*`)
- **共享类型**: `libs/types/` 通过 workspace 共享
- **国际化**: `locales/` 目录，服务端和客户端共享

### 构建输出

- **Server**: `dist/apps/server/`
- **Web**: `.next/` (Next.js 构建输出)

---

## Monorepo 结构优势

1. **代码共享**: 通过 workspace 共享类型和工具函数
2. **统一管理**: 统一的依赖管理和构建配置
3. **类型安全**: 共享类型定义确保前后端类型一致
4. **开发效率**: 修改共享代码自动影响所有依赖包

