"use client";

import { type FC, type PropsWithChildren, useMemo } from "react";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { MainLayout } from "../main";

export type SettingLayoutProps = PropsWithChildren<{
  className?: string;
}>;

const menuItems = [
  { key: "provider", label: "模型提供商", path: "/setting/provider" },
  { key: "user", label: "用户设置", path: "/setting/user" },
];

export const SettingLayout: FC<SettingLayoutProps> = (props) => {
  const { className, children } = props;
  const pathname = usePathname();
  const { t } = useTranslation();

  const activeKey = useMemo(() => {
    return menuItems.find((item) => pathname?.startsWith(item.path))?.key || "provider";
  }, [pathname]);

  return (
    <MainLayout bodyClassName="flex" className={className} footerProps={{ enable: false }}>
      <div className="flex flex-1">
        <aside className="w-60 flex-shrink-0 border-r bg-card">
          <div className="sticky top-0 z-40 p-sm">
            <nav className="flex flex-col gap-xs">
              {menuItems.map((item) => (
                <Link
                  className={classNames(
                    "rounded-md px-md py-xs text-sm transition-colors",
                    activeKey === item.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  href={item.path}
                  key={item.key}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </MainLayout>
  );
};
