"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, useMessage } from "@meta-1/design";
import type { CreateModelProviderData, ModelProvider, UpdateModelProviderData } from "@meta-1/wiki-types";
import { useMutation, useQuery } from "@/hooks";
import { createModelProvider, listModelProvider, updateModelProvider } from "@/rest/ai/model-provider";
import { ModelProviderForm } from "../form";

export type ModelProviderDialogProps = {
  visible: boolean;
  editingProvider?: ModelProvider | null;
  onCancel: () => void;
  onSuccess?: () => void;
};

export const ModelProviderDialog: React.FC<ModelProviderDialogProps> = (props) => {
  const { visible, editingProvider, onCancel, onSuccess } = props;
  const { t } = useTranslation();
  const msg = useMessage();
  const [internalEditingProvider, setInternalEditingProvider] = useState<ModelProvider | null>(null);
  const isEditMode = !!internalEditingProvider;

  useEffect(() => {
    if (visible) {
      setInternalEditingProvider(editingProvider || null);
    } else {
      const timer = setTimeout(() => {
        setInternalEditingProvider(null);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [visible, editingProvider]);

  const { data: providers = [] } = useQuery({
    queryKey: ["ai:model-provider:list"],
    queryFn: listModelProvider,
    enabled: visible && !isEditMode,
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

  const { mutate: updateMutate, isPending: updatePending } = useMutation({
    mutationFn: (data: UpdateModelProviderData) => updateModelProvider(internalEditingProvider!.id, data),
    onSuccess: () => {
      msg.success(t("更新成功"));
      onCancel();
      onSuccess?.();
    },
    showError: false,
  });

  const handleSubmit = useCallback(
    (data: CreateModelProviderData | UpdateModelProviderData) => {
      if (isEditMode) {
        updateMutate(data as UpdateModelProviderData);
      } else {
        createMutate(data as CreateModelProviderData);
      }
    },
    [createMutate, updateMutate, isEditMode],
  );

  const allPlatforms = ["DEEPSEEK", "ALIBABA_TONGYI", "VOLCANO_ARK"] as const;

  const existingPlatforms = new Set(providers.map((p) => p.platform as "DEEPSEEK" | "ALIBABA_TONGYI" | "VOLCANO_ARK"));
  const availablePlatforms = allPlatforms.filter((p) => !existingPlatforms.has(p));

  return (
    <Dialog
      footer={null}
      key={isEditMode ? `edit-${internalEditingProvider?.id}` : "create"}
      maskClosable={false}
      onCancel={onCancel}
      title={isEditMode ? t("编辑模型提供商") : t("添加模型提供商")}
      visible={visible}
    >
      <div className="transition-all duration-200">
        <ModelProviderForm
          availablePlatforms={availablePlatforms}
          editingProvider={internalEditingProvider}
          loading={createPending || updatePending}
          onSubmit={handleSubmit}
        />
      </div>
    </Dialog>
  );
};
