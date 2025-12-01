# 前端交互

## 技术栈

### 核心框架
- **Next.js** (App Router) - React 全栈框架
- **TypeScript** - 类型安全
- **React** - UI 库

### 状态管理
- **Jotai** - 原子化状态管理库，用于客户端状态
- **@tanstack/react-query** - 服务端状态管理，数据获取和缓存
- **@tanstack/react-query-devtools** - React Query 开发工具

### UI 组件库
- **@meta-1/design** - 自定义组件库（主要 UI 组件）
- **@meta-1/editor** - 自定义编辑器组件库

### 样式方案
- **Tailwind CSS v4** - 原子化 CSS 框架（使用新的 @theme 语法）
- **PostCSS** - CSS 后处理器
- **Autoprefixer** - CSS 自动前缀

### 表单处理
- **react-hook-form** - 表单状态管理和验证

### 国际化
- **i18next** - 国际化框架
- **react-i18next** - React i18next 集成
- **i18next-browser-languagedetector** - 浏览器语言检测
- **i18next-react-postprocessor** - i18next 后处理器

### 主题管理
- **next-themes** - Next.js 主题切换（支持暗色模式）

### URL 状态管理
- **nuqs** - Next.js URL 状态管理库

### 工具库
- **es-toolkit** - 工具函数库
- **cookies-next** - Next.js Cookie 管理
- **js-cookie** - Cookie 操作库
- **jsencrypt** - RSA 加密库

### 图片处理
- **cropperjs** - 图片裁剪库
- **react-cropper** - React 图片裁剪组件

### 其他
- **input-otp** - OTP 输入组件
- **ogl** - WebGL 库（用于背景效果）
- **@svgr/webpack** - SVG 转 React 组件

## 组件库

`@meta-1/design` 是我们基于 `shadcn/ui` 提供了一些高阶组件。

