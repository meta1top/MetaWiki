"use client";

import type { FC } from "react";
import { useCallback, useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import {
  Action,
  Avatar,
  Badge,
  Button,
  Card,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormItem,
  Input,
  Textarea,
  time,
  useAlert,
  useMessage,
} from "@meta-1/design";
import { type UpdateWikiRepoData, UpdateWikiRepoSchema, type WikiRepo } from "@meta-1/wiki-types";
import { CoverUploader } from "@/components/common/cover-uploader";
import { useMutation, useProfile } from "@/hooks";
import { deleteRepo, updateRepo } from "@/rest/wiki/repo";

export type RepoItemProps = {
  repo: WikiRepo;
  onSuccess?: () => void;
};

type UpdateWikiRepoFormData = z.infer<typeof UpdateWikiRepoSchema>;

export const RepoItem: FC<RepoItemProps> = ({ repo, onSuccess }) => {
  const { t } = useTranslation();
  const profile = useProfile();
  const alert = useAlert();
  const msg = useMessage();
  const displayTime = repo.updateTime || repo.createTime;
  const isCreator = profile?.id === repo.creatorId;
  const [editVisible, setEditVisible] = useState(false);
  const form = Form.useForm<UpdateWikiRepoFormData>();

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateWikiRepoData) => updateRepo(repo.id, data),
    onSuccess: () => {
      setEditVisible(false);
      form.reset();
      msg.success(t("更新成功"));
      onSuccess?.();
    },
    onError: (error) => {
      msg.error(error.message || t("更新失败"));
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => deleteRepo(repo.id),
    onSuccess: () => {
      msg.success(t("删除成功"));
      onSuccess?.();
    },
    onError: (error) => {
      msg.error(error.message || t("删除失败"));
    },
  });

  const handleEdit = useCallback(() => {
    setEditVisible(true);
  }, []);

  const handleDelete = useCallback(() => {
    alert.confirm({
      title: t("删除知识库"),
      description: t("确定要删除知识库「{{name}}」吗？此操作不可恢复。", { name: repo.name }),
      onOk: async () => {
        deleteMutate();
        return true;
      },
    });
  }, [alert, deleteMutate, repo.name, t]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const editFooter = (
    <div className="flex justify-end gap-2">
      <Button loading={isUpdating} onClick={() => form.submit()}>
        {t("确定")}
      </Button>
      <Button disabled={isUpdating} onClick={() => setEditVisible(false)} variant="outline">
        {t("取消")}
      </Button>
    </div>
  );

  return (
    <>
      <Card
        className="group relative cursor-pointer p-0 transition-colors hover:bg-accent"
        contentClassName="!p-md"
        shadow={false}
      >
        <Link href={`/wiki/${repo.path}`}>
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
        </Link>
        {isCreator && (
          <div
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            data-menu-trigger
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={handleMenuClick}>
                <Action className="!outline-none">
                  <MoreVertical className="size-4" />
                </Action>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 size-4" />
                  {t("编辑")}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 size-4" />
                  {t("删除")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </Card>
      <Dialog
        footer={editFooter}
        maskClosable={false}
        onCancel={() => setEditVisible(false)}
        title={t("编辑知识库")}
        visible={editVisible}
      >
        <Form<UpdateWikiRepoFormData>
          defaultValues={{
            name: repo.name,
            description: repo.description || "",
            cover: repo.cover || "",
          }}
          form={form}
          key={editVisible ? `edit-${repo.id}` : undefined}
          onSubmit={(data) => updateMutate(data)}
          schema={UpdateWikiRepoSchema}
        >
          <FormItem label={t("知识库名称")} name="name">
            <Input placeholder={t("请输入知识库名称")} />
          </FormItem>
          <FormItem label={t("描述")} name="description">
            <Textarea placeholder={t("请输入描述")} />
          </FormItem>
          <FormItem label={t("封面")} name="cover">
            <CoverUploader />
          </FormItem>
        </Form>
      </Dialog>
    </>
  );
};
