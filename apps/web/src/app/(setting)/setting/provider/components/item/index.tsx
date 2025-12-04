import { type ReactElement, useMemo, useState } from "react";
import { EllipsisVerticalIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Action,
  Avatar,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@meta-1/design";
import type { ModelProvider } from "@meta-1/wiki-types";
import { useModelType, useProviderPlatform } from "@/hooks";
import { ProviderItemModels } from "./models";

export type ProviderItemProps = {
  provider: ModelProvider;
  onEdit?: (provider: ModelProvider) => void;
  onDelete?: (provider: ModelProvider) => void;
};

export const ProviderItem = ({ provider, onEdit, onDelete }: ProviderItemProps) => {
  const { t } = useTranslation();
  const platforms = useProviderPlatform();
  const platform = platforms.find((p) => p.key === provider.platform);
  const { getModelTypeLabel } = useModelType();
  const [open, setOpen] = useState(false);

  const typeBadges = useMemo(() => {
    if (!provider.modelTypes || provider.modelTypes.length === 0) {
      return [];
    }

    const badges: ReactElement[] = [];
    const hasLLM = provider.modelTypes.includes("LLM");

    if (hasLLM) {
      badges.push(
        <Badge className="bg-card text-xs uppercase" key="llm" variant="outline">
          {t("LLM")}
        </Badge>,
        <Badge className="bg-card text-xs uppercase" key="chat" variant="outline">
          {t("Chat")}
        </Badge>,
      );
    }

    provider.modelTypes.forEach((type) => {
      if (type !== "LLM") {
        badges.push(
          <Badge className="bg-card uppercase" key={type} variant="outline">
            {getModelTypeLabel(type)}
          </Badge>,
        );
      }
    });

    return badges;
  }, [provider.modelTypes, t, getModelTypeLabel]);

  const handleEdit = () => {
    setOpen(false);
    onEdit?.(provider);
  };

  const handleDelete = () => {
    setOpen(false);
    onDelete?.(provider);
  };

  return (
    <div className="flex flex-col rounded-md border border-card bg-card hover:border-border">
      <div className="flex flex-col gap-sm border-b p-md">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-xs">
            <Avatar className="size-6" fallback={platform?.name} src={platform?.icon} />
            <span>{platform?.name}</span>
          </div>
          <div>
            <DropdownMenu onOpenChange={setOpen} open={open}>
              <DropdownMenuTrigger asChild>
                <Action>
                  <EllipsisVerticalIcon className="size-4" />
                </Action>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>{t("编辑")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete} variant="destructive">
                  {t("删除")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="line-clamp-1 text-muted-foreground text-sm">{provider.description}</div>
        {typeBadges.length > 0 && <div className="flex items-center gap-1">{typeBadges}</div>}
      </div>
      <div className="p-xs">
        <ProviderItemModels provider={provider} />
      </div>
    </div>
  );
};
