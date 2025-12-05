import type { CreateWikiRepoData, UpdateWikiRepoData, WikiRepo, WikiRepoDetail } from "@meta-1/wiki-types";
import { del, get, patch, post } from "@/utils/rest";

export const listRepo = () => get<WikiRepo[]>("@api/wiki/repo/list");

export const createRepo = (data: CreateWikiRepoData) =>
  post<unknown, CreateWikiRepoData>("@api/wiki/repo/create", data);

export const getRepoById = (id: string) => get<WikiRepoDetail>(`@api/wiki/repo/id/${id}`);

export const getRepoByPath = (path: string) => get<WikiRepoDetail>(`@api/wiki/repo/${path}`);

export const updateRepo = (id: string, data: UpdateWikiRepoData) =>
  patch<unknown, UpdateWikiRepoData>(`@api/wiki/repo/${id}`, data);

export const deleteRepo = (id: string) => del<unknown>(`@api/wiki/repo/${id}`);
