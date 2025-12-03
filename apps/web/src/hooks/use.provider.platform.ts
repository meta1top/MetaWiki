export const useProviderPlatform = () => {
  return [
    {
      key: "DEEPSEEK",
      name: "Deepseek",
      icon: "/assets/image/model-provider/deepseek.svg",
      description: "Deepseek is a Chinese company that provides a large language model.",
      baseUrl: "https://api.deepseek.com",
    },
    {
      key: "ALIBABA_TONGYI",
      name: "阿里百炼",
      icon: "/assets/image/model-provider/qwen.png",
      description: "阿里百炼是阿里巴巴集团旗下的智能对话平台，提供多种语言模型。",
      baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    },
    {
      key: "VOLCANO_ARK",
      name: "火山方舟",
      icon: "/assets/image/model-provider/ark.svg",
      description: "火山方舟是火山引擎旗下的智能对话平台，提供多种语言模型。",
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    },
  ];
};
