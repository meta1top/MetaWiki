# 技术规格：知识库创建表单增强

## 概述

本文档描述了对知识库创建表单的增强需求，包括移除 path 字段、调整封面尺寸以及添加模型设置功能。

**创建时间**: 2025-12-03  
**状态**: 待实施  
**优先级**: 高

---

## 背景

当前知识库创建表单使用 `path` 字段作为访问路径，需要改为使用 `id`。同时需要优化封面尺寸，并添加模型设置功能以支持 Embedding 和重排模型的选择。

---

## 需求分析

### 1. 移除 path 字段，使用 id 作为访问路径

**当前状态**:
- 创建知识库时需要用户输入 `path` 字段
- 路由使用 `[path]` 动态段
- API 使用 `path` 查询知识库

**目标状态**:
- 创建知识库时不再需要 `path` 字段
- 路由改为使用 `[id]` 动态段
- API 使用 `id` 查询知识库
- 保持向后兼容性（考虑迁移策略）

### 2. 封面尺寸调整为 100x100

**当前状态**:
- 封面使用 1:1 比例裁剪
- 建议尺寸为 1:1（无具体像素要求）

**目标状态**:
- 封面固定尺寸为 100x100 像素
- 裁剪器使用固定尺寸而非比例

### 3. 添加模型设置表单分组

**需求**:
- 新增表单分组"模型设置"
- 提供 Embedding 模型选择器
- 提供重排模型选择器
- 选择器显示供应商图标
- 支持按模型类型筛选

---

## 技术设计

### 数据模型变更

#### Schema 变更

**文件**: `wiki/libs/types/src/wiki/wiki-repo.schema.ts`

```typescript
// 移除 path 字段
export const CreateWikiRepoSchema = z.object({
  name: z.string().min(1, "请输入知识库名称").max(255, "知识库名称不能超过255个字符").describe("知识库名称"),
  // path 字段移除
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  cover: z.string().max(500, "封面URL不能超过500个字符").nullable().optional().describe("封面"),
  // 新增模型设置字段
  embeddingModelId: z.string().min(1, "请选择 Embedding 模型").optional().describe("Embedding 模型ID"),
  rerankModelId: z.string().min(1, "请选择重排模型").optional().describe("重排模型ID"),
});
```

**注意**: `WikiRepoSchema` 中仍保留 `path` 字段用于向后兼容，但创建时不再需要。

#### Entity 变更

**文件**: `wiki/libs/kb/src/entity/wiki-repo.entity.ts`

```typescript
// 添加新字段
@Column({
  type: "varchar",
  length: 20,
  nullable: true,
  comment: "Embedding 模型ID",
})
embeddingModelId: string | null;

@Column({
  type: "varchar",
  length: 20,
  nullable: true,
  comment: "重排模型ID",
})
rerankModelId: string | null;
```

### API 变更

#### Controller 变更

**文件**: `wiki/libs/kb/src/controller/wiki-repo.controller.ts`

```typescript
// 修改路由从 /:path 改为 /:id
@Get("/:id")
@ApiOperation({ summary: "根据ID获取知识库详情" })
@ApiParam({ name: "id", description: "知识库ID" })
getById(@Param("id") id: string): Promise<WikiRepoDetail> {
  return this.wikiRepoService.getById(id);
}
```

#### Service 变更

**文件**: `wiki/libs/kb/src/service/wiki-repo.service.ts`

