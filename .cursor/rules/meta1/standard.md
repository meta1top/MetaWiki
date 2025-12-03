# 编码规范

## 适用范围

本文档定义了基于 Nodejs 的 Monorepo 全栈工程的通用编码规范，适用于所有使用相同技术栈的项目。

## 技术栈

这是一套基于 Nodejs 的 Monorepo 全栈工程，主要的技术栈为：
1. 后端 Nestjs
2. 前端 Nextjs

## 工程结构

```
{project}/
├── apps/
│   ├── server/        # 后端入口
│   └── web/           # 前端应用
├── libs/
│   ├── {module}/      # 后端模块（如 account、user、order 等）
│   ├── ...            # 其他后端模块
│   └── types/         # 前后端共享的类型
├── locales/           # 国际化文件
├── scripts/           # 工具脚本
└── README.md          # 本文件
```

注意：
- `{project}` 为项目名称占位符，实际使用时替换为具体项目名称（如 wiki、authub 等）
- `{module}` 为模块名称占位符，实际使用时替换为具体模块名称（如 account、user、order 等）

## 使用指南

- [接口的定义与使用](./api.md)
- [服务端全局默认行为](./global.md)
- [前端组件使用](./ui.md)
- [用户习惯](./user.md)
