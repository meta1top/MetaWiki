"use client";

import type { FC } from "react";
import { useParams } from "next/navigation";

import { AtomsHydrate } from "@/components/common/atoms-hydrate";
import { useQuery } from "@/hooks";
import { getRepoByPath } from "@/rest/wiki/repo";
import { currentWikiRepoState } from "@/state/wiki";
import { MainLayout, MainLayoutProps } from "../main";

export type WikiLayoutProps = MainLayoutProps & {};

export const WikiLayout: FC<WikiLayoutProps> = (props) => {
  const { path } = useParams();
  const { data: repo } = useQuery({
    queryKey: ["wiki", "repo", path],
    queryFn: () => getRepoByPath(path as string),
  });

  return (
    <AtomsHydrate atomValues={[[currentWikiRepoState, repo]]}>
      <MainLayout {...props} active="wiki" footerProps={{ enable: false }}>
        {props.children}
      </MainLayout>
    </AtomsHydrate>
  );
};
