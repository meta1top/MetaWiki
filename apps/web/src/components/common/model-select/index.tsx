"use client";

import { useTranslation } from "react-i18next";

import { Avatar, Select } from "@meta-1/design";
import type { ModelType } from "@meta-1/wiki-types";
import { useQuery } from "@/hooks";
import { useProviderPlatform } from "@/hooks/use.provider.platform";
import { listEnabledModel } from "@/rest/ai";
import { listModelProvider } from "@/rest/ai/model-provider";

export type ModelSelectProps = {
  value?: string;
  onChange?: (value: string | number) => void;
  type: ModelType;
  placeholder?: string;
};

export const ModelSelect: React.FC<ModelSelectProps> = (props) => {
  const { value, onChange, type, placeholder } = props;
  const { t } = useTranslation();
  const platformConfigs = useProviderPlatform();

  // 获取所有启用的模型（按类型筛选）
  const { data: filteredModels = [], isLoading: modelsLoading } = useQuery({
    queryKey: ["ai:model:enabled", type],
    queryFn: () => listEnabledModel(type),
  });

  // 获取所有 ModelProvider，建立 providerId -> platform 的映射
  const { data: providers = [], isLoading: providersLoading } = useQuery({
    queryKey: ["ai:model-provider:list"],
    queryFn: listModelProvider,
  });

  // 建立 providerId -> platform 的映射
  const providerPlatformMap = new Map(providers.map((p) => [p.id, p.platform]));

  const options = filteredModels.map((model) => {
    // 通过 providerId 找到 platform
    const platform = providerPlatformMap.get(model.providerId);
    // 通过 platform 找到对应的平台配置（包含 icon）
    const platformConfig = platformConfigs.find((p) => p.key === platform);

    return {
      value: model.id,
      label: (
        <div className="flex items-center gap-2">
          {platformConfig && (
            <Avatar
              alt={platformConfig.name}
              className="size-4 shrink-0"
              fallback={platformConfig.name.charAt(0)}
              src={platformConfig.icon}
            />
          )}
          <span>{model.name}</span>
        </div>
      ),
    };
  });

  const isLoading = modelsLoading || providersLoading;

  const defaultPlaceholder =
    type === "TEXT_EMBEDDING" ? t("请选择 Embedding 模型") : type === "RERANK" ? t("请选择重排模型") : t("请选择模型");

  if (isLoading) {
    return <Select onChange={onChange} options={[]} placeholder={t("加载中...")} value={value} />;
  }

  return <Select onChange={onChange} options={options} placeholder={placeholder || defaultPlaceholder} value={value} />;
};
