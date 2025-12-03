# Server 架构文档

**生成日期**: 2025-12-02  
**项目类型**: Backend (NestJS)  
**架构模式**: 分层架构 + 模块化设计

## 执行摘要

MetaWiki Server 是基于 NestJS 11 构建的 RAG（Retrieval-Augmented Generation）后端服务，提供知识库管理、文档处理、向量存储、智能 Agent 等核心功能。采用分层架构设计，通过模块化方式组织代码，支持配置中心化管理、向量数据库集成和 AI 能力扩展。

## 项目分类

- **仓库类型**: Monorepo（多部分项目）
- **项目类型**: Backend
- **主要语言**: TypeScript 5.9.3
- **架构模式**: 分层架构 + 模块化设计

## 技术栈

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

### 架构模式

- **分层架构**: Controller → Service → Repository
- **模块化设计**: 基于 NestJS Module 系统
- **依赖注入**: NestJS DI 容器
- **配置驱动**: Nacos 配置中心管理配置

## 架构模式详解

### 分层架构

Server 采用经典的三层架构模式：

```
┌─────────────────────────────────────┐
│         Controller Layer             │  ← HTTP 请求处理
│  (API 端点、请求验证、响应格式化)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Service Layer                │  ← 业务逻辑处理
│  (业务规则、事务管理、服务编排)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Repository/Entity Layer         │  ← 数据访问
│  (数据库操作、实体定义、ORM映射)      │
└─────────────────────────────────────┘
```

### 模块化设计

项目采用 NestJS 模块化设计，每个功能模块独立封装：

- **AccountModule**: 账号管理模块（认证、授权、OTP）
- **KnowledgeBaseModule**: 知识库管理模块（文档处理、向量存储）
- **CommonModule**: 通用工具模块（装饰器、拦截器、异常处理）
- **SecurityModule**: 安全模块（JWT、会话管理）
- **MessageModule**: 消息服务模块（邮件发送）
- **AssetsModule**: 资源管理模块（文件上传）

### 依赖注入

使用 NestJS 的依赖注入系统，通过构造函数注入依赖：

```typescript
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private repository: Repository<Account>,
    private readonly configService: AccountConfigService,
    private readonly encryptService: EncryptService,
  ) {}
}
```

## 实施模式

### 命名约定

为确保代码一致性和可维护性，项目遵循以下命名约定：

#### 文件命名

- **Controller 文件**: `{module}.controller.ts` 或 `{module}-{feature}.controller.ts`（kebab-case）
  - 示例: `account.controller.ts`, `account-token.controller.ts`
- **Service 文件**: `{module}.service.ts` 或 `{module}-{feature}.service.ts`（kebab-case）
  - 示例: `account.service.ts`, `account-otp.service.ts`
- **DTO 文件**: `{module}.dto.ts` 或 `{module}-{feature}.dto.ts`（kebab-case）
  - 示例: `account.dto.ts`, `account-token.dto.ts`
- **Entity 文件**: `{entity}.entity.ts`（kebab-case）
  - 示例: `account.entity.ts`, `wiki-repo.entity.ts`
- **错误码文件**: `{module}.error-code.ts`（kebab-case）
  - 示例: `account.error-code.ts`, `kb.error-code.ts`
- **类型文件**: `{module}.types.ts` 或 `{module}.schema.ts`（kebab-case）
  - 示例: `account.types.ts`, `wiki-repo.schema.ts`
- **索引文件**: `index.ts`（统一导出）

#### 类命名

- **Controller 类**: `{Module}Controller`（PascalCase）
  - 示例: `AccountController`, `AccountTokenController`
- **Service 类**: `{Module}Service` 或 `{Module}{Feature}Service`（PascalCase）
  - 示例: `AccountService`, `AccountOtpService`
- **DTO 类**: `{Module}Dto` 或 `{Module}{Feature}Dto`（PascalCase）
  - 示例: `AccountDto`, `LoginDto`, `RegisterDto`
- **Entity 类**: `{Entity}`（PascalCase）
  - 示例: `Account`, `WikiRepo`
