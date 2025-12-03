# Tech-Spec: AI 模型管理系统

**Created:** 2025-12-03  
**Status:** Completed

## Overview

### Problem Statement

当前项目需要实现一个完整的 AI 模型管理系统，用于管理多个模型提供商的配置、模型信息以及模型参数。系统需要支持：

1. **模型提供商管理**：支持 Deepseek、阿里百炼、火山方舟等多个平台
2. **模型管理**：管理不同类型的模型（LLM、Text Embedding、Rerank、Speech2Text、TTS 等）
3. **参数配置管理**：提供通用参数配置，支持提供商级别的参数覆盖
4. **前端设置界面**：提供用户友好的设置页面，支持模型提供商和用户设置的管理

### Solution

实现一个完整的模型管理系统，包括：

1. **后端实体和服务**：
   - `ModelProvider` 实体：存储模型提供商信息
   - `Model` 实体：存储模型信息
   - `ModelConfig` 实体：存储通用参数配置和提供商级别的覆盖配置
   - 相应的 Service、Controller、DTO 和 Schema

2. **前端设置页面**：
   - 基于 MainLayout 创建 SettingLayout
   - 实现左右分栏布局
   - 提供模型提供商和用户两个菜单
   - 实现模型提供商的 CRUD 操作界面

### Scope (In/Out)

**In Scope:**
- 模型提供商实体的完整实现（CRUD）
- 模型实体的完整实现（CRUD）
- 模型通用参数配置实体和覆盖机制
- 后端 API 接口（RESTful）
- 前端设置页面布局和路由
- 模型提供商管理界面
- 用户设置界面（基础结构）
- 数据库迁移脚本
- 类型定义和 Schema 验证

**Out of Scope:**
- 模型的实际调用逻辑（已有 ModelService）
- 模型参数的实时验证和测试
- 模型使用统计和监控
- 多租户支持（当前为单用户系统）
- 模型版本管理

## Context for Development

### Codebase Patterns

**实体模式参考**：
- `libs/kb/src/entity/wiki-repo.entity.ts` - 使用 TypeORM Entity，SnowflakeId，Column 装饰器
- 软删除模式：使用 `deleted` 字段（boolean，select: false）

**服务模式参考**：
- `libs/kb/src/service/wiki-repo.service.ts` - 使用 @Injectable、@InjectRepository、@Transactional、@WithLock
- 权限检查：基于 creatorId 进行权限验证

**控制器模式参考**：
- `libs/kb/src/controller/wiki-repo.controller.ts` - 使用 NestJS 装饰器，Swagger 文档
- 认证：使用 @CurrentUser() 获取当前用户

**DTO 和 Schema 模式参考**：
- `libs/kb/src/dto/wiki-repo.dto.ts` - 使用 nestjs-zod 和 createZodDto
- `libs/types/src/wiki/wiki-repo.schema.ts` - 使用 zod schema 进行验证

**前端布局模式参考**：
- `apps/web/src/components/layout/main/index.tsx` - MainLayout 组件
- `apps/web/src/app/(main)/layout.tsx` - 路由组布局
- `apps/web/src/components/layout/setting/index.tsx` - SettingLayout 组件
- Header 组件 Settings 按钮已实现跳转功能（跳转到 `/setting/provider`）

**现有 AI 模块**：
- `libs/ai/src/ai.module.ts` - 基础模块结构
- `libs/ai/src/ai.service.ts` - AI 服务（需要扩展以支持新的模型管理）

### Files to Reference

**后端文件**：
- `libs/ai/src/ai.module.ts` - 需要添加新的实体、服务、控制器
- `libs/ai/src/entity/` - 新建实体目录
- `libs/ai/src/service/` - 新建服务目录
- `libs/ai/src/controller/` - 新建控制器目录
- `libs/ai/src/dto/` - 新建 DTO 目录
- `libs/ai/src/shared/` - 新建共享目录（错误码等）

