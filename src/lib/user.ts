import { retrieveLaunchParams } from "@telegram-apps/sdk";

export const getUserAccessToken = () => {
  const { initDataRaw } = retrieveLaunchParams();

  return initDataRaw;
};
