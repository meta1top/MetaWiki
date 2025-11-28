import type { PasswordFormData } from "@meta-1/wiki-types";
import { post } from "@/utils/rest";

export const change = (data: PasswordFormData) =>
  post<unknown, PasswordFormData>("@main/account/password/change", data);
