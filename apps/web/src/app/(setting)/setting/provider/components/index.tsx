"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { BreadcrumbItem, BreadcrumbPage, Button, Empty } from "@meta-1/design";
import { SettingBreadcrumb } from "@/components/common/breadcrumb/setting";
import { MainPage } from "@/components/common/page";
import { PageHeader } from "@/components/common/page/header";
import { TitleBar } from "@/components/common/page/title-bar";
import { useQuery } from "@/hooks";
import { listModelProvider } from "@/rest/ai/model-provider";
import { ModelProviderDialog } from "./dialog";
import { ProviderItem } from "./item";

export const Page = () => {
  const { t } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);

  const { data: providers = [], refetch } = useQuery({
    queryKey: ["ai:model-provider:list"],
    queryFn: listModelProvider,
  });

  const handleCreate = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const handleDialogCancel = useCallback(() => {
    setDialogVisible(false);
  }, []);

  const handleDialogSuccess = useCallback(() => {
    refetch();
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
        {providers.length > 0 ? (
          providers.map((provider) => <ProviderItem key={provider.id} provider={provider} />)
        ) : (
          <Empty text={t("暂无模型提供商")} />
        )}
      </div>

      <ModelProviderDialog onCancel={handleDialogCancel} onSuccess={handleDialogSuccess} visible={dialogVisible} />
    </MainPage>
  );
};