**前端文件**：
- `apps/web/src/app/(setting)/` - 新建设置路由组
- `apps/web/src/app/(setting)/layout.tsx` - SettingLayout
- `apps/web/src/app/(setting)/provider/` - 模型提供商管理页面
- `apps/web/src/app/(setting)/user/` - 用户设置页面
- `apps/web/src/components/layout/setting/` - 新建设置布局组件
- `apps/web/src/components/layout/main/header/index.tsx` - 需要添加 Settings 按钮跳转
- `apps/web/src/rest/ai/` - 新建 AI API 客户端

**类型定义文件**：
- `libs/types/src/ai/` - 新建 AI 类型定义目录
- `libs/types/src/ai/model-provider.schema.ts` - 模型提供商 Schema
- `libs/types/src/ai/model.schema.ts` - 模型 Schema
- `libs/types/src/ai/model-config.schema.ts` - 模型配置 Schema

**文档文件**：
- `docs/data-models-server.md` - 需要更新数据模型文档

### Technical Decisions

1. **实体关系设计**：
   - `ModelProvider` 和 `Model` 是一对多关系（一个提供商有多个模型）
   - `ModelConfig` 与 `ModelProvider` 是多对一关系（一个提供商可以有多个配置记录，但通常只使用最新的）
   - `ModelConfig` 的 `providerId` 可以为空，表示全局配置
   - 全局配置可以有多个记录，但通过 `getGlobalConfig` 方法获取最新的
   - 配置覆盖逻辑：如果提供商配置存在，使用提供商配置；否则使用全局配置

2. **ModelProvider 实体字段**：
   - `id` - SnowflakeId，主键
   - `platform` - varchar(50)，平台类型枚举值（DEEPSEEK、ALIBABA_TONGYI、VOLCANO_ARK）
   - `apiKey` - varchar(1000)，API Key
   - `apiBaseUrl` - varchar(500)，可选，API Base URL
   - `config` - json，可选，通用配置字段（JSON 格式）
   - `description` - text，可选，描述信息
   - `creatorId` - varchar(20)，创建人ID
   - `createTime` - datetime，创建时间
   - `updaterId` - varchar(20)，可选，更新人ID
   - `updateTime` - datetime，可选，更新时间
   - `deleted` - tinyint(1)，软删除标记（select: false）

3. **ModelConfig 实体字段**：
   - `id` - SnowflakeId，主键
   - `providerId` - varchar(20)，可选，模型提供商ID（为空表示全局配置）
   - `temperature` - decimal(3,2)，可选，温度参数
   - `maxTokens` - int，可选，最大 token 数
   - `topP` - decimal(3,2)，可选，核采样参数
   - `frequencyPenalty` - decimal(3,2)，可选，频率惩罚
   - `presencePenalty` - decimal(3,2)，可选，存在惩罚
   - `otherConfig` - json，可选，其他配置（JSON 格式）
   - 标准审计字段：creatorId、createTime、updaterId、updateTime、deleted

4. **模型类型枚举**（Model 实体）：
   - LLM（大语言模型）
   - Text Embedding（文本嵌入）
   - Rerank（重排序）
   - Speech2Text（语音转文本）
   - TTS（文本转语音）

5. **支持的平台**：
   - `DEEPSEEK` - Deepseek
   - `ALIBABA_TONGYI` - 阿里百炼（Alibaba Tongyi）
   - `VOLCANO_ARK` - 火山方舟（Volcano Ark）
   - 平台唯一性：同一用户不能重复添加同一平台（通过 `MODEL_PROVIDER_PLATFORM_EXISTS` 错误码控制）

6. **参数配置字段**：
   - `temperature`（温度）
   - `maxTokens`（最大 token 数）
   - `topP`（核采样）
   - `frequencyPenalty`（频率惩罚）
   - `presencePenalty`（存在惩罚）
   - 其他通用配置字段（JSON 格式存储）

