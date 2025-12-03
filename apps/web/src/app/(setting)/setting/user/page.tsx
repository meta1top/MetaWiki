"use client";

import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-md">
      <h1 className="font-bold text-2xl">{t("用户设置")}</h1>
      <div className="rounded-lg border bg-card p-md">
        <p className="text-muted-foreground">{t("用户设置功能开发中...")}</p>
      </div>
    </div>
  );
}
