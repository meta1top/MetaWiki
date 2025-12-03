import { z } from "zod";

export const CreateModelSchema = z.object({
  providerId: z.string().min(1, "请选择模型提供商").describe("模型提供商ID"),
  name: z.string().min(1, "请输入模型名称").max(255, "模型名称不能超过255个字符").describe("模型名称"),
  type: z.enum(["LLM", "TEXT_EMBEDDING", "RERANK", "SPEECH2TEXT", "TTS"]).describe("模型类型"),
  contextLength: z.number().int().positive("上下文长度必须为正整数").nullable().optional().describe("上下文长度"),
});

export type CreateModelData = z.infer<typeof CreateModelSchema>;

export const UpdateModelSchema = z.object({
  providerId: z.string().min(1, "请选择模型提供商").optional().describe("模型提供商ID"),
  name: z.string().min(1, "请输入模型名称").max(255, "模型名称不能超过255个字符").optional().describe("模型名称"),
  type: z.enum(["LLM", "TEXT_EMBEDDING", "RERANK", "SPEECH2TEXT", "TTS"]).optional().describe("模型类型"),
  contextLength: z.number().int().positive("上下文长度必须为正整数").nullable().optional().describe("上下文长度"),
});

export type UpdateModelData = z.infer<typeof UpdateModelSchema>;

export const ModelSchema = z.object({
  id: z.string().describe("模型ID"),
  providerId: z.string().describe("模型提供商ID"),
  name: z.string().describe("模型名称"),
  type: z.enum(["LLM", "TEXT_EMBEDDING", "RERANK", "SPEECH2TEXT", "TTS"]).describe("模型类型"),
  contextLength: z.number().int().nullable().describe("上下文长度"),
  creatorId: z.string().describe("创建人Id"),
  createTime: z.string().describe("创建时间"),
  updaterId: z.string().nullable().describe("更新人Id"),
  updateTime: z.string().nullable().describe("更新时间"),
});

export type Model = z.infer<typeof ModelSchema>;