7. **前端布局设计**：
   - 基于 MainLayout 创建 SettingLayout（`apps/web/src/components/layout/setting/index.tsx`）
   - 使用 `MainPage` 组件作为页面容器
   - 使用 `PageHeader`、`TitleBar`、`Breadcrumb` 组件构建页面头部
   - 路由路径：`/setting/provider`（模型提供商管理）
   - 使用 Next.js App Router 的 `(setting)` 路由组

8. **API 设计**：
   - RESTful API，路径前缀：
     - `/api/ai/model-provider` - 模型提供商管理
     - `/api/ai/model` - 模型管理
     - `/api/ai/model-config` - 模型配置管理
   - 使用 JWT 认证（已有 @CurrentUser 装饰器）
   - 权限检查：所有操作需要登录，创建/更新/删除需要验证所有权
   - API 端点：
     - ModelProvider: GET /list、POST /create、GET /:id、PATCH /:id、DELETE /:id
     - 前端使用 `@api/` 前缀进行路径解析

## Implementation Plan

### Tasks

#### 后端任务

- [x] Task 1: 创建实体定义
- [x] Task 1.1: 创建 `ModelProvider` 实体
  - 字段：id、platform（平台类型，枚举值：DEEPSEEK、ALIBABA_TONGYI、VOLCANO_ARK）、apiKey、apiBaseUrl（可选）、config（通用配置字段，JSON）、description（可选）、creatorId、createTime、updaterId、updateTime、deleted
  - 位置：`libs/ai/src/entity/model-provider.entity.ts`
  - 注意：移除了 name、logo、apiKeyUrl 字段，使用 platform 枚举值标识平台

- [x] Task 1.2: 创建 `Model` 实体
  - 字段：id、providerId（外键）、name、type（枚举）、contextLength、creatorId、createTime、updaterId、updateTime、deleted
  - 位置：`libs/ai/src/entity/model.entity.ts`

- [x] Task 1.3: 创建 `ModelConfig` 实体
  - 字段：id、providerId（外键，可为空，为空表示全局配置）、temperature、maxTokens、topP、frequencyPenalty、presencePenalty、其他配置（JSON）、creatorId、createTime、updaterId、updateTime、deleted
  - 位置：`libs/ai/src/entity/model-config.entity.ts`

#### Task 2: 创建类型定义和 Schema
- [x] Task 2.1: 创建模型类型枚举
  - 位置：`libs/types/src/ai/model.types.ts`
  - 枚举：ModelType（LLM、TEXT_EMBEDDING、RERANK、SPEECH2TEXT、TTS）

- [x] Task 2.2: 创建 ModelProvider Schema
  - 位置：`libs/types/src/ai/model-provider.schema.ts`
  - 包含：CreateModelProviderSchema、UpdateModelProviderSchema、ModelProviderSchema

- [x] Task 2.3: 创建 Model Schema
  - 位置：`libs/types/src/ai/model.schema.ts`
  - 包含：CreateModelSchema、UpdateModelSchema、ModelSchema

- [x] Task 2.4: 创建 ModelConfig Schema
  - 位置：`libs/types/src/ai/model-config.schema.ts`
  - 包含：CreateModelConfigSchema、UpdateModelConfigSchema、ModelConfigSchema

#### Task 3: 创建 DTO
- [x] Task 3.1: 创建 ModelProvider DTO
  - 位置：`libs/ai/src/dto/model-provider.dto.ts`
  - 使用 createZodDto 包装 Schema

- [x] Task 3.2: 创建 Model DTO
  - 位置：`libs/ai/src/dto/model.dto.ts`

- [x] Task 3.3: 创建 ModelConfig DTO
  - 位置：`libs/ai/src/dto/model-config.dto.ts`

