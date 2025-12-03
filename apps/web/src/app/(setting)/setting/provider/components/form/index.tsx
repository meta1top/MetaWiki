"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, FormItem, Input, Textarea } from "@meta-1/design";
import type { CreateModelProviderData } from "@meta-1/wiki-types";
import { CreateModelProviderSchema } from "@meta-1/wiki-types";
import { useProviderPlatform } from "@/hooks/use.provider.platform";
import { ProviderPlatformSelect } from "../provider-platform-select";

export type ModelProviderFormProps = {
  loading?: boolean;
  onSubmit: (data: CreateModelProviderData) => void;
  availablePlatforms?: string[];
};

export const ModelProviderForm: React.FC<ModelProviderFormProps> = (props) => {
  const { loading, onSubmit, availablePlatforms } = props;
  const { t } = useTranslation();
  const form = Form.useForm<CreateModelProviderData>();
  const platforms = useProviderPlatform();

  const handlePlatformChange = useCallback(
    (value: string | number) => {
      const platformKey = String(value);
      form.setValue("platform", platformKey as "DEEPSEEK" | "ALIBABA_TONGYI" | "VOLCANO_ARK");
      const selectedPlatform = platforms.find((p) => p.key === platformKey);
      if (selectedPlatform) {
        const currentDescription = form.getValues("description");
        const currentBaseUrl = form.getValues("apiBaseUrl");
        if (selectedPlatform.description && !currentDescription) {
          form.setValue("description", selectedPlatform.description);
        }
        if (selectedPlatform.baseUrl && !currentBaseUrl) {
          form.setValue("apiBaseUrl", selectedPlatform.baseUrl);
        }
      }
    },
    [form, platforms],
  );

  return (
    <Form<CreateModelProviderData> form={form} onSubmit={onSubmit} schema={CreateModelProviderSchema}>
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
