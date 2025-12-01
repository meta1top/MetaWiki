import { atom } from "jotai";

import type { WikiRepoDetail } from "@meta-1/wiki-types";

export const currentWikiRepoState = atom<WikiRepoDetail | undefined>(undefined);
