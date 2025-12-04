import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Action, Empty, Spin } from "@meta-1/design";
import type { Model } from "@meta-1/wiki-types";
import { ModelProvider } from "@meta-1/wiki-types";
import DownIcon from "@/assets/icons/down.svg";
import PlusIcon from "@/assets/icons/plus.svg";
import RightIcon from "@/assets/icons/right.svg";
import { useQuery } from "@/hooks";
import { listModel } from "@/rest/ai/model";
import { ModelDialog } from "./dialog";
import { ModelItem } from "./item";

export type ProviderItemModelsProps = {
  provider: ModelProvider;
};

export const ProviderItemModels = ({ provider }: ProviderItemModelsProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const {
    data: models = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ai:model:list", provider.id],
    queryFn: () => listModel(provider.id),
    enabled: isExpanded,
  });

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleAddClick = () => {
    setDialogVisible(true);
  };

  const handleDialogSuccess = () => {
    refetch();
  };

  return (
    <div className="flex flex-col gap-xs">
      <div className="flex flex-row justify-between">
        <Action className="flex items-center gap-1 px-2 py-1 text-sm" onClick={handleToggle}>
          {t("模型列表")}
          {isLoading ? <Spin /> : isExpanded ? <DownIcon className="size-4" /> : <RightIcon className="size-4" />}
        </Action>
        {isExpanded && (
          <Action className="flex items-center gap-1 px-2 py-1 text-sm" onClick={handleAddClick}>
            <PlusIcon className="size-4" />
            {t("添加模型")}
          </Action>
        )}
      </div>
      {isExpanded && !isLoading && (
        <div className="rounded-md bg-secondary px-sm">
          {models.length > 0 ? (
            models.map((model: Model) => <ModelItem key={model.id} model={model} providerId={provider.id} />)
          ) : (
            <Empty text={t("暂无模型")} />
          )}
        </div>
      )}
      <ModelDialog
        onCancel={() => setDialogVisible(false)}
        onSuccess={handleDialogSuccess}
        provider={provider}
        visible={dialogVisible}
      />
    </div>
  );
};
