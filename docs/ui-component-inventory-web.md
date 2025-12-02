# UI 组件清单 - Web

## 概述

MetaWiki Web 使用 React 19 + Next.js 16 构建，UI 组件基于 `@meta-1/design` 组件库和 Radix UI。

**组件库**: @meta-1/design 0.0.178  
**基础组件**: Radix UI  
**样式**: Tailwind CSS 3.4.0  
**组件位置**: `apps/web/src/components/`

---

## 布局组件 (Layout Components)

### 1. RootLayout

**路径**: `components/layout/root/index.tsx`

根布局组件，提供全局 Provider：
- QueryClientProvider (TanStack Query)
- ThemeProvider (next-themes)
- I18nextProvider (i18next)
- Jotai Provider
- ConfigProvider (@meta-1/design)

---

### 2. MainLayout

**路径**: `components/layout/main/index.tsx`

主应用布局，包含：
- Header (顶部导航)
- Footer (页脚)
- Sidebar (侧边栏，可选)
- Content Area (内容区域)

**Props**:
- `active`: 当前激活的菜单项
- `container`: 是否使用容器
- `headerProps`: Header 配置
- `footerProps`: Footer 配置

---

### 3. LoginLayout

**路径**: `components/layout/login/index.tsx`

登录页面布局，包含：
- 左侧：品牌展示和特性说明（带背景动画）
- 右侧：登录表单区域

---

### 4. WikiLayout

**路径**: `components/layout/wiki/index.tsx`

知识库专用布局。

---

### 5. HTMLLayout

**路径**: `components/layout/html/index.tsx`

HTML 文档结构布局（head、meta 等）。

---

### 6. LoadingLayout

**路径**: `components/layout/loading/index.tsx`

加载状态布局。

---

## 通用组件 (Common Components)

### 1. Logo

**路径**: `components/common/logo/index.tsx`

应用 Logo 组件。

---

### 2. Breadcrumb

**路径**: `components/common/breadcrumb/`

面包屑导航组件：
- `index.tsx`: 通用面包屑
- `profile/index.tsx`: 个人资料面包屑
- `wiki/index.tsx`: 知识库面包屑

---

### 3. Page Components

**路径**: `components/common/page/`

页面相关组件：
- `index.tsx`: 主页面容器
- `header/index.tsx`: 页面头部
- `title-bar/index.tsx`: 标题栏

---

### 4. Input Components

**路径**: `components/common/input/`

输入组件：
- `code/index.tsx`: 验证码输入
- `email-code/index.tsx`: 邮箱验证码输入
- `otp/index.tsx`: OTP 输入（双因素认证）

---

### 5. Account Components

**路径**: `components/common/account/`

账号相关组件：
- `otp-info/index.tsx`: OTP 信息显示

---

### 6. Upload Components

**路径**: `components/common/cover-uploader/index.tsx`

封面图片上传组件。

---

### 7. Cropper Components

**路径**: `components/common/cropper/`

图片裁剪组件：
- `index.tsx`: 裁剪器组件
- `dialog/index.tsx`: 裁剪对话框

---

### 8. Select Components

**路径**: `components/common/select/`

选择器组件：
- `lang/index.tsx`: 语言选择器

---

### 9. Theme Components

**路径**: `components/common/theme-*`

主题相关组件：
- `theme-switcher/index.tsx`: 主题切换器
- `theme-sync-provider/index.tsx`: 主题同步 Provider

---

### 10. Server State Loader

**路径**: `components/common/server-state-loader/`

服务端状态加载器，用于在服务端预加载数据并注入到客户端状态。

---

### 11. Atoms Hydrate

**路径**: `components/common/atoms-hydrate/index.tsx`

原子状态水合组件，将服务端状态注入到客户端 Jotai 原子。

---

### 12. Tabs Title

**路径**: `components/common/tabs-title/index.tsx`

标签页标题组件。

---

### 13. Coming Soon

**路径**: `components/common/coming/index.tsx`

"即将推出"占位组件。

---

## 背景组件 (Background Components)

### Iridescence

**路径**: `components/background/iridescence/index.tsx`

虹彩背景动画组件（WebGL）。

**Props**:
- `amplitude`: 振幅
- `color`: 颜色数组
- `speed`: 速度
- `mouseReact`: 是否响应鼠标

---

## Header 子组件

**路径**: `components/layout/main/header/`

### 1. Header

**路径**: `header/index.tsx`

主 Header 组件，包含：
- Logo
- 导航菜单
- 用户菜单
- 通知

---

### 2. Menus

**路径**: `header/menus/index.tsx`

导航菜单组件。

---

### 3. Profile Menu

**路径**: `header/profile-menu/index.tsx`

用户资料菜单下拉组件：
- `account-info/index.tsx`: 账号信息
- `theme-menu/index.tsx`: 主题菜单

---

### 4. Notice

**路径**: `header/notice/index.tsx`

通知组件。

---

## Footer 组件

**路径**: `components/layout/main/footer/index.tsx`

页脚组件。

---

## 组件使用模式

### 1. 客户端组件

标记为 `"use client"` 的组件在客户端渲染，可使用 Hooks 和浏览器 API。

### 2. 服务端组件

默认组件为服务端组件，可直接访问数据库和文件系统。

### 3. 组合模式

- 布局组件组合通用组件
- 页面组件组合布局和业务组件
- 通过 Props 传递配置和状态

---

## 样式系统

- **Tailwind CSS**: 原子化 CSS 类
- **CSS Modules**: 组件级样式（如 `iridescence/style.css`）
- **主题系统**: 通过 next-themes 支持明暗主题

---

## 组件库依赖

主要使用 `@meta-1/design` 组件库，包含：
- Button
- Input
- Select
- Badge
- Breadcrumb
- 等基础 UI 组件

所有组件都支持主题切换和国际化。

