"use client";

import { Coming } from "@/components/common/coming";
import { useLayoutConfig } from "@/components/layout/hooks";
import { MainLayoutProps } from "@/components/layout/main";

export const Page = () => {
  useLayoutConfig<MainLayoutProps>({
    active: "agent",
  });
  return (
    <div>
      <Coming />
    </div>
  );
};
