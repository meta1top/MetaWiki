"use client";

import type { FC } from "react";
import { useLayoutEffect } from "react";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useParams } from "next/navigation";

import { useQuery } from "@/hooks";
import { getRepoById } from "@/rest/wiki/repo";
import { currentWikiRepoState } from "@/state/wiki";
import { MainLayout, MainLayoutProps } from "../main";

export type WikiLayoutProps = MainLayoutProps & {};

export const WikiLayout: FC<WikiLayoutProps> = (props) => {
  const { id } = useParams();
  const setCurrentWikiRepo = useSetAtom(currentWikiRepoState);
  const { data: repo } = useQuery({
    queryKey: ["wiki", "repo", id],
    queryFn: () => getRepoById(id as string),
  });

  useHydrateAtoms([[currentWikiRepoState, repo]]);

  useLayoutEffect(() => {
    setCurrentWikiRepo(repo);
  }, [repo, setCurrentWikiRepo]);

  return (
    <MainLayout {...props} active="wiki" footerProps={{ enable: false }}>
      {props.children}
    </MainLayout>
  );
};
