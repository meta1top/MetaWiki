"use client";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { ImageIcon, Upload, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Spin, Uploader, type UploadFile, useMessage } from "@meta-1/design";
import { BucketType } from "@meta-1/nest-types";
import { dataURLToFile, fileToDataURL, upload } from "@/utils/file";
import { CropperDialog } from "../cropper/dialog";

export type CoverUploaderProps = {
  value?: string | null;
  onChange?: (value?: string | null) => void;
  className?: string;
  size?: number;
};

export const CoverUploader = (props: CoverUploaderProps) => {
  const { value, onChange, className, size = 100 } = props;
  const { t } = useTranslation();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [visible, setVisible] = useState(false);
  const [fileSrc, setFileSrc] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [src, setSrc] = useState<string | null | undefined>(value ?? null);

  useEffect(() => {
    setSrc(value ?? null);
  }, [value]);

  const msg = useMessage();

  const onDropAccepted = (files: File[]) => {
    fileToDataURL(files[0]).then((src) => {
      setFileSrc(src as string);
      setVisible(true);
    });
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const { success, data, error } = await upload({
      file,
      name: file.name,
      contentType: file.type,
      bucketType: BucketType.PUBLIC,
    });
    setUploading(false);
    if (success) {
      setSrc(data!);
      onChange?.(data!);
    } else {
      msg.error(error);
    }
  };

  const onCrop = (dataURL: string) => {
    // 确保裁剪后的图片尺寸为指定大小
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      ctx?.drawImage(img, 0, 0, size, size);
      const resizedDataURL = canvas.toDataURL("image/png");
      const file = dataURLToFile(resizedDataURL, "cover.png");
      setVisible(false);
      uploadFile(file).then();
    };
    img.src = dataURL;
  };

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSrc(undefined);
    onChange?.(null);
    setFiles([]);
  };

  return (
    <div
      className={classNames(
        "group relative overflow-hidden rounded-lg border-2 border-dashed transition-all",
        src
          ? "border-border bg-background"
          : "border-muted-foreground/25 bg-muted/30 hover:border-muted-foreground/50 hover:bg-muted/50",
        "flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <>
          <img alt="cover" className="h-full w-full object-cover" src={src} />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40">
            <button
              className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 shadow-lg transition-opacity hover:bg-destructive group-hover:opacity-100"
              onClick={onRemove}
              type="button"
            >
              <X className="size-3" />
            </button>
            <Uploader
              accept={{
                "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
              }}
              maxFiles={1}
              onChange={setFiles}
              onDropAccepted={onDropAccepted}
              showButton={false}
              showFileList={false}
              value={files}
            >
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Upload className="size-5" />
                  <span className="font-medium text-xs">{t("点击更换封面")}</span>
                </div>
              </div>
            </Uploader>
          </div>
        </>
      ) : (
        <Uploader
          accept={{
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
          }}
          className="h-full w-full"
          maxFiles={1}
          onChange={setFiles}
          onDropAccepted={onDropAccepted}
          showButton={false}
          showFileList={false}
          value={files}
        >
          <div className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 p-6 transition-opacity hover:opacity-80">
            {uploading ? (
              <Spin className="size-8 text-muted-foreground" />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </Uploader>
      )}
      <CropperDialog
        aspectRatio={1}
        onCancel={() => setVisible(false)}
        onCrop={onCrop}
        src={fileSrc}
        visible={visible}
      />
    </div>
  );
};
