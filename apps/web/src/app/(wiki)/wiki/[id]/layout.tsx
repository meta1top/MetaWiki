import type { FC } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { WikiLayout } from "@/components/layout/wiki";
import { getRepoById } from "@/rest/wiki/repo";
import { getQueryClient, prefetchQuery } from "@/utils/query";

export type LayoutProps = {
  params: Promise<{
    id: string;
  }>;
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async (props) => {
  const { id } = await props.params;
  const queryClient = getQueryClient();
  await prefetchQuery(queryClient, {
    queryKey: ["wiki", "repo", id],
    queryFn: () => getRepoById(id),
  });
  const state = dehydrate(queryClient);
  return (
    <HydrationBoundary key={id} state={state}>
      <WikiLayout {...props}>{props.children}</WikiLayout>
    </HydrationBoundary>
  );
};
export default Layout;
