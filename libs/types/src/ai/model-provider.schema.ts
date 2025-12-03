import { z } from "zod";

export const CreateModelProviderSchema = z.object({
  platform: z.enum(["DEEPSEEK", "ALIBABA_TONGYI", "VOLCANO_ARK"]).describe("平台类型"),
  apiKey: z.string().min(1, "请输入 API Key").max(1000, "API Key 不能超过1000个字符").describe("API Key"),
  apiBaseUrl: z.string().max(500, "API Base URL 不能超过500个字符").nullable().optional().describe("API Base URL"),
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  config: z.record(z.unknown()).nullable().optional().describe("通用配置字段（JSON）"),
});

export type CreateModelProviderData = z.infer<typeof CreateModelProviderSchema>;

export const UpdateModelProviderSchema = z.object({
  apiKey: z.string().min(1, "请输入 API Key").max(1000, "API Key 不能超过1000个字符").optional().describe("API Key"),
  apiBaseUrl: z.string().max(500, "API Base URL 不能超过500个字符").nullable().optional().describe("API Base URL"),
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  config: z.record(z.unknown()).nullable().optional().describe("通用配置字段（JSON）"),
});

export type UpdateModelProviderData = z.infer<typeof UpdateModelProviderSchema>;

export const ModelProviderSchema = z.object({
  id: z.string().describe("模型提供商ID"),
  platform: z.enum(["DEEPSEEK", "ALIBABA_TONGYI", "VOLCANO_ARK"]).describe("平台类型"),
  apiKey: z.string().describe("API Key"),
  apiBaseUrl: z.string().nullable().describe("API Base URL"),
  description: z.string().nullable().describe("描述"),
  config: z.record(z.unknown()).nullable().describe("通用配置字段（JSON）"),
  creatorId: z.string().describe("创建人Id"),
  createTime: z.string().describe("创建时间"),
  updaterId: z.string().nullable().describe("更新人Id"),
  updateTime: z.string().nullable().describe("更新时间"),
});

export type ModelProvider = z.infer<typeof ModelProviderSchema>;
