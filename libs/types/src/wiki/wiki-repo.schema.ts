import { z } from "zod";

import { REGULAR_WIKI_PATH } from "../regular";

export const CreateWikiRepoSchema = z.object({
  name: z.string().min(1, "请输入知识库名称").max(255, "知识库名称不能超过255个字符").describe("知识库名称"),
  path: z
    .string()
    .min(1, "请输入访问路径")
    .max(500, "访问路径不能超过500个字符")
    .regex(REGULAR_WIKI_PATH, "访问路径只能包含小写字母、数字和下划线，且必须以字母开头")
    .describe("访问路径"),
  description: z.string().max(1000, "描述不能超过1000个字符").nullable().optional().describe("描述"),
  cover: z.string().max(500, "封面URL不能超过500个字符").nullable().optional().describe("封面"),
});

export type CreateWikiRepoData = z.infer<typeof CreateWikiRepoSchema>;

export const WikiRepoSchema = z.object({
  id: z.string().describe("知识库ID"),
  name: z.string().describe("名称"),
  path: z.string().describe("访问路径"),
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
  path: z.string().describe("访问路径"),
  description: z.string().nullable().describe("描述"),
});

export type WikiRepoDetail = z.infer<typeof WikiRepoDetailSchema>;
