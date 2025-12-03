import type { CreateModelProviderData, ModelProvider, UpdateModelProviderData } from "@meta-1/wiki-types";
import { del, get, patch, post } from "@/utils/rest";

export const listModelProvider = () => get<ModelProvider[]>("@api/ai/model-provider/list");

export const createModelProvider = (data: CreateModelProviderData) =>
  post<unknown, CreateModelProviderData>("@api/ai/model-provider/create", data);

export const getModelProviderById = (id: string) => get<ModelProvider>(`@api/ai/model-provider/${id}`);

export const updateModelProvider = (id: string, data: UpdateModelProviderData) =>
  patch<unknown, UpdateModelProviderData>(`@api/ai/model-provider/${id}`, data);

export const deleteModelProvider = (id: string) => del<unknown>(`@api/ai/model-provider/${id}`);
