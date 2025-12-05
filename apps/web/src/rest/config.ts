import { CommonConfig } from "@meta-1/wiki-types";
import { get } from "@/utils/rest";

export const common = () => get<CommonConfig>("@api/config/common");
