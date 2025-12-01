"use client";

import type { FC } from "react";
import Link from "next/link";

import { Avatar, Badge, Card, time } from "@meta-1/design";
import type { WikiRepo } from "@meta-1/wiki-types";

export type RepoItemProps = {
  repo: WikiRepo;
};

export const RepoItem: FC<RepoItemProps> = ({ repo }) => {
  const displayTime = repo.updateTime || repo.createTime;

  return (
    <Link href={`/wiki/${repo.path}`}>
      <Card className="cursor-pointer p-0 transition-colors hover:bg-accent" contentClassName="!p-md" shadow={false}>
        <div className="flex items-start gap-sm">
          <Avatar
            alt={repo.name}
            className="size-22 shrink-0 rounded-lg"
            fallback={repo.name}
            fallbackClassName="rounded-lg bg-primary text-primary-foreground"
            src={repo.cover || undefined}
          />
          <div className="min-w-0 flex-1 space-y-2xs">
            <div className="flex items-center gap-xs">
              <span className="truncate font-medium text-md">{repo.name}</span>
              <Badge variant="info">{repo.path}</Badge>
            </div>
            <div className="line-clamp-2 min-h-[2.5rem] text-muted-foreground text-xs">
              {repo.description || "\u00A0"}
            </div>
            {displayTime && <div className="text-muted-foreground text-xs">{time(displayTime)}</div>}
          </div>
        </div>
      </Card>
    </Link>
  );
};
