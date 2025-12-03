
# 接口的定义与使用

## 定义

接口设计前端调用，因此设计的出入参需要按照如下方式进行定义：

### 第一步：定义类型
在 types 里定义 Schema 和 Type，并且按照模块进行组织。

```
libs/types/
├── index.ts                    # 统一导出
├── {module}/                    # 模块目录（如 account、user、order 等）
│   ├── index.ts                # 模块统一导出
│   └── {module}.schema.ts       # 模块相关的 Schema 和 Type
└── ...
```

libs/types/index.ts 示例：
```typescript
export * from "./{module}";  // 替换 {module} 为实际模块名
export * from "./common.types";
export * from "./regular";
```

libs/types/{module}/index.ts 示例（以 account 模块为例）：
```typescript
export * from "./account.schema";
export * from "./account.types";
export * from "./account-otp.schema";
```

libs/types/{module}/{module}.schema.ts 示例（以 account 模块为例）：
```typescript
import { z } from "zod";

import { CODE, REGULAR_CODE, REGULAR_PASSWORD } from "../regular"; // 按需定义

export const LoginSchema = z.object({
  email: z.string().email({ message: "邮箱格式不正确" }).describe("邮箱"),
  password: z.string().min(1, "请输入密码").describe("密码"),
  otpCode: z.string().regex(CODE, "请输入6位数字验证码").optional().describe("OTP验证码"),
});

export type LoginData = z.infer<typeof LoginSchema>;

export const TokenSchema = z.object({
  token: z.string().describe("令牌"),
  expiresIn: z.number().describe("过期时间"),
});

export type Token = z.infer<typeof TokenSchema>;
```

### 第二步：定义 DTO

types 是一个共享库，所以不能使用后端的技术，只能使用前后端都可以用的技术，所以，如果要为接口定义对象声明，后端需要声明自己的DTO。

以 libs/{module}/ 为例（以下示例使用 account 模块）

```
libs/{module}/
├── index.ts
├── dto/
│   ├── index.ts                    # 统一导出
│   ├── {module}-token.dto.ts       # Token数据传输对象
│   └── {module}.dto.ts             # 数据传输对象
├── entity/                         # 数据库实体
└── ...
```

libs/{module}/dto}/{module}.dto.ts 示例（以 account 模块为例）：
```typescript
import { createZodDto } from "nestjs-zod";

import { BaseRegisterSchema, LoginSchema } from "@meta-1/{project}-types"; // 替换 {project} 为实际项目名称，如 wiki、authub

export class RegisterDto extends createZodDto(BaseRegisterSchema) {}

export class LoginDto extends createZodDto(LoginSchema) {}
```

### 第三步：在 Service pick 数据
```typescript
// ProfileDto 定义方式一致
ProfileDto.parse({
  ...
})
```

### 第四步：定义 Controller

```
libs/{module}/
├── index.ts
├── controller/
│   ├── index.ts                    # 统一导出
│   ├── {module}-token.controller.ts        # Token控制器
│   └── {module}.controller.ts              # 模块控制器
├── entity/                         # 数据库实体
└── ...
```

libs/{module}/controller/{module}.controller.ts 示例（以 account 模块为例）：
```typescript
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { md5 } from "@meta-1/nest-common";
import { CurrentUser, Public, SessionService, type SessionUser } from "@meta-1/nest-security";
import { LoginDto, RegisterDto, ProfileDto } from "../dto";
import { AccountService } from "../service";

@ApiTags("AccountController")
@Controller("/api/account")
export class AccountController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly accountService: AccountService,
  ) {}

  @Get("/profile")
  @ApiResponse({
    status: 200,
    type: ProfileDto,  // 定义方式与LoginDto一致
  })
  profile(@CurrentUser() user: SessionUser) {
    return this.accountService.findByEmail(user.username);
  }

  @Public()
  @Post("/register")
  register(@Body() dto: RegisterDto) {
    return this.accountService.register(dto);
  }

  @Post("/logout")
  logout(@CurrentUser() user: SessionUser) {
    return this.sessionService.logout(md5(user.jwtToken));
  }

  @Public()
  @Post("/login")
  login(@Body() dto: LoginDto) {
    return this.accountService.login(dto);
  }
}
```

