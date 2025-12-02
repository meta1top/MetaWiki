# 集成架构文档

## 概述

MetaWiki 是一个 Monorepo 项目，包含两个主要部分：**Server**（后端服务）和 **Web**（前端应用）。本文档描述这两个部分之间的集成架构和通信方式。

## 项目结构

```
wiki/
├── apps/
│   ├── server/          # 后端服务 (NestJS)
│   └── web/             # 前端应用 (Next.js)
├── libs/
│   ├── account/         # 账号管理模块（后端）
│   ├── kb/              # 知识库模块（后端）
│   └── types/           # 共享类型定义
├── locales/             # 国际化文件（前后端共享）
└── [配置文件]
```

## 集成点

### 1. REST API 通信

**类型**: REST API  
**方向**: Web → Server  
**协议**: HTTP/HTTPS  
**数据格式**: JSON

#### API 基础配置

- **Base URL**: `http://localhost:3710`（开发环境）
- **API 前缀**: `/api`
- **认证方式**: JWT Token（Bearer Token）

#### API 端点映射

前端通过 REST 客户端调用后端 API，使用别名 `@api` 映射到 `/api`：

```typescript
// 前端配置 (apps/web/src/plugin/rest.client.ts)
alias({
  "@api": {
    url: "/api",
    headers: get,
  },
});
```

#### 主要 API 端点

##### 账号管理 (`/api/account`)

- `POST /api/account/login` - 用户登录
- `POST /api/account/register` - 用户注册
- `GET /api/account/profile` - 获取用户资料
- `POST /api/account/logout` - 用户登出
- `GET /api/account/otp/secret` - 获取 OTP 密钥
- `GET /api/account/otp/status` - 获取 OTP 状态
- `POST /api/account/otp/enable` - 启用 OTP
- `POST /api/account/otp/disable` - 禁用 OTP

##### 知识库管理 (`/api/wiki/repo`)

- `GET /api/wiki/repo/list` - 获取知识库列表
- `POST /api/wiki/repo/create` - 创建知识库
- `GET /api/wiki/repo/:path` - 根据路径获取知识库详情

##### 配置管理 (`/api/config`)

- `GET /api/config/common` - 获取公共配置（RSA 公钥等）

##### 资源管理 (`/api/assets`)

- `POST /api/assets/upload/pre-sign` - 生成预签名上传 URL

##### 邮件服务 (`/api/mail/code`)

- `POST /api/mail/code/send` - 发送验证码

#### 请求/响应格式

**统一响应格式**:
```typescript
interface RestResult<T> {
  code: string | number;
  message: string;
  data: T | null;
}
```

**认证 Header**:
```
Authorization: Bearer <jwt-token>
```

#### 错误处理

- **401 Unauthorized**: Token 过期或无效，前端自动触发登出流程
- **统一错误格式**: 所有错误遵循 `RestResult` 格式

### 2. 共享类型定义

**类型**: TypeScript 类型共享  
**位置**: `libs/types/`  
**共享方式**: pnpm workspace

#### 类型定义结构

```
libs/types/
├── src/
│   ├── account/           # 账号相关类型
│   │   ├── account.schema.ts    # Zod Schema
│   │   ├── account.types.ts      # TypeScript 类型
│   │   └── account-otp.schema.ts
│   ├── wiki/              # 知识库相关类型
│   │   ├── wiki-repo.schema.ts
│   │   └── index.ts
│   ├── common.types.ts    # 通用类型
│   └── index.ts           # 导出入口
```

#### 使用方式

**后端使用**:
```typescript
import { LoginData, Profile } from "@meta-1/wiki-types";
```

**前端使用**:
```typescript
import type { LoginData, Profile, Token } from "@meta-1/wiki-types";
import { RegisterData } from "@meta-1/wiki-types";
```

#### 类型同步

- 前后端共享相同的类型定义，确保类型安全
- 使用 Zod Schema 进行运行时验证（后端）
- TypeScript 类型用于编译时检查（前后端）

### 3. 国际化文件

**类型**: 国际化资源文件  
**位置**: `locales/`  
**共享方式**: 文件共享

#### 国际化文件结构

```
locales/
├── en.json       # 英文翻译
└── zh-CN.json    # 中文翻译
```

#### 使用方式

**后端**: 使用 `nestjs-i18n` 进行国际化
**前端**: 使用 `i18next` 和 `react-i18next` 进行国际化

#### 同步机制

项目提供了同步脚本：
```bash
pnpm run sync:locales
```

该脚本确保前后端使用相同的国际化文件。

### 4. 认证流程

**类型**: JWT Token 认证  
**流程**: 标准 OAuth 2.0 Bearer Token 流程

#### 认证流程

1. **用户登录**:
   ```
   Web → POST /api/account/login
   Server → 返回 JWT Token
   ```

2. **Token 存储**:
   - 前端将 Token 存储在 Cookie 或 LocalStorage
   - 后续请求自动携带 Token