#### Task 4: 创建错误码定义
- [x] Task 4.1: 创建 AI 模块错误码
  - 位置：`libs/ai/src/shared/ai.error-code.ts`
  - 包含：
    - MODEL_PROVIDER_NOT_FOUND（2000）- 模型提供商未找到
    - MODEL_PROVIDER_ACCESS_DENIED（2001）- 无权访问该模型提供商
    - MODEL_PROVIDER_PLATFORM_EXISTS（2002）- 该平台已存在，不能重复添加
    - MODEL_NOT_FOUND（2003）- 模型未找到
    - MODEL_ACCESS_DENIED（2004）- 无权访问该模型
    - MODEL_CONFIG_NOT_FOUND（2005）- 模型配置未找到
    - MODEL_CONFIG_ACCESS_DENIED（2006）- 无权访问该模型配置

#### Task 5: 创建服务层
- [x] Task 5.1: 创建 ModelProviderService
  - 位置：`libs/ai/src/service/model-provider.service.ts`
  - 方法：create、list、getById、update、delete
  - 权限检查：只有创建者可以更新/删除
  - 业务逻辑：
    - create：检查同一用户是否已存在相同平台的提供商，如果存在则抛出 `MODEL_PROVIDER_PLATFORM_EXISTS` 错误
    - list：按更新时间倒序返回当前用户的提供商列表
    - 所有方法都使用软删除机制（deleted 字段）

- [x] Task 5.2: 创建 ModelService（扩展现有）
  - 位置：`libs/ai/src/service/model.service.ts`（新建，不同于现有的 ai.service.ts）
  - 方法：create、list（按 providerId 筛选）、getById、update、delete

- [x] Task 5.3: 创建 ModelConfigService
  - 位置：`libs/ai/src/service/model-config.service.ts`
  - 方法：create、getGlobalConfig、getProviderConfig、update、delete
  - 特殊逻辑：getEffectiveConfig（获取有效配置，如果提供商配置为空则使用全局配置）

#### Task 6: 创建控制器层
- [x] Task 6.1: 创建 ModelProviderController
  - 位置：`libs/ai/src/controller/model-provider.controller.ts`
  - 路径：`/api/ai/model-provider`
  - 端点：GET /list、POST /create、GET /:id、PATCH /:id、DELETE /:id

- [x] Task 6.2: 创建 ModelController
  - 位置：`libs/ai/src/controller/model.controller.ts`
  - 路径：`/api/ai/model`
  - 端点：GET /list（支持 providerId 查询参数）、POST /create、GET /:id、PATCH /:id、DELETE /:id

- [x] Task 6.3: 创建 ModelConfigController
  - 位置：`libs/ai/src/controller/model-config.controller.ts`
  - 路径：`/api/ai/model-config`
  - 端点：
    - GET /global - 获取全局配置
    - GET /provider/:providerId - 获取提供商配置
    - POST /create - 创建配置
    - PATCH /:id - 更新配置
    - DELETE /:id - 删除配置
    - 注意：`getEffectiveConfig` 方法在 Service 中实现，但未在 Controller 中暴露（如需要可添加 GET /effective/:providerId? 端点）

#### Task 7: 更新 AI 模块
- [x] Task 7.1: 在 AiModule 中注册新实体
  - 导入 TypeOrmModule.forFeature([ModelProvider, Model, ModelConfig])

- [x] Task 7.2: 在 AiModule 中注册服务和控制器
  - 添加 providers 和 controllers

#### 前端任务

#### Task 8: 创建设置布局
- [x] Task 8.1: 创建 SettingLayout 组件
  - 位置：`apps/web/src/components/layout/setting/index.tsx`
  - 基于 MainLayout，实现左右分栏布局
  - 左侧：菜单导航
  - 右侧：内容区域

- [x] Task 8.2: 创建设置路由组布局
  - 位置：`apps/web/src/app/(setting)/layout.tsx`
  - 使用 SettingLayout

#### Task 9: 创建设置页面路由
- [x] Task 9.1: 创建模型提供商管理页面
  - 位置：`apps/web/src/app/(setting)/setting/provider/page.tsx`
  - 实现列表、创建功能
  - 使用 `MainPage` 组件和 `SettingLayout` 布局
  - 使用 `useQuery` 和 `useMutation` hooks 进行数据管理
  - 使用 Dialog 组件创建提供商
  - 前端实现平台去重：创建时过滤已存在的平台选项

