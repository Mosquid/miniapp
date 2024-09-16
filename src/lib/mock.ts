"use client";

import { mockTelegramEnv, parseInitData } from "@telegram-apps/sdk";

const initDataRaw = new URLSearchParams([
  [
    "user",
    JSON.stringify({
      id: 191432373,
      first_name: "Andrew",
      last_name: "Rogue",
      username: "PavlyshkoS",
      language_code: "en",
      photo_url: "https://t.me/i/userpic/320/rogue.jpg",
      is_premium: true,
      allows_write_to_pm: true,
    }),
  ],
  ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
  ["auth_date", "1725300718"],
  ["start_param", "debug"],
  ["chat_type", "sender"],
  ["chat_instance", "8428209589180549439"],
]).toString();

export function getMockTelegramEnv() {
  mockTelegramEnv({
    themeParams: {
      accentTextColor: "#6ab2f2",
      bgColor: "#17212b",
      buttonColor: "#5288c1",
      buttonTextColor: "#ffffff",
      destructiveTextColor: "#ec3942",
      headerBgColor: "#17212b",
      hintColor: "#708499",
      linkColor: "#6ab3f3",
      secondaryBgColor: "#232e3c",
      sectionBgColor: "#17212b",
      sectionHeaderTextColor: "#6ab3f3",
      subtitleTextColor: "#708499",
      textColor: "#f5f5f5",
    },
    initData: parseInitData(initDataRaw),
    initDataRaw,
    version: "7.2",
    platform: "tdesktop",
  });
}
