import type { FC, PropsWithChildren } from "react";

export type PageHeaderProps = PropsWithChildren;

export const PageHeader: FC<PageHeaderProps> = (props) => {
  return (
    <div className="-mt-lg sticky top-0 z-40 border-b bg-background dark:bg-black">
      <div className="container flex flex-col gap-sm py-md">{props.children}</div>
    </div>
  );
};
