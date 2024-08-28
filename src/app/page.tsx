"use client";

import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import WebApp from "@twa-dev/sdk";
import {
  postEvent,
  initMiniApp,
  retrieveLaunchParams,
} from "@telegram-apps/sdk";

export default function Home() {
  const initData = useMemo(function getRawData() {
    if (typeof window !== "undefined") {
      const { initDataRaw } = retrieveLaunchParams();
      return initDataRaw;
    }
  }, []);

  useEffect(() => {
    fetch("https://webhook.site/b064489f-7d8b-45ca-9b3c-0c36567b73d6", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData,
      }),
    });
  }, [initData]);

  const [miniApp] = useMemo(() => {
    if (typeof window !== "undefined") {
      return initMiniApp();
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
      <button className={styles.button} onClick={handleAlert}>
        Alert
      </button>

      <button className={styles.button} onClick={handleExpand}>
        Expand
      </button>
    </main>
  );
}
