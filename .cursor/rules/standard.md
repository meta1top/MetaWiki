# 编码规范

## 技术栈

这是一套基于 Nodejs 的 Monorepo 全栈工程，主要的技术栈为：
1. 后端 Nestjs
2. 前端 Nextjs

## 工程结构

```
wiki/
├── apps/
│   ├── server/        # 后端入口
│   └── web/           # 前端应用
├── libs/
│   ├── account/       # 后端模块：账号
│   ├── repository/    # 后端模块：知识库
│   └── types/         # 前后端共享的类型
├── locales/           # 国际化文件
├── scripts/           # 工具脚本
└── README.md          # 本文件
```

## 使用指南

- [接口的定义与使用](./api.md)
- [服务端全局默认行为](./global.md)
