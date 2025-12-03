import { type FC, type ReactNode, useCallback, useMemo } from "react";
import classNames from "classnames";
import { useAtomValue } from "jotai";
import { Info, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Action, Button } from "@meta-1/design";
import Logo from "@/components/common/logo";
import { isLoginState } from "@/state/profile";
import { Menus } from "./menus";
import { Notice } from "./notice";
import { ProfileMenu } from "./profile-menu";

export type HeaderProps = {
  active?: string;
  appName?: string;
  profileExtra?: ReactNode;
  className?: string;
  logoUrl?: string;
};

export const Header: FC<HeaderProps> = (props) => {
  const { logoUrl = "/", appName = "MetaWiki", profileExtra, className, active } = props;
  const isLogin = useAtomValue(isLoginState);
  const { t } = useTranslation();
  const router = useRouter();

  const logo = useMemo(() => {
    return (
      <div className="flex items-center gap-xs rounded-md">
        <Logo className="size-8" />
        {appName ? <span className="rounded-md py-0.5 font-bold text-foreground text-xl">{appName}</span> : null}
      </div>
    );
  }, [appName]);

  const goLogin = useCallback(() => {
    location.href = `/login?redirect=${encodeURIComponent(location.href)}`;
  }, []);

  const goRegister = useCallback(() => {
    location.href = `/register?redirect=${encodeURIComponent(location.href)}`;
  }, []);

  return (
    <div
      className={classNames(
        "flex h-[var(--layout-header-height)] w-full items-center justify-center border-b px-sm py-xs",
        "bg-background",
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-start gap-2xl">
        <div className="flex items-center justify-center gap-sm">
          {logoUrl ? <Link href={logoUrl}>{logo}</Link> : logo}
        </div>
        <div className="flex-1">
          <Menus active={active} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-xs">
        {isLogin ? (
          <>
            <Notice />
            <Action className="!outline-none" onClick={() => router.push("/setting/provider")}>
              <Settings className="size-4" />
            </Action>
            <Action className="!outline-none">
              <Info className="size-4" />
            </Action>
            <ProfileMenu extra={profileExtra} />
          </>
        ) : (
          <>
            <Button onClick={goLogin} size="sm">
              {t("登录")}
            </Button>
            <Button onClick={goRegister} size="sm" variant="outline">
              {t("注册")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