- **Guard 类**: `{Feature}Guard`（PascalCase）
  - 示例: `AuthGuard`

#### 变量和函数命名

- **变量**: `camelCase`
  - 示例: `accountService`, `userRepository`, `configService`
- **函数**: `camelCase`
  - 示例: `findByEmail()`, `createAccount()`, `validateToken()`
- **常量**: `UPPER_SNAKE_CASE`
  - 示例: `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT`
- **私有成员**: `private` 关键字 + `camelCase`
  - 示例: `private readonly accountService: AccountService`

#### 目录命名

- **模块目录**: `{module}/`（kebab-case）
  - 示例: `account/`, `kb/`, `wiki-repo/`
- **功能目录**: `{feature}/`（kebab-case）
  - 示例: `controller/`, `service/`, `dto/`, `entity/`, `guards/`

#### API 端点命名

- **REST 端点**: `/api/{module}` 或 `/api/{module}/{resource}`（kebab-case，复数形式）
  - 示例: `/api/account`, `/api/wiki/repo`
- **路由参数**: `:id` 或 `{id}`（小写）
  - 示例: `/api/wiki/repo/:id`

### 错误处理模式

#### 统一错误响应格式

所有 API 错误响应遵循统一格式：

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

**成功响应格式**:

```typescript
interface SuccessResponse<T> {
  code: 0;               // 成功时固定为 0
  success: true;         // 固定为 true
  message: "success";    // 固定为 "success"
  data: T;              // 业务数据
  timestamp: string;     // ISO 8601 时间戳
  path: string;         // 请求路径
}
```

#### 错误码定义规范

错误码按模块划分范围，确保全局唯一性：

- **0-999**: 通用错误（`@meta-1/nest-common`）
  - `500`: Server Error
  - `400`: Validation Failed
  - `401`: Unauthorized
  - `403`: Forbidden
  - `404`: Not Found
- **1000-1999**: Account 模块错误
- **2000-2999**: KB（知识库）模块错误
- **3000-3999**: 其他模块错误（按需分配）

**错误码定义位置**:

- 应用级错误码: `apps/server/src/shared/app.error-code.ts`
- 模块级错误码: `libs/{module}/src/shared/{module}.error-code.ts`

**错误码定义格式**:

```typescript
import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  // 错误码定义，code 需要保证全局唯一
  REPOSITORY_NOT_FOUND: { code: 2000, message: "知识库未找到" },
  WIKI_REPO_PATH_EXISTS: { code: 2001, message: "访问路径已存在" },
  REPOSITORY_ACCESS_DENIED: { code: 2002, message: "无权访问该知识库" },
} as const;
```

#### 错误抛出方式

在 Service 层使用 `AppError` 抛出业务错误：

```typescript
import { AppError } from "@meta-1/nest-common";
import { ErrorCode } from "../shared/kb.error-code";

@Injectable()
export class WikiRepoService {
  async findById(id: string) {
    const repo = await this.repository.findOne({ where: { id } });
    if (!repo) {
      throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
    }
    return repo;
  }
}
```

**错误处理流程**:

1. **Service 层**: 抛出 `AppError` 或使用验证框架抛出验证错误
2. **全局异常过滤器**: `ErrorsFilter` 捕获所有异常
3. **错误转换**: 将异常转换为统一错误响应格式
4. **HTTP 响应**: 返回 HTTP 200 状态码，错误信息在响应体中

#### 验证错误处理

使用 Zod Schema 进行数据验证时，验证失败会自动抛出 `ZodValidationException`：

```typescript
// DTO 定义
export class CreateWikiRepoDto extends createZodDto(CreateWikiRepoSchema) {}

// Controller 中使用
@Post("/create")
create(@Body() dto: CreateWikiRepoDto) {
  // 验证失败会自动抛出 ZodValidationException
  return this.wikiRepoService.create(dto);
}
```

**验证错误响应格式**:

```json
{
  "code": 0,
  "success": false,
  "message": "Validation failed",
  "data": [
    {
      "code": "invalid_type",
      "path": ["email"],
      "message": "邮箱格式不正确"
    }
  ],
  "timestamp": "2025-12-03T02:19:50.000Z",
  "path": "/api/wiki/repo/create"
}
```