- [x] Task 9.2: 创建用户设置页面
  - 位置：`apps/web/src/app/(setting)/user/page.tsx`
  - 基础结构（后续扩展）

#### Task 10: 创建 API 客户端
- [x] Task 10.1: 创建 AI REST 客户端
  - 位置：`apps/web/src/rest/ai/model-provider.ts`
  - 实现 ModelProvider 的 API 调用
  - 方法：listModelProvider、createModelProvider、getModelProviderById、updateModelProvider、deleteModelProvider
  - 使用 `@api/` 前缀进行 API 路径解析

- [x] Task 10.2: 创建 Model REST 客户端
  - 位置：`apps/web/src/rest/ai/model.ts`

- [x] Task 10.3: 创建 ModelConfig REST 客户端
  - 位置：`apps/web/src/rest/ai/model-config.ts`

#### Task 11: 更新 Header 组件
- [x] Task 11.1: 为 Settings 按钮添加跳转功能
  - 位置：`apps/web/src/components/layout/main/header/index.tsx`
  - 已实现：使用 `router.push("/setting/provider")` 跳转到模型提供商管理页面
  - 使用 `Action` 组件包装 Settings 图标按钮

#### Task 12: 创建 UI 组件
- [x] Task 12.1: 创建模型提供商页面主组件
  - 位置：`apps/web/src/app/(setting)/setting/provider/components/index.tsx`
  - 包含列表展示、创建按钮、Dialog 管理

- [x] Task 12.2: 创建模型提供商表单组件
  - 位置：`apps/web/src/app/(setting)/setting/provider/components/form/index.tsx`
  - 使用 `Form` 组件和 `CreateModelProviderSchema` 进行表单验证
  - 字段：platform（Select）、apiKey（Input password）、apiBaseUrl（Input）、description（Textarea）
  - 支持平台选项过滤（只显示未添加的平台）

- [x] Task 12.3: 创建模型提供商 Dialog 组件
  - 位置：`apps/web/src/app/(setting)/setting/provider/components/dialog/index.tsx`
  - 管理创建提供商的 Dialog 状态
  - 实现平台去重逻辑（前端过滤已存在的平台）

- [x] Task 12.4: 创建模型提供商 Item 组件
  - 位置：`apps/web/src/app/(setting)/setting/provider/components/item/index.tsx`
  - 展示单个提供商信息（当前为基础实现）

#### 数据库和文档任务

#### Task 13: 数据库迁移
- [x] Task 13.1: 创建数据库迁移脚本（如需要）
  - 如果使用 TypeORM Migrations，创建迁移文件
  - 如果使用 synchronize: true，TypeORM 会自动同步

#### Task 14: 更新文档
- [ ] Task 14.1: 更新数据模型文档
  - 位置：`docs/data-models-server.md`
  - 添加 ModelProvider、Model、ModelConfig 实体说明

### Acceptance Criteria

- [ ] AC 1: 可以创建、查看、更新、删除模型提供商
  - Given: 用户已登录
  - When: 用户操作模型提供商
  - Then: 操作成功，数据正确保存到数据库

- [ ] AC 2: 可以创建、查看、更新、删除模型
  - Given: 用户已登录，存在模型提供商
  - When: 用户操作模型
  - Then: 操作成功，模型正确关联到提供商

- [ ] AC 3: 可以配置全局模型参数
  - Given: 用户已登录
  - When: 用户配置全局模型参数
  - Then: 配置保存成功，可以作为默认值使用

- [ ] AC 4: 可以配置提供商级别的模型参数覆盖
  - Given: 用户已登录，存在模型提供商
  - When: 用户配置提供商级别的参数
  - Then: 配置保存成功，该提供商的模型使用覆盖配置