```typescript
// 移除 path 唯一性检查
async create(dto: CreateWikiRepoDto, creatorId: string): Promise<void> {
  // 移除 path 检查逻辑
  const repo = this.repository.create({
    ...dto,
    creatorId,
    createTime: new Date(),
  });
  await this.repository.save(repo);
}

// 新增根据 ID 查询方法
async getById(id: string): Promise<WikiRepoDetail> {
  const repo = await this.repository.findOne({
    where: { id, deleted: false },
    select: ["id", "cover", "name", "description", "embeddingModelId", "rerankModelId"],
  });

  if (!repo) {
    throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
  }

  return WikiRepoDetailSchema.parse({
    ...repo,
    // 兼容旧版本，如果没有 path 则使用 id
    path: repo.path || repo.id,
  });
}

// 保留 getByPath 方法用于向后兼容（标记为 deprecated）
@Deprecated("使用 getById 替代")
async getByPath(path: string): Promise<WikiRepoDetail> {
  // 先尝试按 path 查询，如果不存在则按 id 查询
  let repo = await this.repository.findOne({
    where: { path, deleted: false },
  });

  if (!repo) {
    repo = await this.repository.findOne({
      where: { id: path, deleted: false },
    });
  }

  if (!repo) {
    throw new AppError(ErrorCode.REPOSITORY_NOT_FOUND);
  }

  return WikiRepoDetailSchema.parse(repo);
}
```

### 前端变更

#### 路由变更

**文件**: `wiki/apps/web/src/app/(wiki)/wiki/[path]/layout.tsx`

```typescript
// 改为使用 id
export type LayoutProps = {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async (props) => {
  const { id } = await props.params;
  const queryClient = getQueryClient();
  await prefetchQuery(queryClient, {
    queryKey: ["wiki", "repo", id],
    queryFn: () => getRepoById(id),
  });
  // ...
};
```

**目录结构变更**:
- 将 `wiki/[path]` 目录重命名为 `wiki/[id]`
- 更新所有相关引用

#### 表单组件变更

**文件**: `wiki/apps/web/src/app/(main)/wiki/components/create/dialog/index.tsx`

```typescript
export const CreateDialog: FC<CreateDialogProps> = (props) => {
  const { t } = useTranslation();
  const form = Form.useForm<CreateWikiRepoFormData>();

  return (
    <Dialog {...props} footer={footer} maskClosable={false} title={t("创建知识库")}>
      <Form<CreateWikiRepoFormData> form={form} onSubmit={(data) => mutate(data)} schema={CreateWikiRepoSchema}>
        {/* 基本信息分组 */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground text-sm">{t("基本信息")}</h3>
          <FormItem label={t("知识库名称")} name="name">
            <Input placeholder={t("请输入知识库名称")} />
          </FormItem>
          {/* 移除 path 字段 */}
          <FormItem label={t("描述")} name="description">
            <Textarea placeholder={t("请输入描述")} />
          </FormItem>
          <FormItem label={t("封面")} name="cover">
            <CoverUploader size={100} />
          </FormItem>
        </div>

        {/* 模型设置分组 */}
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="font-medium text-foreground text-sm">{t("模型设置")}</h3>
          <FormItem label={t("Embedding 模型")} name="embeddingModelId">
            <ModelSelect type="TEXT_EMBEDDING" />
          </FormItem>
          <FormItem label={t("重排模型")} name="rerankModelId">
            <ModelSelect type="RERANK" />
          </FormItem>
        </div>
      </Form>
    </Dialog>
  );
};
```

#### 封面上传组件变更

**文件**: `wiki/apps/web/src/components/common/cover-uploader/index.tsx`

```typescript
export type CoverUploaderProps = {
  value?: string | null;
  onChange?: (value?: string | null) => void;
  className?: string;
  size?: number; // 新增 size 属性，默认 100
};

export const CoverUploader = (props: CoverUploaderProps) => {
  const { value, onChange, className, size = 100 } = props;
  // ...

  return (
    <div className={classNames("relative", className)} style={{ width: size, height: size }}>
      {/* ... */}
      <CropperDialog
        aspectRatio={1}
        cropSize={{ width: size, height: size }} // 传递固定尺寸
        onCancel={() => setVisible(false)}
        onCrop={onCrop}
        src={fileSrc}
        visible={visible}
      />
    </div>
  );
};
```

#### 模型选择器组件（新建）

**文件**: `wiki/apps/web/src/components/common/model-select/index.tsx`

