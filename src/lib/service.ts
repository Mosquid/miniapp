"use client";

import { getUserAccessToken } from "./user";

export type ServiceFetch = typeof fetch;

export const AUTH_STORAGE_KEY = "auth_token";

const serviceFetch = (url: string, params: RequestInit) => {
  const tmaHeader = getUserAccessToken();
  params.headers = {
    ...params.headers,
    "Content-Type": "application/json",
    authorization: `tma ${tmaHeader}`,
  };

  return fetch(url, params);
};

export const get = (url: string, params: RequestInit) => {
  return serviceFetch(url, {
    ...params,
    method: "GET",
  });
};

export const post = (url: string, params: RequestInit) => {
  return serviceFetch(url, {
    ...params,
    method: "POST",
  });
};

export default serviceFetch;
