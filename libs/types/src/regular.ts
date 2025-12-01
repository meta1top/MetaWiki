export const REGULAR_EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

export const REGULAR_URL = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'*+,;=.]+$/;

export const REGULAR_USERNAME = /^[a-zA-Z]([a-zA-Z0-9_]+)?$/;

export const REGULAR_PASSWORD =
  /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~].*).{6,18}$/;

export const REGULAR_CODE = /^\d{6}$/;

export const REGULAR_PHONE = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;

export const REGULAR_NUMBER = /^(0|[1-9][0-9]*)$/;

export const CODE = /^\d{6}$/;

export const REGULAR_WIKI_PATH = /^[a-z][a-z0-9_]*$/;