```typescript
"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import { Select } from "@meta-1/design";
import type { ModelType } from "@meta-1/wiki-types";
import { useQuery } from "@/hooks";
import { listModel } from "@/rest/ai/model";
import { useProviderPlatform } from "@/hooks/use.provider.platform";

export type ModelSelectProps = {
  value?: string;
  onChange?: (value: string | number) => void;
  type: ModelType; // TEXT_EMBEDDING 或 RERANK
  placeholder?: string;
};

export const ModelSelect: React.FC<ModelSelectProps> = (props) => {
  const { value, onChange, type, placeholder } = props;
  const { t } = useTranslation();
  const platforms = useProviderPlatform();

  // 获取所有启用的模型
  const { data: allModels = [] } = useQuery({
    queryKey: ["ai:model:list:all"],
    queryFn: async () => {
      // 需要新增 API 获取所有启用的模型
      // 暂时使用多个查询合并
      const providers = platforms.map((p) => p.key);
      const results = await Promise.all(
        providers.map((providerId) => listModel(providerId).catch(() => []))
      );
      return results.flat();
    },
  });

  // 按类型筛选模型
  const filteredModels = allModels.filter(
    (model) => model.enabled && model.type === type
  );

  const options = filteredModels.map((model) => {
    const provider = platforms.find((p) => p.key === model.providerId);
    return {
      value: model.id,
      label: (
        <div className="flex items-center gap-2">
          {provider && (
            <Image
              alt={provider.name}
              className="size-4 object-contain"
              height={16}
              src={provider.icon}
              width={16}
            />
          )}
          <span>{model.name}</span>
        </div>
      ),
    };
  });

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder || t(`请选择${type === "TEXT_EMBEDDING" ? "Embedding" : "重排"}模型`)}
    />
  );
};
```

### REST API 变更

**文件**: `wiki/apps/web/src/rest/wiki/repo.ts`

```typescript
// 更新 API 调用
export const getRepoById = (id: string) => {
  return request<WikiRepoDetail>({
    url: `/api/wiki/repo/${id}`,
    method: "GET",
  });
};

// 保留 getRepoByPath 用于向后兼容
export const getRepoByPath = (path: string) => {
  return request<WikiRepoDetail>({
    url: `/api/wiki/repo/${path}`,
    method: "GET",
  });
};
```

---

## 实施故事

### Story 1: 移除 path 字段，使用 id 作为访问路径

**优先级**: P0  
**估算**: 5 Story Points

**验收标准**:
- [ ] Schema 中移除 `path` 字段的必填要求
- [ ] Entity 保留 `path` 字段但允许为空（向后兼容）
- [ ] Service 移除 path 唯一性检查
- [ ] Controller 路由从 `/:path` 改为 `/:id`
- [ ] 前端路由从 `[path]` 改为 `[id]`
- [ ] 创建表单移除 path 输入框
- [ ] 所有使用 path 的地方改为使用 id
- [ ] 保留向后兼容的 `getByPath` 方法

**技术任务**:
1. 更新 `CreateWikiRepoSchema`，移除 `path` 字段
2. 更新 `WikiRepoService.create()`，移除 path 检查
3. 新增 `WikiRepoService.getById()` 方法
4. 更新 Controller，添加 `getById` 端点
5. 重命名路由目录 `wiki/[path]` → `wiki/[id]`
6. 更新所有路由引用
7. 更新前端组件中的 path 引用为 id
8. 更新 REST API 调用

### Story 2: 封面尺寸调整为 100x100

**优先级**: P1  
**估算**: 2 Story Points

**验收标准**:
- [ ] `CoverUploader` 组件支持 `size` 属性
- [ ] 默认尺寸为 100x100
- [ ] `CropperDialog` 支持固定尺寸裁剪
- [ ] 封面显示区域固定为 100x100

**技术任务**:
1. 更新 `CoverUploader` 组件，添加 `size` prop
2. 更新 `CropperDialog`，支持 `cropSize` 属性
3. 在创建表单中使用 `size={100}`

### Story 3: 添加模型设置表单分组

**优先级**: P1  
**估算**: 5 Story Points

**验收标准**:
- [ ] 创建表单新增"模型设置"分组
- [ ] 提供 Embedding 模型选择器
- [ ] 提供重排模型选择器
- [ ] 选择器显示供应商图标
- [ ] 选择器按模型类型自动筛选
- [ ] Schema 添加 `embeddingModelId` 和 `rerankModelId` 字段
- [ ] Entity 添加对应字段
- [ ] 数据正确保存和读取

