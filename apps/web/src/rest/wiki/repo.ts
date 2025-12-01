import type { CreateWikiRepoData, WikiRepo, WikiRepoDetail } from "@meta-1/wiki-types";
import { get, post } from "@/utils/rest";

export const listRepo = () => get<WikiRepo[]>("@api/wiki/repo/list");

export const createRepo = (data: CreateWikiRepoData) =>
  post<unknown, CreateWikiRepoData>("@api/wiki/repo/create", data);

export const getRepoByPath = (path: string) => get<WikiRepoDetail>(`@api/wiki/repo/${path}`);
