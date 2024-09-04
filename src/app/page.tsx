"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import WebApp from "@twa-dev/sdk";
import {
  postEvent,
  initMiniApp,
  retrieveLaunchParams,
} from "@telegram-apps/sdk";
import Tap from "@/components/Tap";
// import { getMockTelegramEnv } from "@/lib/mock";
import Header from "@/components/Header";

// getMockTelegramEnv();

export default function Home() {
  const [authorized, setAuthorized] = useState<boolean>(false);
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
      .then(() => {
        setAuthorized(true);
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

  // const handleAlert = () => {
  //   if (typeof window !== "undefined") {
  //     haptic();
  //     WebApp.showAlert("Wazzup?");
  //   }
  // };

  // const handleExpand = () => {
  //   if (typeof window !== "undefined") {
  //     haptic();
  //     postEvent("web_app_expand");
  //   }
  // };

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
      {user && authorized && <Header user={user} />}
      {user && user.username && <Tap username={user?.username} />}
    </main>
  );
}