**技术任务**:
1. 创建 `ModelSelect` 组件
2. 实现模型列表查询（支持按类型筛选）
3. 实现供应商图标显示
4. 更新 Schema，添加模型字段
5. 更新 Entity，添加模型字段
6. 更新表单，添加模型设置分组
7. 更新 Service，处理模型字段保存

### Story 4: 数据库迁移

**优先级**: P0  
**估算**: 3 Story Points

**验收标准**:
- [ ] 创建迁移脚本添加新字段
- [ ] 为现有知识库设置默认值（如果需要）
- [ ] 迁移脚本可安全回滚

**技术任务**:
1. 创建 TypeORM 迁移文件
2. 添加 `embeddingModelId` 和 `rerankModelId` 字段
3. 设置字段为可空
4. 测试迁移和回滚

---

## 数据库迁移脚本

```typescript
// wiki/libs/kb/src/migration/XXXXXX-add-model-fields.ts

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddModelFields1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "wiki_repo",
      new TableColumn({
        name: "embeddingModelId",
        type: "varchar",
        length: "20",
        isNullable: true,
        comment: "Embedding 模型ID",
      })
    );

    await queryRunner.addColumn(
      "wiki_repo",
      new TableColumn({
        name: "rerankModelId",
        type: "varchar",
        length: "20",
        isNullable: true,
        comment: "重排模型ID",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("wiki_repo", "rerankModelId");
    await queryRunner.dropColumn("wiki_repo", "embeddingModelId");
  }
}
```

---

## 向后兼容性

### 兼容策略

1. **API 兼容**: 保留 `getByPath` 方法，支持按 path 或 id 查询
2. **路由兼容**: 考虑添加重定向从 `/wiki/[path]` 到 `/wiki/[id]`
3. **数据兼容**: Entity 中 `path` 字段保留但允许为空

### 迁移计划

1. **阶段 1**: 实施新功能，同时支持 path 和 id
2. **阶段 2**: 为现有知识库生成 path（如果需要）
3. **阶段 3**: 逐步迁移前端路由到 id
4. **阶段 4**: 废弃 path 相关 API（可选）

---

## 测试计划

### 单元测试

- [ ] Schema 验证测试（移除 path 后创建成功）
- [ ] Service 创建测试（id 生成和保存）
- [ ] Service 查询测试（按 id 查询）
- [ ] ModelSelect 组件测试

### 集成测试

- [ ] API 创建知识库测试（无 path）
- [ ] API 查询知识库测试（按 id）
- [ ] 表单提交测试（包含模型设置）
- [ ] 路由导航测试（使用 id）

### E2E 测试

- [ ] 创建知识库完整流程
- [ ] 访问知识库页面（使用 id）
- [ ] 模型选择器交互测试

---

## 风险评估

### 高风险项

1. **路由变更影响**: 现有书签和链接可能失效
   - **缓解**: 实施重定向或兼容层

2. **数据迁移**: 现有知识库需要处理
   - **缓解**: 保留 path 字段，支持双模式查询

### 中风险项

1. **模型选择器性能**: 如果模型数量很大
   - **缓解**: 实现分页或虚拟滚动

2. **供应商图标加载**: 图标资源可能缺失
   - **缓解**: 提供默认图标占位符

---

## 依赖项

- `@meta-1/design` - UI 组件库
- `@meta-1/wiki-types` - 类型定义
- Next.js 路由系统
- TypeORM 迁移系统

---

## 后续优化

1. 考虑添加模型预览功能
2. 考虑添加模型性能指标显示
3. 考虑支持批量设置模型
4. 考虑添加模型使用统计

---

## 参考资料

- [现有知识库 Schema](./wiki/libs/types/src/wiki/wiki-repo.schema.ts)
- [现有模型管理实现](./wiki/apps/web/src/app/(setting)/setting/provider/components/item/models/)
- [供应商平台选择器](./wiki/apps/web/src/app/(setting)/setting/provider/components/provider-platform-select/index.tsx)

