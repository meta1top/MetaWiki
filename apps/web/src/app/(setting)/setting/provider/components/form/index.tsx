"use client";

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, FormItem, Input, Textarea } from "@meta-1/design";
import type { CreateModelProviderData, ModelProvider, UpdateModelProviderData } from "@meta-1/wiki-types";
import { CreateModelProviderSchema, UpdateModelProviderSchema } from "@meta-1/wiki-types";
import { useProviderPlatform } from "@/hooks/use.provider.platform";
import { ProviderPlatformSelect } from "../provider-platform-select";

export type ModelProviderFormProps = {
  loading?: boolean;
  onSubmit: (data: CreateModelProviderData | UpdateModelProviderData) => void;
  availablePlatforms?: string[];
  editingProvider?: ModelProvider | null;
};

export const ModelProviderForm: React.FC<ModelProviderFormProps> = (props) => {
  const { loading, onSubmit, availablePlatforms, editingProvider } = props;
  const { t } = useTranslation();
  const isEditMode = !!editingProvider;
  const editForm = Form.useForm<UpdateModelProviderData>();
  const createForm = Form.useForm<CreateModelProviderData>();
  const platforms = useProviderPlatform();

  useEffect(() => {
    if (editingProvider) {
      editForm.reset({
        apiKey: editingProvider.apiKey,
      });
    } else {
      createForm.reset();
    }
  }, [editingProvider, editForm, createForm]);

  const handlePlatformChange = useCallback(
    (value: string | number) => {
      const platformKey = String(value);
      createForm.setValue("platform", platformKey as "DEEPSEEK" | "ALIBABA_TONGYI" | "VOLCANO_ARK");
      const selectedPlatform = platforms.find((p) => p.key === platformKey);
      if (selectedPlatform) {
        const currentDescription = createForm.getValues("description");
        const currentBaseUrl = createForm.getValues("apiBaseUrl");
        if (selectedPlatform.description && !currentDescription) {
          createForm.setValue("description", selectedPlatform.description);
        }
        if (selectedPlatform.baseUrl && !currentBaseUrl) {
          createForm.setValue("apiBaseUrl", selectedPlatform.baseUrl);
        }
      }
    },
    [createForm, platforms],
  );

  if (isEditMode) {
    return (
      <Form<UpdateModelProviderData> form={editForm} onSubmit={onSubmit} schema={UpdateModelProviderSchema}>
        <FormItem label={t("API Key")} name="apiKey">
          <Input placeholder={t("请输入 API Key")} type="password" />
        </FormItem>
        <div className="flex justify-end gap-2">
          <Button loading={loading} type="submit">
            {t("更新")}
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form<CreateModelProviderData> form={createForm} onSubmit={onSubmit} schema={CreateModelProviderSchema}>
      <FormItem label={t("平台")} name="platform">
        <ProviderPlatformSelect
          availablePlatforms={availablePlatforms}
          onChange={handlePlatformChange}
          placeholder={t("请选择平台")}
        />
      </FormItem>
      <FormItem label={t("API Key")} name="apiKey">
        <Input placeholder={t("请输入 API Key")} type="password" />
      </FormItem>
      <FormItem label={t("API Base URL")} name="apiBaseUrl">
        <Input placeholder={t("请输入 API Base URL（可选）")} />
      </FormItem>
      <FormItem label={t("描述")} name="description">
        <Textarea placeholder={t("请输入描述（可选）")} />
      </FormItem>
      <div className="flex justify-end gap-2">
        <Button loading={loading} type="submit">
          {t("创建")}
        </Button>
      </div>
    </Form>
  );
};
