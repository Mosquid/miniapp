"use client";

import { getUserAccessToken } from "./user";

export type ServiceFetch = typeof fetch;

export const AUTH_STORAGE_KEY = "auth_token";

const serviceFetch = (url: string, params: RequestInit) => {
  const tmaHeader = getUserAccessToken();
  params.headers = {
    ...params.headers,
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

export default serviceFetch;
