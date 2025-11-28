# 服务端全局默认行为

## 接口返回

所有的数据都会被包装成如下结构：

```json
{
    "code": 0,
    "success": true,
    "message": "success",
    "data": {
        "enable": false
    },
    "timestamp": "2025-11-28T07:58:02.212Z",
    "path": "/api/account/otp/status"
}
```

业务只需要返回 `data` 部分，如：

```json
{
  "enable": false
}
```


## Service 处理

- 返回 Dto 声明的格式
- 遇到错误，抛出异常，框架会全局包装后

### 如何抛出异常

#### code 定义
在各自模块的 shared 定义。

libs/repository/src/shared/repository.error-code.ts 示例：
```typescript
import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  REPOSITORY_NOT_FOUND: { code: 1000, message: "知识库未找到" },
} as const;
```

#### throw 错误

```typescript
...
import { AppError } from "@meta-1/nest-common";

  async register(dto: RegisterDto): Promise<TokenDto> {
    ...
    if (existingAccount) {
      throw new AppError(ErrorCode.ACCOUNT_EXISTS);
    }
    ...
  }
```