注意：
1. 获取信息类（通常是GET方法），一定要给出 type 或 schema
2. 创建或更新信息类（通常是POST/PUT/DELETE等方法），没有特殊要求，不返回数据。
3. entity 通常不直接返回，所有返回给客户端的，都是采用schema + dto 的方式。
4. 客户端使用 schema + type 的方式对等接受
5. ApiResponse 没有 type 或 schema 的时候，不需要添加
5. ApiResponse 有 type 时候，不需要 description，除非有多种情况。

## 使用

### 定义 rest

在 apps/web/src/rest 里定义。

apps/web/src/rest/{module}.ts 示例（以 account 模块为例）：
```typescript
import type { LoginData, Profile, Token } from "@meta-1/{project}-types"; // 替换 {project} 为实际项目名称
import { RegisterData } from "@meta-1/{project}-types";
import { get, post } from "@/utils/rest";

export const login = (data: LoginData) => post<Token, LoginData>("@api/account/login", data);

export const profile = () => get<Profile, null>("@api/account/profile", null);

export const logout = () => post("@api/account/logout");

export const register = (data: RegisterData) => post<Token, RegisterData>("@api/account/register", data);
```

### 使用 tanstack query

我们封装了 tanstack query，包装了全局错误处理。

在 `apps/web/src/hooks` 提供了：
- useQuery
- useMutation 

使用示例（以注册页面为例）：
```typescript
"use client";

import { useState } from "react";
import cloneDeep from "lodash/cloneDeep";
import { useTranslation } from "react-i18next";

import { Button, Form, FormItem, Input } from "@meta-1/design";
import { SendCodeData } from "@meta-1/nest-types";
import { RegisterData, RegisterSchema } from "@meta-1/{project}-types"; // 替换 {project} 为实际项目名称
import { EmailCodeInput } from "@/components/common/input/email-code";
import { useEncrypt, useMutation } from "@/hooks";
import { register } from "@/rest/account";
import { sendEmailCode } from "@/rest/public";
import { setToken } from "@/utils/token";

export const RegisterPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RegisterData | undefined>();
  const encrypt = useEncrypt();

  const { mutate, isPending } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      if (data) {
        setToken(data);
        location.href = "/";
      }
    },
  });

  const onSubmit = (data: RegisterData) => {
    const cloneData = cloneDeep(data);
    cloneData.password2 = "";
    cloneData.password = encrypt(cloneData.password);
    mutate(cloneData);
  };

  return (
    <div className="w-[360px]">
      <Form<RegisterData>
        onSubmit={onSubmit}
        onValuesChange={(data) => setFormData(data as RegisterData)}
        schema={RegisterSchema}
      >
        <FormItem label={t("邮箱")} name="email">
          <Input placeholder={t("请输入正确的邮箱")} />
        </FormItem>
        <FormItem label={t("邮箱验证码")} name="code">
          <EmailCodeInput<SendCodeData>
            api={sendEmailCode}
            data={{ email: formData?.email || "", action: "register" }}
            needEmail={true}
            placeholder={t("请输入邮箱验证码")}
          />
        </FormItem>
        <FormItem label={t("密码")} name="password">
          <Input placeholder={t("请输入密码")} type="password" />
        </FormItem>
        <FormItem label={t("确认密码")} name="password2">
          <Input placeholder={t("请再次输入密码")} type="password" />
        </FormItem>
        <Button className="mt-sm" loading={isPending} long type="submit">
          {t("注册")}
        </Button>
      </Form>
    </div>
  );
};

```

如果需要 SSR 加载数据

在 `apps/web/src/utils/query` 提供了：
- getQueryClient
- prefetchQuery

使用示例：
```typescript
// state.ts 
import { dehydrate } from "@tanstack/react-query";

import { profile } from "@/rest/account";
import { getCommonConfig } from "@/rest/public";
import { getQueryClient, prefetchQuery } from "@/utils/query";

export const dehydratedState = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    prefetchQuery(queryClient, {
      queryKey: ["profile"],
      queryFn: () => profile(),
    }),
    prefetchQuery(queryClient, {
      queryKey: ["common:config"],
      queryFn: () => getCommonConfig(),
    }),
  ]);
  return dehydrate(queryClient);
};

// demo.tsx
const Layout: FC<LayoutProps> = async (props) => {
  const locale = await getLocale();
  const theme = await getTheme();
  const state = await dehydratedState();
  return (
    <HTMLLayout>
      <RootLayout locale={locale} theme={theme}>
        <HydrationBoundary state={state}>
          <ServerStateLoader>{props.children}</ServerStateLoader>
        </HydrationBoundary>
      </RootLayout>
    </HTMLLayout>
  );
};
```