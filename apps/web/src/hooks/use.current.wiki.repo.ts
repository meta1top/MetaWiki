import { useAtomValue } from "jotai";

import { currentWikiRepoState } from "@/state/wiki";

export const useCurrentWikiRepo = () => {
  return useAtomValue(currentWikiRepoState);
};
