import type { LoginData } from "@meta-1/wiki-types";

export interface Token {
  token: string;
  expiresIn: number;
}

export type LoginRestData = {
  code?: string;
} & LoginData;