#### 日志记录

- **错误日志**: 使用 NestJS Logger 记录所有异常
- **日志级别**: 
  - `error`: 记录所有异常（包括业务错误和系统错误）
  - `warn`: 记录警告信息
  - `log`: 记录一般信息
  - `debug`: 记录调试信息

**日志记录位置**: 全局异常过滤器自动记录所有异常

## 数据架构

### 数据库设计

使用 MySQL 作为关系型数据库，存储元数据和业务数据：

- **Account**: 用户账号信息
- **AccountToken**: 账号令牌（JWT Token 管理）
- **WikiRepo**: 知识库元数据

### 向量数据库

使用 Qdrant 作为向量数据库，存储文档的向量化表示：

- **Collection**: `metawiki-documents`
- **用途**: RAG 检索、语义搜索
- **集成**: 通过 LangChain 和 @meta-1/nest-ai 模块集成

### 缓存架构

使用 Redis 进行缓存和会话存储：

- **会话存储**: JWT Token 缓存
- **数据缓存**: 使用 `@Cacheable` 装饰器自动缓存
- **分布式锁**: 使用 `@WithLock` 装饰器防止并发操作

### 数据流

```
API Request
    ↓
Controller (验证请求)
    ↓
Service (业务逻辑)
    ↓
Repository (数据访问)
    ↓
┌──────────┬──────────┬──────────┐
│  MySQL   │  Redis   │  Qdrant  │
│ (元数据)  │  (缓存)  │  (向量)  │
└──────────┴──────────┴──────────┘
```

## API 设计

### RESTful API

Server 提供 RESTful API 接口，遵循 REST 规范：

- **Base URL**: `http://localhost:3710`
- **API 前缀**: `/api`
- **文档地址**: `http://localhost:3710/docs` (Swagger)

### API 端点

#### 账号管理 (`/api/account`)
- `POST /api/account/login` - 用户登录
- `POST /api/account/register` - 用户注册
- `GET /api/account/profile` - 获取用户资料
- `POST /api/account/logout` - 用户登出
- `GET /api/account/otp/secret` - 获取 OTP 密钥
- `GET /api/account/otp/status` - 获取 OTP 状态
- `POST /api/account/otp/enable` - 启用 OTP
- `POST /api/account/otp/disable` - 禁用 OTP

#### 知识库管理 (`/api/wiki/repo`)
- `GET /api/wiki/repo/list` - 获取知识库列表
- `POST /api/wiki/repo/create` - 创建知识库
- `GET /api/wiki/repo/:path` - 根据路径获取知识库详情
- `PATCH /api/wiki/repo/:id` - 更新知识库（仅创建者可操作）
- `DELETE /api/wiki/repo/:id` - 删除知识库（仅创建者可操作）

#### 配置管理 (`/api/config`)
- `GET /api/config/common` - 获取公共配置（RSA 公钥等）

#### 资源管理 (`/api/assets`)
- `POST /api/assets/upload/pre-sign` - 生成预签名上传 URL

#### 邮件服务 (`/api/mail/code`)
- `POST /api/mail/code/send` - 发送验证码

### 认证机制

大部分 API 需要认证，使用 JWT Token：

```
Authorization: Bearer <token>
```

标记为 `@Public()` 的接口无需认证。

### 统一响应格式

所有 API 遵循统一的响应格式：

```typescript
interface RestResult<T> {
  code: string | number;
  message: string;
  data: T | null;
  timestamp: string;
  path: string;
}
```

### 数据验证

使用 Zod Schema 进行数据验证：

- DTO 定义在各个模块的 `dto/` 目录下
- 使用 `createZodDto` 将 Zod Schema 转换为 NestJS DTO
- 自动进行请求数据验证

## 组件概述

### Controller 层

位于 `apps/server/src/controller/`：

- **AssetsController**: 资源上传管理
- **ConfigController**: 配置管理
- **MailCodeController**: 邮件验证码

