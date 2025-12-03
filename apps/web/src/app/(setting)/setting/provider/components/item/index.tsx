import { useTranslation } from "react-i18next";

import type { ModelProvider } from "@meta-1/wiki-types";

export type ProviderItemProps = {
  provider: ModelProvider;
};

const platformNameMap: Record<string, string> = {
  DEEPSEEK: "Deepseek",
  ALIBABA_TONGYI: "阿里百炼",
  VOLCANO_ARK: "火山方舟",
};

export const ProviderItem = ({ provider }: ProviderItemProps) => {
  const { t } = useTranslation();
  const platformName = platformNameMap[provider.platform] || provider.platform;

  return <div>{t(platformName)}</div>;
};
