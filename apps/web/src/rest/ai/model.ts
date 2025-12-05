import type { CreateModelData, Model, UpdateModelData } from "@meta-1/wiki-types";
import { del, get, patch, post } from "@/utils/rest";

export const listModel = (providerId?: string) =>
  get<Model[], { providerId: string } | Record<string, never>>("@api/ai/model/list", providerId ? { providerId } : {});

export const listEnabledModel = (type?: string) =>
  get<Model[], { type: string } | Record<string, never>>("@api/ai/model/enabled", type ? { type } : {});

export const createModel = (data: CreateModelData) => post<unknown, CreateModelData>("@api/ai/model/create", data);

export const getModelById = (id: string) => get<Model>(`@api/ai/model/${id}`);

export const updateModel = (id: string, data: UpdateModelData) =>
  patch<unknown, UpdateModelData>(`@api/ai/model/${id}`, data);

export const deleteModel = (id: string) => del<unknown>(`@api/ai/model/${id}`);
