"use client";

import { useCurrentWikiRepo } from "@/hooks";

export const Page = () => {
  const currentWikiRepo = useCurrentWikiRepo();
  return <div>{currentWikiRepo?.name}</div>;
};
