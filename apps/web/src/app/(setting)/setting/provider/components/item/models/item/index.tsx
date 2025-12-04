import { type ReactElement } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Badge, Switch } from "@meta-1/design";
import type { Model } from "@meta-1/wiki-types";
import { useModelType, useMutation } from "@/hooks";
import { updateModel } from "@/rest/ai/model";

export type ModelItemProps = {
  model: Model;
  providerId: string;
};

export const ModelItem = ({ model, providerId }: ModelItemProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { getModelTypeLabel } = useModelType();

  const { mutate: updateModelMutate } = useMutation({
    mutationFn: (enabled: boolean) => updateModel(model.id, { enabled }),
    onMutate: async (enabled) => {
      const queryKey = ["ai:model:list", providerId];
      await queryClient.cancelQueries({ queryKey });

      const previousModels = queryClient.getQueryData<Model[]>(queryKey);

      queryClient.setQueryData<Model[]>(queryKey, (old) => {
        if (!old) return old;
        return old
          .map((m) => (m.id === model.id ? { ...m, enabled } : m))
          .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
      });

      return { previousModels };
    },
    onError: (_error, _enabled, context) => {
      if (context?.previousModels) {
        queryClient.setQueryData(["ai:model:list", providerId], context.previousModels);
      }
    },
  });

  const formatContextLength = (length: number | null): string | null => {
    if (length === null || length === undefined) return null;
    if (length >= 1000000) {
      return `${Math.round(length / 1000000)}M`;
    }
    if (length >= 1000) {
      return `${Math.round(length / 1000)}K`;
    }
    return String(length);
  };

  const getModelTypeBadges = () => {
    const badges: ReactElement[] = [];

    if (model.type === "LLM") {
      badges.push(
        <Badge className="bg-card text-xs uppercase" key="llm" variant="outline">
          {t("LLM")}
        </Badge>,
        <Badge className="bg-card text-xs uppercase" key="chat" variant="outline">
          {t("Chat")}
        </Badge>,
      );
    } else {
      badges.push(
        <Badge className="bg-card uppercase" key={model.type} variant="outline">
          {getModelTypeLabel(model.type)}
        </Badge>,
      );
    }

    const contextLengthFormatted = formatContextLength(model.contextLength);
    if (contextLengthFormatted) {
      badges.push(
        <Badge className="bg-card" key="context-length" variant="outline">
          {contextLengthFormatted}
        </Badge>,
      );
    }

    return badges;
  };

  return (
    <div className="flex justify-between border-border border-b py-xs text-sm last:border-b-0">
      <div className="flex items-center gap-1">
        <span>{model.name}</span>
        {getModelTypeBadges()}
      </div>
      <div>
        <Switch onChange={(enabled) => updateModelMutate(enabled)} value={model.enabled} />
      </div>
    </div>
  );
};
