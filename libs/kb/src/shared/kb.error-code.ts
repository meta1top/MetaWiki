import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  REPOSITORY_NOT_FOUND: { code: 1000, message: "知识库未找到" },
  WIKI_REPO_PATH_EXISTS: { code: 1001, message: "访问路径已存在" },
} as const;
