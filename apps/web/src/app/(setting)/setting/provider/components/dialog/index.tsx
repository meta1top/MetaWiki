"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, useMessage } from "@meta-1/design";
import type { CreateModelProviderData } from "@meta-1/wiki-types";
import { useMutation, useQuery } from "@/hooks";
import { createModelProvider, listModelProvider } from "@/rest/ai/model-provider";
import { ModelProviderForm } from "../form";

export type ModelProviderDialogProps = {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
};

export const ModelProviderDialog: React.FC<ModelProviderDialogProps> = (props) => {
  const { visible, onCancel, onSuccess } = props;
  const { t } = useTranslation();
  const msg = useMessage();

  const { data: providers = [] } = useQuery({
    queryKey: ["ai:model-provider:list"],
    queryFn: listModelProvider,
    enabled: visible,
  });

  const { mutate: createMutate, isPending: createPending } = useMutation({
    mutationFn: createModelProvider,
    onSuccess: () => {
      msg.success(t("创建成功"));
      onCancel();
      onSuccess?.();
    },
    showError: false,
  });

  const handleSubmit = useCallback(
    (data: CreateModelProviderData) => {
      createMutate(data);
    },
    [createMutate],
  );

  const allPlatforms = ["DEEPSEEK", "ALIBABA_TONGYI", "VOLCANO_ARK"] as const;

  const existingPlatforms = new Set(providers.map((p) => p.platform as "DEEPSEEK" | "ALIBABA_TONGYI" | "VOLCANO_ARK"));
  const availablePlatforms = allPlatforms.filter((p) => !existingPlatforms.has(p));

  return (
    <Dialog footer={null} maskClosable={false} onCancel={onCancel} title={t("添加模型提供商")} visible={visible}>
      <ModelProviderForm availablePlatforms={availablePlatforms} loading={createPending} onSubmit={handleSubmit} />
    </Dialog>
  );
};
