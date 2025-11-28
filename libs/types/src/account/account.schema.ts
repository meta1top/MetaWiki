import { z } from "zod";

import { CODE, REGULAR_CODE, REGULAR_PASSWORD } from "../regular";

// 公共基础注册 Schema (email, code, password - 仅非空验证)
export const BaseRegisterSchema = z.object({
  email: z.string().email({ message: "邮箱格式不正确" }).describe("邮箱"),
  code: z.string().min(1, "请输入验证码").regex(REGULAR_CODE, "验证码格式不正确").describe("验证码"),
  password: z.string().min(1, "请输入密码").describe("密码"),
});

// 前端注册 Schema (增强密码格式验证 + password2 + 一致性检查)
export const RegisterSchema = BaseRegisterSchema.omit({ password: true }) // 移除基础的 password
  .extend({
    password: z.string().min(1, "请输入密码").regex(REGULAR_PASSWORD, "密码格式不正确").describe("密码"),
    password2: z.string().min(1, "请再次输入密码").regex(REGULAR_PASSWORD, "密码格式不正确").describe("确认密码"),
  })
  .superRefine(({ password, password2 }, ctx) => {
    if (password !== password2) {
      ctx.addIssue({
        code: "custom",
        path: ["password2"],
        message: "两次密码输入不一致",
      });
    }
  });

export type RegisterData = z.infer<typeof RegisterSchema>;

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

export const BindAtlassianSchema = z.object({
  email: z.string().email({ message: "邮箱格式不正确" }).describe("邮箱"),
  accessToken: z.string().describe("API 令牌"),
});

export type BindAtlassianData = z.infer<typeof BindAtlassianSchema>;

export const PasswordChangeSchema = z
  .object({
    originPassword: z.string().min(1).regex(REGULAR_PASSWORD).describe("原密码"),
    password: z.string().min(1).regex(REGULAR_PASSWORD).describe("新密码"),
    passwordConfirm: z.string().min(1).regex(REGULAR_PASSWORD).describe("确认新密码"),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "两次密码输入不一致",
      });
    }
  });

export type PasswordFormData = z.infer<typeof PasswordChangeSchema>;
