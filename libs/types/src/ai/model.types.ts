/**
 * 模型类型枚举
 */
export enum ModelType {
  /** 大语言模型 */
  LLM = "LLM",
  /** 文本嵌入 */
  TEXT_EMBEDDING = "TEXT_EMBEDDING",
  /** 重排序 */
  RERANK = "RERANK",
  /** 语音转文本 */
  SPEECH2TEXT = "SPEECH2TEXT",
  /** 文本转语音 */
  TTS = "TTS",
}

/**
 * 模型提供商平台枚举
 */
export enum ModelProviderPlatform {
  /** Deepseek */
  DEEPSEEK = "DEEPSEEK",
  /** 阿里百炼 */
  ALIBABA_TONGYI = "ALIBABA_TONGYI",
  /** 火山方舟 */
  VOLCANO_ARK = "VOLCANO_ARK",
}
