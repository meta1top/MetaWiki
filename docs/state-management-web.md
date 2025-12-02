# 状态管理文档 - Web

## 概述

MetaWiki Web 使用 Jotai 进行客户端状态管理，TanStack Query 进行服务端数据缓存。

**状态管理库**: Jotai 2.10.2  
**数据获取**: TanStack Query 5.80.3  
**状态位置**: `apps/web/src/state/`

---

## Jotai 原子状态

### 1. 公共状态 (Public State)

**文件**: `apps/web/src/state/public.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `localeState` | `atom<string>` | 当前语言设置，默认 "zh-cn" |

---

### 2. 配置状态 (Config State)

**文件**: `apps/web/src/state/config.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `commonConfigState` | `atom<CommonConfig \| undefined>` | 公共配置（RSA公钥等） |

---

### 3. 用户资料状态 (Profile State)

**文件**: `apps/web/src/state/profile.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `isLoginState` | `atom<boolean>` | 用户登录状态 |
| `profileState` | `atom<Profile \| undefined>` | 用户资料信息 |

---

### 4. 知识库状态 (Wiki State)

**文件**: `apps/web/src/state/wiki.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `currentWikiRepoState` | `atom<WikiRepoDetail \| undefined>` | 当前选中的知识库详情 |

---

### 5. 布局状态 (Layout State)

**文件**: `apps/web/src/state/layout.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `layoutState` | `atom<LayoutConfig>` | 布局配置（侧边栏、主题等） |

---

### 6. 访问控制状态 (Access State)

**文件**: `apps/web/src/state/access.ts`

| 原子 | 类型 | 说明 |
|------|------|------|
| `accessState` | `atom<AccessConfig>` | 访问权限配置 |

---

## TanStack Query 查询

TanStack Query 用于管理服务端数据，提供缓存、同步、重试等功能。

**查询客户端**: `apps/web/src/utils/query.ts`  
**查询 Hooks**: `apps/web/src/hooks/use.query.ts`

### 主要查询

- **用户资料**: `useProfile()`
- **知识库列表**: `useWikiRepoList()`
- **知识库详情**: `useWikiRepoDetail(path)`
- **公共配置**: `useCommonConfig()`

---

## 状态初始化

### 服务端状态注入

使用 `ServerStateLoader` 组件在服务端预加载状态：

```tsx
<ServerStateLoader>
  {children}
</ServerStateLoader>
```

**文件**: `apps/web/src/components/common/server-state-loader/`

### 原子状态水合

使用 `AtomsHydrate` 组件将服务端状态注入到客户端原子：

```tsx
<AtomsHydrate>
  {children}
</AtomsHydrate>
```

**文件**: `apps/web/src/components/common/atoms-hydrate/`

---

## 状态持久化

- **语言设置**: 通过 Cookie 持久化
- **主题设置**: 通过 localStorage 持久化（next-themes）
- **用户 Token**: 通过 Cookie 存储（httpOnly）

---

## 状态更新模式

### 1. 直接更新原子

```typescript
import { useSetAtom } from 'jotai';
import { localeState } from '@/state/public';

const setLocale = useSetAtom(localeState);
setLocale('en');
```

### 2. 通过 TanStack Query Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const mutation = useMutation({
  mutationFn: updateProfile,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['profile'] });
  }
});
```

---

## 状态同步

### 服务端到客户端

- 使用 `ServerStateLoader` 在服务端获取数据
- 通过 `AtomsHydrate` 注入到客户端原子
- 使用 `HydrationBoundary` 同步 TanStack Query 状态

### 客户端到服务端

- 通过 TanStack Query Mutations 更新服务端数据
- 自动同步到本地缓存和原子状态

---

## 最佳实践

1. **原子状态**: 用于 UI 状态、用户偏好等客户端状态
2. **TanStack Query**: 用于服务端数据、API 响应等
3. **避免重复**: 不要在原子和 Query 中存储相同的数据
4. **类型安全**: 所有状态都有 TypeScript 类型定义

