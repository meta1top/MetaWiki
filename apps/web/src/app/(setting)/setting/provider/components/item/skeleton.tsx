"use client";

import type { FC } from "react";

import { Skeleton } from "@meta-1/design";

export const ProviderItemSkeleton: FC = () => {
  return (
    <div className="flex flex-col rounded-md border border-card bg-card">
      <div className="flex flex-col gap-sm border-b p-md">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-xs">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div>
            <Skeleton className="h-7 w-12 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="p-xs">
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    </div>
  );
};

export const ProviderItemSkeletonList: FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProviderItemSkeleton key={index} />
      ))}
    </>
  );
};