`@meta-1/design` 的入口文件导出了一下组件：
```typescript
// others
export { toast } from "sonner";

// shadcn/ui
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@meta-1/design/components/ui/input-otp";
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/ui/breadcrumb";
export { Calendar } from "./components/ui/calendar";
export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./components/ui/command";
export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./components/ui/context-menu";
export * from "./components/ui/dropdown-menu";
export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "./components/ui/hover-card";
export { Input } from "./components/ui/input";
export * from "./components/ui/navigation-menu";
export {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
export { Progress } from "./components/ui/progress";
export {
  RadioGroup,
  RadioGroupItem,
} from "./components/ui/radio-group";
export {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
export { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
export { Separator } from "./components/ui/separator";
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
export { Skeleton } from "./components/ui/skeleton";
// base
export { Toaster } from "./components/ui/sonner";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
export { Textarea } from "./components/ui/textarea";
// advanced components
export type { ActionProps } from "./components/uix/action";
export { Action } from "./components/uix/action";
export type { AlertProps } from "./components/uix/alert";
export { Alert } from "./components/uix/alert";
export type { ConfirmProps } from "./components/uix/alert-dialog";
export { useAlert } from "./components/uix/alert-dialog";
export type { AvatarProps } from "./components/uix/avatar";
export { Avatar } from "./components/uix/avatar";
export type { BadgeProps } from "./components/uix/badge";
export { Badge } from "./components/uix/badge";
export type { BreadcrumbsItemProps, BreadcrumbsProps } from "./components/uix/breadcrumbs";
export { Breadcrumbs, BreadcrumbsItem } from "./components/uix/breadcrumbs";
export type { BroadcastChannelProviderProps } from "./components/uix/broadcast-channel-context";
export { BroadcastChannelProvider, useBroadcastChannel } from "./components/uix/broadcast-channel-context";
export type { ButtonProps } from "./components/uix/button";
export { Button } from "./components/uix/button";
export type { CardProps } from "./components/uix/card";
export { Card } from "./components/uix/card";
export type { CheckboxProps } from "./components/uix/checkbox";
export { Checkbox } from "./components/uix/checkbox";
export type { CheckboxGroupOptionProps, CheckboxGroupProps } from "./components/uix/checkbox-group";
export { CheckboxGroup } from "./components/uix/checkbox-group";
export type { ComboSelectOptionProps, ComboSelectProps } from "./components/uix/combo-select";
export { ComboSelect } from "./components/uix/combo-select";
export type { ConfigProviderProps } from "./components/uix/config-provider";
export { ConfigProvider } from "./components/uix/config-provider";
export type { DataTableColumn, DataTableProps } from "./components/uix/data-table";
export { DataTable } from "./components/uix/data-table";
export type { DatePickerProps } from "./components/uix/date-picker";
export { DatePicker } from "./components/uix/date-picker";
export type { DateRangePickerProps } from "./components/uix/date-range-picker";
export { DateRangePicker } from "./components/uix/date-range-picker";
export type { DialogProps } from "./components/uix/dialog";
export { Dialog } from "./components/uix/dialog";
export type { DividerProps } from "./components/uix/divider";
export { Divider } from "./components/uix/divider";
export type { DropdownMenuItemProps, DropdownProps } from "./components/uix/dropdown";
export { Dropdown } from "./components/uix/dropdown";
export type { EmptyProps } from "./components/uix/empty";
export { Empty } from "./components/uix/empty";
export type { FilterItemProps, FiltersProps } from "./components/uix/filters";
export { Filters } from "./components/uix/filters";
export type { FieldItem, FormInstance, FormProps, RenderProps } from "./components/uix/form";
export { Form, FormItem } from "./components/uix/form";
export type { ImageProps } from "./components/uix/image";
export { Image } from "./components/uix/image";
export type { LoadingProps } from "./components/uix/loading";
export { Loading } from "./components/uix/loading";
export { useMessage } from "./components/uix/message";
export type { PaginationProps } from "./components/uix/pagination";
export { Pagination } from "./components/uix/pagination";
export type { SimpleRadioGroupOptionProps, SimpleRadioGroupProps } from "./components/uix/radio-group";
export { SimpleRadioGroup } from "./components/uix/radio-group";
export type { ResultProps } from "./components/uix/result";
export { Result } from "./components/uix/result";
export type { SelectOptionProps, SelectProps } from "./components/uix/select";
export { Select } from "./components/uix/select";
export { Space } from "./components/uix/space";
export type { SpinProps } from "./components/uix/spin";
export { Spin } from "./components/uix/spin";
export type { StepsItemProps, StepsProps } from "./components/uix/steps";
export { Steps, StepsItem } from "./components/uix/steps";
export type { SwitchProps } from "./components/uix/switch";
export { Switch } from "./components/uix/switch";
export type { TagsInputProps } from "./components/uix/tags-input";
export { TagsInput } from "./components/uix/tags-input";
export type { TooltipProps } from "./components/uix/tooltip";
export { Tooltip } from "./components/uix/tooltip";
export type { TreeData, TreeProps } from "./components/uix/tree";
export { Tree } from "./components/uix/tree";
export type { TreeSelectProps } from "./components/uix/tree-select";
export { TreeSelect } from "./components/uix/tree-select";
export type { TreeTableColumn, TreeTableProps } from "./components/uix/tree-table";
export { TreeTable } from "./components/uix/tree-table";
export type { UploaderProps } from "./components/uix/uploader";
export { Uploader } from "./components/uix/uploader";
export type { HandleProps, UploadFile } from "./components/uix/uploader/type";
export type { ValueFormatterProps } from "./components/uix/value-formatter";
export { register, ValueFormatter } from "./components/uix/value-formatter";
// custom hooks
export * from "./hooks";
// utils
export * from "./lib";
```

- `@meta-1/design` 是通过源码发布的，你可以查看 `node_modules/@meta-1/design/**` 获取你需要的组件的实现逻辑。
- 如果 `@meta-1/design` 存在 `shadcn/ui` 新增的组件，你可以提醒用户。

## 项目结构

- `src/app/` - Next.js App Router 页面和路由
- `src/components/` - 可复用组件
- `src/hooks/` - 自定义 Hooks
- `src/state/` - Jotai 状态定义
- `src/rest/` - API 请求封装
- `src/utils/` - 工具函数
- `src/config/` - 配置文件
- `src/types/` - TypeScript 类型定义