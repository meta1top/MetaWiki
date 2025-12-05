import { atom } from "jotai";

import type { CommonConfig } from "@meta-1/wiki-types";

export const commonConfigState = atom<CommonConfig | undefined>(undefined);
