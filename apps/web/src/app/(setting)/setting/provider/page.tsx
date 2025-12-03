import { Metadata } from "next";

import { st } from "@/utils/locale.server";
import { keywords, title } from "@/utils/seo";
import { Page } from "./components";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await title(await st("模型提供商")),
    keywords: await keywords(),
  };
}

export default Page;
