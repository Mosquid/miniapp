"use client";

import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import WebApp from "@twa-dev/sdk";
import {
  postEvent,
  initMiniApp,
  retrieveLaunchParams,
} from "@telegram-apps/sdk";

// const initDataRaw = new URLSearchParams([
//   [
//     "user",
//     JSON.stringify({
//       id: 99281932,
//       first_name: "Andrew",
//       last_name: "Rogue",
//       username: "rogue",
//       language_code: "en",
//       is_premium: true,
//       allows_write_to_pm: true,
//     }),
//   ],
//   ["hash", "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31"],
//   ["auth_date", "1725300718"],
//   ["start_param", "debug"],
//   ["chat_type", "sender"],
//   ["chat_instance", "8428209589180549439"],
// ]).toString();

// mockTelegramEnv({
//   themeParams: {
//     accentTextColor: "#6ab2f2",
//     bgColor: "#17212b",
//     buttonColor: "#5288c1",
//     buttonTextColor: "#ffffff",
//     destructiveTextColor: "#ec3942",
//     headerBgColor: "#17212b",
//     hintColor: "#708499",
//     linkColor: "#6ab3f3",
//     secondaryBgColor: "#232e3c",
//     sectionBgColor: "#17212b",
//     sectionHeaderTextColor: "#6ab3f3",
//     subtitleTextColor: "#708499",
//     textColor: "#f5f5f5",
//   },
//   initData: parseInitData(initDataRaw),
//   initDataRaw,
//   version: "7.2",
//   platform: "tdesktop",
// });

export default function Home() {
  const user = useMemo(() => {
    if (typeof window !== "undefined") {
      const { initData } = retrieveLaunchParams();
      return initData?.user;
    }
  }, []);
  const initData = useMemo(function getRawData() {
    if (typeof window !== "undefined") {
      const { initDataRaw } = retrieveLaunchParams();

      return initDataRaw;
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth", {
      method: "GET",
      headers: {
        Authorization: `tma ${initData}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        WebApp.showAlert("Authorized");
      })
      .catch((e) => {
        console.log(e);
        WebApp.showAlert("Unauthorized");
      });
  }, [initData]);

  const [miniApp] = useMemo(() => {
    if (typeof window !== "undefined") {
      if ("Telegram" in window) {
        return initMiniApp();
      }
    }
    return [];
  }, []);
  const haptic = () => {
    if (typeof window !== "undefined") {
      postEvent("web_app_trigger_haptic_feedback", {
        type: "impact",
        impact_style: "heavy",
      });
    }
  };

  const handleAlert = () => {
    if (typeof window !== "undefined") {
      haptic();
      WebApp.showAlert("Wazzup?");
    }
  };

  const handleExpand = () => {
    if (typeof window !== "undefined") {
      haptic();
      postEvent("web_app_expand");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        postEvent("web_app_set_background_color", {
          color: "#ff69de",
        });

        postEvent("web_app_set_header_color", { color_key: "bg_color" });
      }, 3000);

      if (miniApp) {
        miniApp.setHeaderColor("#ff69de");
      }
    }
  }, [miniApp]);

  return (
    <main className={styles.main}>
      {user && (
        <>
          <h1>Hello, {user.firstName}!</h1>
          <h3>Mr. {user.lastName}, it&apos;s nice to see you here.</h3>
        </>
      )}
      <button className={styles.button} onClick={handleAlert}>
        Alert
      </button>

      <button className={styles.button} onClick={handleExpand}>
        Expand
      </button>
    </main>
  );
}