### Service 层

业务逻辑服务位于各个模块的 `service/` 目录：

- **AccountService**: 账号管理服务
- **AccountOtpService**: OTP 管理服务
- **WikiRepoService**: 知识库管理服务

#### Service 层设计原则

**事务管理：**

- 所有涉及多步数据库操作的方法必须使用 `@Transactional()` 装饰器
- 保证"查询 → 验证 → 操作"的原子性
- 确保操作失败时能够回滚

**分布式锁：**

- 涉及唯一性检查的创建操作必须使用 `@WithLock()` 装饰器
- 防止并发创建导致重复数据
- 锁和事务通常一起使用

详细的使用规范和最佳实践请参考 [开发指南 - Service 层事务和锁管理](../development-guide.md#service-层事务和锁管理)。

### Entity 层

数据库实体位于各个模块的 `entity/` 目录：

- **Account**: 账号实体
- **AccountToken**: 令牌实体
- **WikiRepo**: 知识库实体

### Guard 层

认证授权守卫位于 `libs/account/src/guards/`：

- **AuthGuard**: 全局认证守卫
- 使用 `@Public()` 装饰器标记公开接口

## 源码树

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

## 开发工作流

### 启动开发服务器

```bash
# 启动后端服务（监听文件变化，自动重启）
pnpm run dev:server
```

服务将在 http://localhost:3710 启动。

### 添加新的 API 端点

1. 在 `apps/server/src/controller/` 创建控制器
2. 在 `apps/server/src/dto/` 创建 DTO
3. 在 `apps/server/src/shared/` 添加错误码（如需要）
4. 更新 Swagger 文档

### 添加新的业务模块

1. 在 `libs/` 创建新的库目录
2. 配置 `tsconfig.lib.json`
3. 在 `AppModule` 中导入新模块
4. 在根 `package.json` 中添加依赖

## 部署架构

### 配置管理

使用 Nacos 配置中心管理配置：

- **配置路径**: `metawiki-server`
- **配置格式**: YAML
- **配置内容**: 数据库、Redis、账号配置、AI 配置等

### 环境变量

仅需在 `.env` 文件中配置：

```env
NODE_ENV=development
PORT=3710
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server
```

### 构建和部署

```bash
# 构建后端服务
pnpm run build:server

# 构建输出: dist/apps/server/
```

### 服务依赖

- **MySQL**: 元数据存储
- **Redis**: 缓存和会话存储
- **Qdrant**: 向量数据库（可选）
- **Nacos**: 配置中心（可选，支持降级模式）

## 测试策略

### 单元测试

使用 Jest 进行单元测试：

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 测试覆盖率
pnpm test:cov
```

### E2E 测试

使用 Jest E2E 配置进行端到端测试：

```bash
# E2E 测试
pnpm test:e2e
```

### 测试配置

- **单元测试**: Jest 配置在 `package.json` 中
- **E2E 测试**: Jest E2E 配置在 `apps/support/test/jest-e2e.json`

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

## 集成点

### 与 Web 部分的集成

- **REST API**: Web 通过 REST API 调用 Server
- **共享类型**: 通过 `@meta-1/wiki-types` 共享类型定义
- **国际化**: 共享 `locales/` 目录

**类型包名说明**:
- ✅ `@meta-1/wiki-types` - Wiki 项目特定类型（正确）
- ✅ `@meta-1/nest-types` - Meta1 Support 公共组件共享类型（正确）
- ❌ `@meta-1/types` - 此包不存在，不要使用

### 与外部服务的集成

- **Nacos**: 配置管理和服务发现
- **Qdrant**: 向量数据库集成
- **Redis**: 缓存和会话存储
- **MySQL**: 关系型数据库

## 相关文档

- [API 合约文档](./api-contracts-server.md) - 详细的 API 端点文档
- [数据模型文档](./data-models-server.md) - 数据库实体定义
- [集成架构文档](./integration-architecture.md) - 前后端集成架构
- [开发指南](./development-guide.md) - 开发和部署指南

---

_文档由 BMAD Method `document-project` 工作流生成_

