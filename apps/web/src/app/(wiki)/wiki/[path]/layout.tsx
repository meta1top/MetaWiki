import type { FC } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { WikiLayout } from "@/components/layout/wiki";
import { getRepoByPath } from "@/rest/wiki/repo";
import { getQueryClient, prefetchQuery } from "@/utils/query";

export type LayoutProps = {
  params: Promise<{
    path: string;
  }>;
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async (props) => {
  const { path } = await props.params;
  const queryClient = getQueryClient();
  await prefetchQuery(queryClient, {
    queryKey: ["wiki", "repo", path],
    queryFn: () => getRepoByPath(path),
  });
  const state = dehydrate(queryClient);
  return (
    <HydrationBoundary state={state}>
      <WikiLayout {...props}>{props.children}</WikiLayout>
    </HydrationBoundary>
  );
};
export default Layout;
