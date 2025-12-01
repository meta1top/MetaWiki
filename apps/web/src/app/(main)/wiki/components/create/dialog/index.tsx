"use client";

import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Button, Dialog, type DialogProps, Form, FormItem, Input, Textarea } from "@meta-1/design";
import { CreateWikiRepoSchema } from "@meta-1/wiki-types";
import { CoverUploader } from "@/components/common/cover-uploader";
import { useMutation } from "@/hooks";
import { createRepo } from "@/rest/wiki/repo";

export type CreateDialogProps = DialogProps & {
  onSuccess?: () => void;
};

type CreateWikiRepoFormData = z.infer<typeof CreateWikiRepoSchema>;

export const CreateDialog: FC<CreateDialogProps> = (props) => {
  const { t } = useTranslation();
  const form = Form.useForm<CreateWikiRepoFormData>();

  const { mutate, isPending } = useMutation({
    mutationFn: createRepo,
    onSuccess: () => {
      props.onCancel?.();
      form.reset();
      props.onSuccess?.();
    },
  });

  const footer = (
    <div className="flex justify-end gap-2">
      <Button loading={isPending} onClick={() => form.submit()}>
        {t("确定")}
      </Button>
      <Button disabled={isPending} onClick={props.onCancel} variant="outline">
        {t("取消")}
      </Button>
    </div>
  );

  return (
    <Dialog {...props} footer={footer} maskClosable={false} title={t("创建知识库")}>
      <Form<CreateWikiRepoFormData> form={form} onSubmit={(data) => mutate(data)} schema={CreateWikiRepoSchema}>
        <FormItem label={t("知识库名称")} name="name">
          <Input placeholder={t("请输入知识库名称")} />
        </FormItem>
        <FormItem label={t("访问路径")} name="path">
          <Input placeholder={t("请输入访问路径")} />
        </FormItem>
        <FormItem label={t("描述")} name="description">
          <Textarea placeholder={t("请输入描述")} />
        </FormItem>
        <FormItem label={t("封面")} name="cover">
          <CoverUploader />
        </FormItem>
      </Form>
    </Dialog>
  );
};
