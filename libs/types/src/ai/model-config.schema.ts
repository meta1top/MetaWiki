import { z } from "zod";

export const CreateModelConfigSchema = z.object({
  providerId: z.string().nullable().optional().describe("模型提供商ID（为空表示全局配置）"),
  temperature: z.number().min(0).max(2).nullable().optional().describe("温度"),
  maxTokens: z.number().int().positive("最大 token 数必须为正整数").nullable().optional().describe("最大 token 数"),
  topP: z.number().min(0).max(1).nullable().optional().describe("核采样"),
  frequencyPenalty: z.number().min(-2).max(2).nullable().optional().describe("频率惩罚"),
  presencePenalty: z.number().min(-2).max(2).nullable().optional().describe("存在惩罚"),
  otherConfig: z.record(z.unknown()).nullable().optional().describe("其他配置（JSON）"),
});

export type CreateModelConfigData = z.infer<typeof CreateModelConfigSchema>;

export const UpdateModelConfigSchema = z.object({
  providerId: z.string().nullable().optional().describe("模型提供商ID（为空表示全局配置）"),
  temperature: z.number().min(0).max(2).nullable().optional().describe("温度"),
  maxTokens: z.number().int().positive("最大 token 数必须为正整数").nullable().optional().describe("最大 token 数"),
  topP: z.number().min(0).max(1).nullable().optional().describe("核采样"),
  frequencyPenalty: z.number().min(-2).max(2).nullable().optional().describe("频率惩罚"),
  presencePenalty: z.number().min(-2).max(2).nullable().optional().describe("存在惩罚"),
  otherConfig: z.record(z.unknown()).nullable().optional().describe("其他配置（JSON）"),
});

export type UpdateModelConfigData = z.infer<typeof UpdateModelConfigSchema>;

export const ModelConfigSchema = z.object({
  id: z.string().describe("配置ID"),
  providerId: z.string().nullable().describe("模型提供商ID（为空表示全局配置）"),
  temperature: z.number().nullable().describe("温度"),
  maxTokens: z.number().int().nullable().describe("最大 token 数"),
  topP: z.number().nullable().describe("核采样"),
  frequencyPenalty: z.number().nullable().describe("频率惩罚"),
  presencePenalty: z.number().nullable().describe("存在惩罚"),
  otherConfig: z.record(z.unknown()).nullable().describe("其他配置（JSON）"),
  creatorId: z.string().describe("创建人Id"),
  createTime: z.string().describe("创建时间"),
  updaterId: z.string().nullable().describe("更新人Id"),
  updateTime: z.string().nullable().describe("更新时间"),
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;