3. **Token 验证**:
   ```
   Web → 请求时携带 Authorization: Bearer <token>
   Server → 验证 Token，返回数据或 401
   ```

4. **Token 过期处理**:
   - Server 返回 401
   - Web 自动触发登出流程
   - 重定向到登录页面

#### 认证守卫

后端使用 NestJS Guards 进行认证：
- `@meta-1/nest-security` 提供的 Auth Guard
- 标记为 `@Public()` 的接口无需认证

### 5. 数据流

#### 典型数据流示例

**知识库列表获取**:

```
1. Web 组件调用
   → apps/web/src/rest/wiki/repo.ts
   → listRepo()

2. REST 客户端
   → 使用 @api 别名
   → GET /api/wiki/repo/list
   → 携带 JWT Token

3. Server 控制器
   → apps/server/src/controller/
   → WikiRepoController.list()

4. Server 服务层
   → libs/kb/src/service/
   → WikiRepoService

5. 数据库查询
   → TypeORM Entity
   → MySQL 数据库

6. 响应返回
   → Server → Web
   → 类型安全的 TypeScript 类型
   → 前端组件渲染
```

## 集成架构图

```
┌─────────────────────────────────────────────────────────┐
│                      Web (Next.js)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Components │  │  REST Client │  │   State Mgmt│  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘  │
│         │                 │                            │
│         └─────────────────┼────────────────────────────┘
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             │ REST API (HTTP/JSON)
                             │ JWT Authentication
                             │
┌────────────────────────────┼────────────────────────────┐
│                            │      Server (NestJS)        │
│  ┌──────────────┐  ┌──────▼───────┐  ┌──────────────┐ │
│  │ Controllers  │  │   Services   │  │   Entities   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬────────┘ │
│         │                 │                 │          │
│         └─────────────────┼─────────────────┘          │
│                            │                            │
└────────────────────────────┼────────────────────────────┘
                             │
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  MySQL  │         │  Redis  │         │ Qdrant  │
   │Database │         │  Cache  │         │ Vectors │
   └─────────┘         └─────────┘         └─────────┘

        ┌─────────────────────────────────────┐
        │      Shared Resources               │
        │  • libs/types/ (TypeScript Types)  │
        │  • locales/ (i18n Files)           │
        └─────────────────────────────────────┘
```

## 数据格式

### 请求格式

**POST 请求示例**:
```typescript
// 登录请求
POST /api/account/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "encrypted-password"
}
```

**GET 请求示例**:
```
GET /api/wiki/repo/list
Authorization: Bearer <jwt-token>
```

### 响应格式

**成功响应**:
```json
{
  "code": "SUCCESS",
  "message": "操作成功",
  "data": {
    "id": "123",
    "name": "知识库名称",
    ...
  }
}
```

**错误响应**:
```json
{
  "code": "ERROR_CODE",
  "message": "错误描述",
  "data": null
}
```

## 安全考虑

### 认证安全

- **JWT Token**: 使用安全的 JWT Secret
- **Token 过期**: Token 有过期时间（默认 7 天）
- **HTTPS**: 生产环境必须使用 HTTPS

### 数据加密

- **密码加密**: 使用 RSA 公钥加密密码（前端）
- **传输加密**: HTTPS 加密传输
- **存储加密**: 数据库密码哈希存储

### API 安全

- **认证守卫**: 大部分 API 需要认证
- **公开接口**: 仅登录、注册、配置等接口公开
- **CORS**: 配置适当的 CORS 策略

## 开发注意事项

### 类型安全

- 始终使用共享类型定义，避免手动定义类型
- 使用 TypeScript 严格模式
- 利用 Zod Schema 进行运行时验证

### API 调用

- 使用统一的 REST 客户端（`@/utils/rest`）
- 使用别名 `@api` 而不是硬编码路径
- 正确处理错误响应

### 状态管理

- 使用 TanStack Query 管理服务端状态
- 使用 Jotai 管理客户端状态
- 避免重复的状态定义

### 国际化

- 使用共享的国际化文件
- 运行 `pnpm run sync:locales` 同步翻译
- 使用 i18next key 而不是硬编码文本

## 故障排查

### API 调用失败

1. 检查 `NEXT_PUBLIC_API_URL` 环境变量
2. 检查网络连接
3. 检查 Token 是否有效
4. 查看浏览器控制台和服务器日志

### 类型错误

1. 确保 `libs/types` 已正确构建
2. 检查导入路径是否正确
3. 运行 `pnpm install` 确保依赖正确

### 国际化问题

1. 运行 `pnpm run sync:locales` 同步文件
2. 检查语言文件格式是否正确
3. 检查 i18next 配置

## 相关文档

- [API 合约文档](./api-contracts-server.md) - 详细的 API 端点文档
- [数据模型文档](./data-models-server.md) - 数据库实体定义
- [状态管理文档](./state-management-web.md) - 前端状态管理
- [开发指南](./development-guide.md) - 开发和部署指南

