"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { BreadcrumbItem, BreadcrumbPage, Button, Empty, useAlert, useMessage } from "@meta-1/design";
import type { ModelProvider } from "@meta-1/wiki-types";
import { SettingBreadcrumb } from "@/components/common/breadcrumb/setting";
import { MainPage } from "@/components/common/page";
import { PageHeader } from "@/components/common/page/header";
import { TitleBar } from "@/components/common/page/title-bar";
import { useMutation, useQuery } from "@/hooks";
import { deleteModelProvider, listModelProvider } from "@/rest/ai/model-provider";
import { ModelProviderDialog } from "./dialog";
import { ProviderItem } from "./item";
import { ProviderItemSkeletonList } from "./item/skeleton";

export const Page = () => {
  const { t } = useTranslation();
  const alert = useAlert();
  const msg = useMessage();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingProvider, setEditingProvider] = useState<ModelProvider | null>(null);

  const {
    data: providers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ai:model-provider:list"],
    queryFn: listModelProvider,
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteModelProvider,
    onSuccess: () => {
      msg.success(t("删除成功"));
      refetch();
    },
    onError: (error) => {
      msg.error(error.message || t("删除失败"));
    },
  });

  const handleCreate = useCallback(() => {
    setEditingProvider(null);
    setDialogVisible(true);
  }, []);

  const handleEdit = useCallback((provider: ModelProvider) => {
    setEditingProvider(provider);
    setDialogVisible(true);
  }, []);

  const handleDelete = useCallback(
    (provider: ModelProvider) => {
      alert.confirm({
        title: t("删除模型提供商"),
        description: t("确定要删除此模型提供商吗？此操作不可恢复。"),
        okText: t("删除"),
        cancelText: t("取消"),
        onOk: async () => {
          deleteMutate(provider.id);
          return true;
        },
      });
    },
    [alert, deleteMutate, t],
  );

  const handleDialogCancel = useCallback(() => {
    setDialogVisible(false);
    setEditingProvider(null);
  }, []);

  const handleDialogSuccess = useCallback(() => {
    refetch();
    setEditingProvider(null);
  }, [refetch]);

  const title = t("模型提供商");
  const actions = <Button onClick={handleCreate}>{t("添加提供商")}</Button>;

  return (
    <MainPage>
      <PageHeader>
        <SettingBreadcrumb>
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </SettingBreadcrumb>
        <TitleBar actions={actions} title={title} />
      </PageHeader>
      <div className="container flex flex-col gap-md">
        {isLoading ? (
          <ProviderItemSkeletonList />
        ) : providers.length > 0 ? (
          providers.map((provider) => (
            <ProviderItem key={provider.id} onDelete={handleDelete} onEdit={handleEdit} provider={provider} />
          ))
        ) : (
          <Empty text={t("暂无模型提供商")} />
        )}
      </div>

      <ModelProviderDialog
        editingProvider={editingProvider}
        onCancel={handleDialogCancel}
        onSuccess={handleDialogSuccess}
        visible={dialogVisible}
      />
    </MainPage>
  );
};
