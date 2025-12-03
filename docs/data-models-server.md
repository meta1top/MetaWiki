# 数据模型文档 - Server

## 概述

MetaWiki Server 使用 TypeORM 作为 ORM 框架，MySQL 作为关系型数据库。所有实体类使用 Snowflake ID 作为主键。

**数据库**: MySQL >= 8.0  
**ORM**: TypeORM 0.3.27  
**命名策略**: SnakeNamingStrategy (下划线命名)

---

## 实体模型

### 1. Account (账号)

**表名**: `account`  
**实体类**: `libs/account/src/entity/account.entity.ts`

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | varchar(20) | 账号ID (Snowflake) | PRIMARY KEY |
| `email` | varchar(255) | 邮箱 | UNIQUE, NOT NULL |
| `username` | varchar(32) | 用户名 | NOT NULL |
| `password` | varchar(255) | 密码 (加密) | NOT NULL, select: false |
| `avatar` | varchar(255) | 头像URL | NULLABLE |
| `create_time` | datetime | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| `last_time` | datetime | 最后活动时间 | NULLABLE |
| `deleted` | boolean | 是否已删除 | DEFAULT false, select: false |
| `enable` | boolean | 是否启用 | DEFAULT true |
| `otp_secret` | varchar(255) | OTP密钥 | NULLABLE, select: false |
| `otp_status` | int | OTP绑定状态 (0=未绑定, 1=已绑定) | DEFAULT 0 |
| `otp_enable_time` | datetime | OTP生效时间 | NULLABLE |

**关系**: 
- 一对多: AccountToken (通过 accountId)

---

### 2. AccountToken (账号令牌)

**表名**: `account_token`  
**实体类**: `libs/account/src/entity/account-token.entity.ts`

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | varchar(20) | 令牌ID (Snowflake) | PRIMARY KEY |
| `account_id` | varchar(20) | 账号ID | NOT NULL |
| `app_id` | varchar(20) | 应用ID | NOT NULL |
| `refresh_token` | varchar(255) | 刷新令牌 | NULLABLE |
| `access_token` | varchar(255) | 访问令牌 | NULLABLE |
| `create_time` | datetime | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| `update_time` | datetime | 更新时间 | DEFAULT CURRENT_TIMESTAMP |

**关系**:
- 多对一: Account (通过 accountId)

---

### 3. WikiRepo (知识库)

**表名**: `wiki_repo`  
**实体类**: `libs/kb/src/entity/wiki-repo.entity.ts`

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| `id` | varchar(20) | 知识库ID (Snowflake) | PRIMARY KEY |
| `name` | varchar(255) | 名称 | NOT NULL |
| `path` | varchar(500) | 访问路径 | NOT NULL |
| `description` | text | 描述 | NULLABLE |
| `creator_id` | varchar(20) | 创建人ID | NOT NULL |
| `create_time` | datetime | 创建时间 | DEFAULT CURRENT_TIMESTAMP |
| `updater_id` | varchar(20) | 更新人ID | NULLABLE |
| `update_time` | datetime | 更新时间 | NULLABLE, ON UPDATE CURRENT_TIMESTAMP |
| `cover` | varchar(500) | 封面URL | NULLABLE |
| `deleted` | tinyint(1) | 是否已删除 | DEFAULT false, select: false |

**关系**:
- 多对一: Account (通过 creatorId, updaterId)

---

## 数据库配置

数据库配置通过 Nacos 配置中心管理，配置路径：`metawiki-server`

**配置示例**:
```yaml
database:
  host: localhost
  port: 3306
  username: root
  password: your-password
  database: metawiki
  synchronize: false  # 生产环境设为 false
  logging: false
```

---

## 迁移策略

- **开发环境**: 可使用 `synchronize: true` 自动同步（不推荐）
- **生产环境**: 使用 TypeORM Migrations 进行数据库迁移
- **命名策略**: 使用 SnakeNamingStrategy，实体字段自动转换为下划线命名

---

## 索引策略

- **主键**: 所有表使用 Snowflake ID 作为主键
- **唯一索引**: email 字段有唯一索引
- **外键**: 通过应用层维护关系，不使用数据库外键约束

---

## 软删除

Account 和 WikiRepo 实体支持软删除（`deleted` 字段），删除的记录不会物理删除，但查询时会被过滤（`select: false`）。删除操作会将 `deleted` 字段设置为 `true`，所有查询方法都会自动过滤已删除的记录。

---

## 时间戳

所有实体包含时间戳字段：
- `create_time`: 创建时间，自动设置
- `update_time`: 更新时间，支持自动更新（ON UPDATE CURRENT_TIMESTAMP）

