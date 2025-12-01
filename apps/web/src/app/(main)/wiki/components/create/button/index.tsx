"use client";

import type { FC } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@meta-1/design";
import { CreateDialog } from "../dialog";

export type CreateButtonProps = {
  onSuccess?: () => void;
};

export const CreateButton: FC<CreateButtonProps> = ({ onSuccess }) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)} size="sm">
        {t("创建知识库")}
      </Button>
      <CreateDialog onCancel={() => setVisible(false)} onSuccess={onSuccess} visible={visible} />
    </>
  );
};
