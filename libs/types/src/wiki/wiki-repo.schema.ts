import { z } from "zod";

export const CreateWikiRepoSchema = z.object({
  name: z.string().min(1, "请输入知识库名称").max(255, "知识库名称不能超过255个字符").describe("知识库名称"),
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  cover: z.string().max(500, "封面URL不能超过500个字符").nullable().optional().describe("封面"),
  embeddingModelId: z.string().min(1, "请选择 Embedding 模型").describe("Embedding 模型ID"),
  rerankModelId: z.string().min(1, "请选择重排模型").describe("重排模型ID"),
});

export type CreateWikiRepoData = z.infer<typeof CreateWikiRepoSchema>;

export const UpdateWikiRepoSchema = z.object({
  name: z.string().min(1, "请输入知识库名称").max(255, "知识库名称不能超过255个字符").optional().describe("知识库名称"),
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  cover: z.string().max(500, "封面URL不能超过500个字符").nullable().optional().describe("封面"),
  embeddingModelId: z.string().min(1, "请选择 Embedding 模型").nullable().optional().describe("Embedding 模型ID"),
  rerankModelId: z.string().min(1, "请选择重排模型").nullable().optional().describe("重排模型ID"),
});

export type UpdateWikiRepoData = z.infer<typeof UpdateWikiRepoSchema>;

export const WikiRepoSchema = z.object({
  id: z.string().describe("知识库ID"),
  name: z.string().describe("名称"),
  description: z.string().nullable().describe("描述"),
  creatorId: z.string().describe("创建人Id"),
  createTime: z.string().describe("创建时间"),
  updaterId: z.string().nullable().describe("更新人Id"),
  updateTime: z.string().nullable().describe("更新时间"),
  cover: z.string().nullable().describe("封面"),
});

export type WikiRepo = z.infer<typeof WikiRepoSchema>;

export const WikiRepoDetailSchema = z.object({
  cover: z.string().nullable().describe("封面"),
  name: z.string().describe("名称"),
  id: z.string().describe("知识库ID"),
  description: z.string().nullable().describe("描述"),
  embeddingModelId: z.string().describe("Embedding 模型ID"),
  rerankModelId: z.string().describe("重排模型ID"),
});

export type WikiRepoDetail = z.infer<typeof WikiRepoDetailSchema>;
