# 开发指南

## 先决条件

### 系统要求

- **Node.js**: >= 18
- **包管理器**: pnpm >= 8
- **数据库**: MySQL >= 8.0（用于元数据存储）
- **缓存**: Redis >= 6.0（用于缓存和会话存储）
- **向量数据库**: Qdrant >= 1.0（可选，支持其他向量数据库）
- **配置中心**: Nacos >= 2.0（可选，用于配置管理）

### 开发工具

- **TypeScript**: 5.9.3
- **代码格式化**: Biome 2.3.5
- **测试框架**: Jest 30.2.0

## 安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd wiki
```

### 2. 安装依赖

```bash
# 在项目根目录安装所有依赖（包括 workspace 依赖）
pnpm install
```

## 环境配置

### Server 部分 (apps/server/)

#### 环境变量文件

创建 `apps/server/.env` 文件：

```env
# 应用配置
NODE_ENV=development
PORT=3710

# Nacos 配置（如果使用）
NACOS_SERVER=localhost:8848
APP_NAME=metawiki-server
```

#### Nacos 配置（可选但推荐）

在 Nacos 配置中心创建配置，Data ID 为 `metawiki-server`，配置格式为 YAML：

```yaml
# 数据库配置
database:
  host: localhost
  port: 3306
  username: root
  password: your-password
  database: metawiki
  synchronize: false  # 生产环境设为 false
  logging: false

# Redis 配置
redis:
  host: localhost
  port: 6379
  password: ""
  db: 0

# 账号配置
account:
  rsa:
    privateKey: |
      -----BEGIN RSA PRIVATE KEY-----
      your-private-key
      -----END RSA PRIVATE KEY-----
    publicKey: |
      -----BEGIN PUBLIC KEY-----
      your-public-key
      -----END PUBLIC KEY-----
  jwt:
    secret: your-jwt-secret
    expiresIn: 7d
  otp:
    issuer: MetaWiki

# AI 配置（RAG 相关）
ai:
  model:
    name: gpt-4
    apiKey: your-openai-api-key
    apiBaseUrl: https://api.openai.com/v1
    temperature: 0.7
    maxTokens: 2000
  vectorStore:
    name: qdrant
    collectionName: metawiki-documents
    options:
      url: http://localhost:6333
      apiKey: ""
  embeddings:
    name: text-embedding-ada-002
    apiKey: your-openai-api-key
    apiBaseUrl: https://api.openai.com/v1
  textSplitter:
    chunkSize: 1000
    chunkOverlap: 100
```

### Web 部分 (apps/web/)

#### 环境变量文件

创建 `apps/web/.env.local` 文件：

```env
# API 基础地址
NEXT_PUBLIC_API_URL=http://localhost:3710

# 公钥配置（用于 RSA 加密）
NEXT_PUBLIC_RSA_PUBLIC_KEY=your-public-key
```

## 本地开发

### 启动开发服务器

#### 后端服务（开发模式）

```bash
# 启动后端服务（监听文件变化，自动重启）
pnpm run dev:server
```

服务将在 http://localhost:3710 启动。

#### 前端应用（开发模式）

```bash
# 启动前端应用（端口 3110）
pnpm run dev:web
```

访问 http://localhost:3110 查看应用。

### 访问服务

- **前端应用**: http://localhost:3110
- **后端 API**: http://localhost:3710
- **API 文档 (Swagger)**: http://localhost:3710/docs
- **Qdrant 控制台**: http://localhost:6333（如果使用 Qdrant）

## 构建过程

### 构建后端

```bash
# 构建后端服务
pnpm run build:server

# 构建完成后会同步国际化文件
# 构建输出: dist/apps/server/
```

### 构建前端

```bash
# 构建前端应用
pnpm run build:web

# 构建输出: apps/web/.next/
```

### 构建所有

```bash
# 构建后端和前端
pnpm run build:server
pnpm run build:web
```

## 运行生产版本

### 启动后端服务

```bash
# 启动生产模式后端服务
pnpm run start:server
```

### 启动前端服务

```bash
# 进入前端目录
cd apps/web

# 启动生产服务器
pnpm start
```

## 测试

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式（自动运行测试）
pnpm test:watch

# 测试覆盖率
pnpm test:cov

# 调试模式
pnpm test:debug

# E2E 测试
pnpm test:e2e
```

### 测试配置

- **单元测试**: Jest 配置在 `package.json` 中
- **E2E 测试**: Jest E2E 配置在 `apps/support/test/jest-e2e.json`

## 代码规范

### 代码检查

```bash
# 使用 Biome 检查代码
pnpm run lint
```

### 代码格式化

```bash
# 格式化代码
pnpm run format
```

### 代码规范工具

- **Biome**: 用于代码格式化和检查
- **TypeScript**: 类型检查
- **配置文件**: `biome.json`

## 常见开发任务

### 同步国际化文件

```bash
# 同步 locales 目录中的国际化文件
pnpm run sync:locales
```

### 添加新的 API 端点

1. 在 `apps/server/src/controller/` 创建控制器
2. 在 `apps/server/src/dto/` 创建 DTO
3. 在 `apps/server/src/shared/` 添加错误码（如需要）
4. 更新 Swagger 文档

### 添加新的前端页面

1. 在 `apps/web/src/app/` 创建页面文件
2. 在 `apps/web/src/components/` 创建组件
3. 在 `apps/web/src/rest/` 添加 API 请求函数
4. 在 `apps/web/src/state/` 添加状态管理（如需要）

### 添加新的共享库

1. 在 `libs/` 创建新的库目录
2. 配置 `tsconfig.lib.json`
3. 在根 `package.json` 中添加依赖
4. 在需要使用的应用中导入

## 故障排查

### 后端问题

#### Qdrant 连接失败

检查 Qdrant 服务是否启动：
```bash
curl http://localhost:6333/health
```

确保配置中的 Qdrant URL 正确。

#### Redis 连接失败

检查 Redis 服务是否启动：
```bash
redis-cli ping
```

确保 `.env` 中的 Redis 配置正确。

#### Nacos 连接失败

确保 Nacos 服务运行在配置的地址，可以通过浏览器访问：
http://localhost:8848/nacos

#### 数据库连接失败

检查 MySQL 服务是否启动，确保数据库已创建：
```bash
mysql -u root -p
CREATE DATABASE metawiki;
```

### 前端问题

#### API 请求失败

检查 `NEXT_PUBLIC_API_URL` 环境变量是否正确配置。

#### 构建失败

清除缓存并重新构建：
```bash
cd apps/web
rm -rf .next
pnpm run build
```

### 依赖问题

#### pnpm 安装失败

清除缓存并重新安装：
```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

## 开发最佳实践

### 代码组织

- **模块化**: 按功能模块组织代码
- **类型安全**: 充分利用 TypeScript 类型系统
- **代码复用**: 使用共享库避免重复代码

### Git 工作流

- 使用有意义的提交信息
- 定期提交代码
- 使用分支进行功能开发

### 性能优化

- 使用 TanStack Query 缓存 API 请求
- 使用 Jotai 管理轻量级状态
- 避免不必要的重新渲染

### 安全实践

- 不要在代码中硬编码密钥
- 使用环境变量管理敏感信息
- 定期更新依赖包

## 下一步

- 查看 [项目概览](./project-overview.md) 了解项目整体结构
- 查看 [架构文档](./architecture-server.md) 了解系统架构
- 查看 [API 文档](./api-contracts-server.md) 了解 API 接口
- 查看 [状态管理](./state-management-web.md) 了解前端状态管理

