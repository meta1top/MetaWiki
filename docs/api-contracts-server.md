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

**响应**: 知识库详情（包含扩展信息）

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