- [ ] AC 5: 参数配置覆盖机制正确工作
  - Given: 存在全局配置和提供商配置
  - When: 获取有效配置
  - Then: 如果提供商配置存在，使用提供商配置；否则使用全局配置

- [ ] AC 6: 前端设置页面可以正常访问
  - Given: 用户已登录
  - When: 用户点击 Header 中的 Settings 按钮
  - Then: 跳转到设置页面，显示左右分栏布局

- [ ] AC 7: 可以在前端管理模型提供商
  - Given: 用户在设置页面
  - When: 用户操作模型提供商（CRUD）
  - Then: 操作成功，界面正确更新

- [ ] AC 8: 权限检查正确工作
  - Given: 用户 A 创建了模型提供商
  - When: 用户 B 尝试更新/删除该提供商
  - Then: 返回权限错误

## Implementation Notes

### 实际实现调整

1. **ModelProvider 实体字段调整**：
   - 移除了 `name`、`logo`、`apiKeyUrl` 字段
   - 使用 `platform` 枚举值（DEEPSEEK、ALIBABA_TONGYI、VOLCANO_ARK）标识平台
   - `config` 字段为 JSON 类型，用于存储通用配置

2. **平台唯一性约束**：
   - 同一用户不能重复添加同一平台
   - 通过 `ModelProviderService.create` 方法检查
   - 错误码：`MODEL_PROVIDER_PLATFORM_EXISTS`（2002）

3. **前端实现特点**：
   - 路由路径：`/setting/provider`
   - 使用 `MainPage` + `SettingLayout` 布局
   - 创建提供商使用 Dialog 组件
   - 前端实现平台去重：创建时只显示未添加的平台选项
   - 使用 `useQuery` 和 `useMutation` hooks 管理数据
   - API 客户端使用 `@api/` 前缀进行路径解析

4. **组件结构**：
   - `page.tsx` - 页面主组件，管理列表和 Dialog 状态
   - `components/form/index.tsx` - 表单组件，使用 `CreateModelProviderSchema` 验证
   - `components/dialog/index.tsx` - Dialog 组件，管理创建流程
   - `components/item/index.tsx` - 列表项组件（当前为基础实现）

5. **Header 集成**：
   - Settings 按钮已实现跳转功能
   - 使用 `router.push("/setting/provider")` 导航
   - 位置：`apps/web/src/components/layout/main/header/index.tsx` 第67行

## Additional Context

### Dependencies

- TypeORM 0.3.27 - 用于实体定义和数据库操作
- NestJS 11 - 用于服务层和控制器层
- Next.js 16 - 用于前端路由和页面
- React 19 - 用于前端组件
- Zod - 用于 Schema 验证
- nestjs-zod - 用于 DTO 创建

### Testing Strategy

1. **单元测试**：
   - 测试服务层方法的逻辑正确性
   - 测试参数配置覆盖机制
   - 测试权限检查

2. **集成测试**：
   - 测试 API 端点的完整流程
   - 测试数据库操作的完整性
   - 测试前后端数据交互

3. **手动测试**：
   - 在开发环境中创建模型提供商和模型
   - 验证参数配置覆盖机制
   - 测试前端设置页面的用户体验

### Notes

1. **API Key 安全**：
   - API Key 应该加密存储（考虑使用加密字段）
   - 前端不应该显示完整的 API Key（可以考虑只显示部分字符）

2. **配置覆盖逻辑**：
   - 全局配置和提供商配置都应该支持部分字段为空
   - 获取有效配置时，需要递归合并：全局配置 -> 提供商配置 -> 模型特定配置（未来扩展性考虑）

3. **性能考虑**：
   - 如果模型提供商和模型数量很大，需要考虑分页
   - 配置查询可以考虑缓存

4. **扩展性**：
   - 未来可能需要支持模型版本管理
   - 未来可能需要支持模型使用统计
   - 未来可能需要支持多租户

5. **国际化**：
   - 所有用户界面文本需要支持国际化
   - 错误消息也需要国际化

