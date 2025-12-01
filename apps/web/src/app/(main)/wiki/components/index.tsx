"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { WikiBreadcrumb } from "@/components/common/breadcrumb/wiki";
import { MainPage } from "@/components/common/page";
import { PageHeader } from "@/components/common/page/header";
import { TitleBar } from "@/components/common/page/title-bar";
import { useLayoutConfig } from "@/components/layout/hooks";
import { MainLayoutProps } from "@/components/layout/main";
import { useQuery } from "@/hooks";
import { listRepo } from "@/rest/wiki/repo";
import { CreateButton } from "./create/button";
import { RepoItem } from "./item";
import { RepoItemSkeleton } from "./item/skeleton";

export const Page = () => {
  useLayoutConfig<MainLayoutProps>({
    active: "wiki",
  });
  const { t } = useTranslation();
  const title = t("知识库");
  const client = useQueryClient();

  const { data: repos, isLoading } = useQuery({
    queryKey: ["wiki:repo:list"],
    queryFn: listRepo,
  });

  const onSuccess = () => {
    client.invalidateQueries({ queryKey: ["wiki:repo:list"] });
  };

  return (
    <MainPage>
      <PageHeader>
        <WikiBreadcrumb />
        <TitleBar actions={<CreateButton onSuccess={onSuccess} />} title={title} />
      </PageHeader>
      <div className="container">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <RepoItemSkeleton key={index} />
            ))}
          </div>
        ) : repos && repos.length > 0 ? (
          <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <RepoItem key={repo.id} repo={repo} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">{t("暂无知识库，请创建")}</p>
          </div>
        )}
      </div>
    </MainPage>
  );
};
