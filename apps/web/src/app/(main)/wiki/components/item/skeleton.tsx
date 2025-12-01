"use client";

import type { FC } from "react";

import { Card, Skeleton } from "@meta-1/design";

export const RepoItemSkeleton: FC = () => {
  return (
    <Card className="p-0" contentClassName="!p-md" shadow={false}>
      <div className="flex items-start gap-sm">
        <Skeleton className="size-22 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2xs">
          <div className="flex items-center gap-xs">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <div className="min-h-[2.5rem] space-y-2xs">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </Card>
  );
};
