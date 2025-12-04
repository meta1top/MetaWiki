import { useTranslation } from "react-i18next";

/**
 * 获取模型类型的翻译文本
 */
export const useModelType = () => {
  const { t } = useTranslation();

  const getModelTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      LLM: t("LLM"),
      TEXT_EMBEDDING: t("Text Embedding"),
      RERANK: t("Rerank"),
      SPEECH2TEXT: t("Speech to Text"),
      TTS: t("Text to Speech"),
    };

    return typeMap[type] || type;
  };

  return {
    getModelTypeLabel,
  };
};
