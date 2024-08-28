"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import WebApp from "@twa-dev/sdk";
import { postEvent } from "@telegram-apps/sdk";

export default function Home() {
  const handleAlert = () => {
    if (typeof window !== "undefined") {
      WebApp.showAlert("Wazzup?");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        postEvent("web_app_set_header_color", { color_key: "bg_color" });
      }, 3000);
    }
  }, []);

  return (
    <main className={styles.main}>
      <button className={styles.button} onClick={handleAlert}>
        Alert
      </button>
    </main>
  );
}
