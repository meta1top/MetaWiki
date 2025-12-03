import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  MODEL_PROVIDER_NOT_FOUND: { code: 2000, message: "模型提供商未找到" },
  MODEL_PROVIDER_ACCESS_DENIED: { code: 2001, message: "无权访问该模型提供商" },
  MODEL_PROVIDER_PLATFORM_EXISTS: { code: 2002, message: "该平台已存在，不能重复添加" },
  MODEL_NOT_FOUND: { code: 2003, message: "模型未找到" },
  MODEL_ACCESS_DENIED: { code: 2004, message: "无权访问该模型" },
  MODEL_CONFIG_NOT_FOUND: { code: 2005, message: "模型配置未找到" },
  MODEL_CONFIG_ACCESS_DENIED: { code: 2006, message: "无权访问该模型配置" },
} as const;
