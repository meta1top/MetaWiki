"use client";

import { useTranslation } from "react-i18next";

import { Dialog, useMessage } from "@meta-1/design";
import type { CreateModelData, ModelProvider } from "@meta-1/wiki-types";
import { useMutation } from "@/hooks";
import { createModel } from "@/rest/ai/model";
import { ModelForm } from "../form";

export type ModelDialogProps = {
  visible: boolean;
  provider: ModelProvider;
  onCancel: () => void;
  onSuccess?: () => void;
};

export const ModelDialog: React.FC<ModelDialogProps> = (props) => {
  const { visible, provider, onCancel, onSuccess } = props;
  const { t } = useTranslation();
  const msg = useMessage();

  const { mutate, isPending } = useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      msg.success(t("创建成功"));
      onCancel();
      onSuccess?.();
    },
    showError: false,
  });

  const handleSubmit = (data: CreateModelData) => {
    mutate(data);
  };

  return (
    <Dialog footer={null} maskClosable={false} onCancel={onCancel} title={t("添加模型")} visible={visible}>
      <div className="transition-all duration-200">
        <ModelForm loading={isPending} onSubmit={handleSubmit} providerId={provider.id} />
      </div>
    </Dialog>
  );
};
