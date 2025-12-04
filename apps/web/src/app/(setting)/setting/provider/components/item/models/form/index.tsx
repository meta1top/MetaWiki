"use client";

import { type ChangeEvent, type ComponentProps, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, FormItem, Input, Select, Switch, Textarea } from "@meta-1/design";
import type { CreateModelData } from "@meta-1/wiki-types";
import { CreateModelSchema } from "@meta-1/wiki-types";

const NumberInput = (props: ComponentProps<typeof Input>) => {
  const { onChange, value, ...rest } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val ? val.replace(/[^\d]/g, "") : val;
    e.target.value = val;

    if (onChange) {
      const numValue = val === "" ? null : Number(val);
      const valueToSet = Number.isNaN(numValue) ? null : numValue;
      (onChange as unknown as (value: number | null) => void)(valueToSet);
    }
  };

  const stringValue = value === undefined || value === null ? "" : String(value);

  return <Input {...rest} onChange={handleChange} pattern="^\d+$" value={stringValue} />;
};

export type ModelFormProps = {
  loading?: boolean;
  onSubmit: (data: CreateModelData) => void;
  providerId: string;
};

const MODEL_TYPE_OPTIONS = [
  { label: "LLM", value: "LLM" },
  { label: "TEXT_EMBEDDING", value: "TEXT_EMBEDDING" },
  { label: "RERANK", value: "RERANK" },
  { label: "SPEECH2TEXT", value: "SPEECH2TEXT" },
  { label: "TTS", value: "TTS" },
] as const;

export const ModelForm: React.FC<ModelFormProps> = (props) => {
  const { loading, onSubmit, providerId } = props;
  const { t } = useTranslation();
  const form = Form.useForm<CreateModelData>();

  useEffect(() => {
    form.reset({
      providerId,
      functionCalling: false,
      name: "",
      type: undefined,
      contextLength: undefined,
      description: undefined,
    });
  }, [providerId, form]);

  const handleSubmit = (data: CreateModelData) => {
    onSubmit(data);
  };

  return (
    <Form<CreateModelData> form={form} onSubmit={handleSubmit} schema={CreateModelSchema}>
      <FormItem label={t("名称")} name="name">
        <Input placeholder={t("请输入模型名称")} />
      </FormItem>
      <FormItem label={t("类型")} name="type">
        <Select
          options={MODEL_TYPE_OPTIONS.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          placeholder={t("请选择模型类型")}
        />
      </FormItem>
      <FormItem label={t("上下文长度")} name="contextLength">
        <NumberInput placeholder={t("请输入上下文长度（可选）")} />
      </FormItem>
      <FormItem label={t("是否支持Function Calling")} name="functionCalling">
        <Switch />
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
