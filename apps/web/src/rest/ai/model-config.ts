import type { CreateModelConfigData, ModelConfig, UpdateModelConfigData } from "@meta-1/wiki-types";
import { del, get, patch, post } from "@/utils/rest";

export const getGlobalModelConfig = () => get<ModelConfig | null>("@api/ai/model-config/global");

export const getProviderModelConfig = (providerId: string) =>
  get<ModelConfig | null>(`@api/ai/model-config/provider/${providerId}`);

export const createModelConfig = (data: CreateModelConfigData) =>
  post<unknown, CreateModelConfigData>("@api/ai/model-config/create", data);

export const updateModelConfig = (id: string, data: UpdateModelConfigData) =>
  patch<unknown, UpdateModelConfigData>(`@api/ai/model-config/${id}`, data);

export const deleteModelConfig = (id: string) => del<unknown>(`@api/ai/model-config/${id}`);
