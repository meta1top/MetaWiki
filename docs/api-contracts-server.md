# API 合约文档 - Server

## 概述

MetaWiki Server 提供 RESTful API 接口，用于知识库管理、用户认证、资源上传等功能。

**Base URL**: `http://localhost:3710`  
**API 前缀**: `/api`  
**文档地址**: `http://localhost:3710/docs` (Swagger)

## 认证

大部分 API 需要认证，使用 JWT Token。Token 通过 `Authorization` header 传递：

```
Authorization: Bearer <token>
```

标记为 `@Public()` 的接口无需认证。

---

## API 模块索引

当接口数量较多时，建议按模块拆分文档。当前文档包含所有接口，但随着项目增长，可以拆分为：

- [账号管理 API](./api/account.md) - 用户认证、注册、登出
- [OTP 管理 API](./api/account-otp.md) - 双因素认证
- [知识库管理 API](./api/wiki-repo.md) - 知识库 CRUD 操作
- [配置管理 API](./api/config.md) - 公共配置
- [资源管理 API](./api/assets.md) - 文件上传
- [邮件服务 API](./api/mail.md) - 邮件验证码

**注意**: 当前所有接口都在本文档中，当接口超过 30 个时，建议按上述结构拆分。

---

## API 端点

### 1. 账号管理 (AccountController)

**Base Path**: `/api/account`

#### 1.1 用户登录

```http
POST /api/account/login
```

**认证**: 不需要 (`@Public()`)

**请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应**: 返回用户信息和 Token

---

#### 1.2 用户注册

```http
POST /api/account/register
```

**认证**: 不需要 (`@Public()`)

**请求体**:
```json
{
  "email": "string",
  "username": "string",
  "password": "string"
}
```

**响应**: 注册成功信息

---

#### 1.3 获取用户资料

```http
GET /api/account/profile
```

**认证**: 需要

**响应**: 用户资料信息

---

#### 1.4 用户登出

```http
POST /api/account/logout
```

**认证**: 需要

**响应**: 登出成功

---

### 1.5 OTP 管理 (AccountOTPController)

**Base Path**: `/api/account/otp`

#### 1.5.1 获取 OTP 状态

```http
GET /api/account/otp/status
```

**认证**: 需要

**响应**: 
```json
{
  "status": 0 | 1
}
```

`0` 表示未启用，`1` 表示已启用

---

#### 1.5.2 获取 OTP 密钥

```http
GET /api/account/otp/secret
```

**认证**: 需要

**响应**: 
```json
{
  "secret": "string",
  "qrCode": "string"
}
```
```

返回 OTP 密钥和二维码数据（用于绑定 OTP 应用）

---

#### 1.5.3 启用 OTP

```http
POST /api/account/otp/enable
```

**认证**: 需要

**请求体**:
```json
{
  "code": "string"
}
```

**响应**: 启用成功

**说明**: 需要先调用 `/api/account/otp/secret` 获取密钥，然后在 OTP 应用中生成验证码，使用验证码启用 OTP

---

#### 1.5.4 禁用 OTP

```http
POST /api/account/otp/disable
```

**认证**: 需要

**请求体**:
```json
{
  "code": "string"
}
```

**响应**: 禁用成功

**说明**: 需要提供 OTP 验证码才能禁用

---

### 2. 知识库管理 (WikiRepoController)

**Base Path**: `/api/wiki/repo`

#### 2.1 获取知识库列表

```http
GET /api/wiki/repo/list
```

**认证**: 需要

**响应**: 
```json
[
  {
    "id": "string",
    "name": "string",
    "path": "string",
    "description": "string | null",
    "creatorId": "string",
    "createTime": "datetime",
    "updaterId": "string | null",
    "updateTime": "datetime | null",
    "cover": "string | null"
  }
]
```

---

#### 2.2 创建知识库

```http
POST /api/wiki/repo/create
```

**认证**: 需要

**请求体**:
```json
{
  "name": "string",
  "path": "string",
  "description": "string | null",
  "cover": "string | null"
}
```

**响应**: 创建成功

---

#### 2.3 根据路径获取知识库详情

```http
GET /api/wiki/repo/:path
```

**认证**: 需要

**路径参数**:
- `path`: 知识库访问路径

**响应**: 知识库详情信息

---

#### 2.4 更新知识库

```http
PATCH /api/wiki/repo/:id
```

**认证**: 需要

**路径参数**:
- `id`: 知识库ID

**请求体**:
```json
{
  "name": "string (可选)",
  "description": "string | null (可选)",
  "cover": "string | null (可选)"
}
```

**注意**: `path` 字段不允许修改

**响应**: 更新成功

---

#### 2.5 删除知识库

```http
DELETE /api/wiki/repo/:id
```

**认证**: 需要

**路径参数**:
- `id`: 知识库ID

**响应**: 删除成功

**注意**: 只有创建者可以删除知识库

---

### 3. 配置管理 (ConfigController)

**Base Path**: `/api/config`

#### 3.1 获取公共配置

```http
GET /api/config/common
```

**认证**: 不需要 (`@Public()`)

**响应**:
```json
{
  "publicKey": "string"
}
```

---

### 4. 资源管理 (AssetsController)

**Base Path**: `/api/assets`

#### 4.1 生成预签名上传 URL

```http
POST /api/assets/upload/pre-sign
```

**认证**: 不需要 (`@Public()`)

**请求体**:
```json
{
  "fileName": "string",
  "fileType": "string",
  "fileSize": "number"
}
```

**响应**:
```json
{
  "url": "string",
  "method": "PUT",
  "headers": {}
}
```

---

### 5. 邮件服务 (MailCodeController)

**Base Path**: `/api/mail/code`

#### 5.1 发送验证码

```http
POST /api/mail/code/send
```

**认证**: 不需要 (`@Public()`)

**请求体**:
```json
{
  "email": "string",
  "type": "string"
}
```

**响应**: 发送成功

---

## 错误处理

所有 API 遵循统一的错误响应格式：

```json
{
  "code": "string",
  "message": "string",
  "data": null
}
```

错误码定义在 `app.error-code.ts` 和各个模块的 `error-code.ts` 文件中。

---

## 数据验证

API 使用 Zod Schema 进行数据验证，DTO 定义在各个模块的 `dto/` 目录下。

---

## Swagger 文档

完整的 API 文档可通过 Swagger UI 访问：`http://localhost:3710/docs`

---

## 文档维护建议

### 当接口数量增长时

**建议拆分时机**:
- 单个文档超过 500 行
- 接口数量超过 30 个
- 模块数量超过 5 个

**拆分方式**:
1. 创建 `docs/api/` 目录
2. 按模块拆分文档（如 `account.md`, `wiki-repo.md`）
3. 在主文档中保留索引和概述
4. 使用相对路径链接到子文档

**示例结构**:
```
docs/
├── api-contracts-server.md  # 主索引文档
└── api/
    ├── account.md           # 账号管理 API
    ├── account-otp.md       # OTP 管理 API
    ├── wiki-repo.md         # 知识库管理 API
    ├── config.md            # 配置管理 API
    ├── assets.md            # 资源管理 API
    └── mail.md              # 邮件服务 API
```

### 自动生成文档

考虑使用工具自动生成 API 文档：
- **Swagger/OpenAPI**: 从代码注释自动生成（已集成）
- **脚本生成**: 扫描 Controller 文件生成文档
- **CI/CD 集成**: 在构建时自动更新文档

### 版本管理

当 API 版本化时：
- 使用 URL 版本控制：`/api/v1/`, `/api/v2/`
- 在文档中明确标注版本
- 维护版本变更日志
