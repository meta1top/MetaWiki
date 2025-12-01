"use client";

import { useLayoutConfig } from "@/components/layout/hooks";
import { MainLayoutProps } from "@/components/layout/main";

export const Page = () => {
  useLayoutConfig<MainLayoutProps>({
    footerProps: {
      enable: false,
    },
  });
  return <div></div>;
};
