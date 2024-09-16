"use client";

import { FC, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { postEvent, initMiniApp } from "@telegram-apps/sdk";
import Tap from "@/components/Tap";
import { useCurrentUser } from "@/app/CurrentUserProvider";
import Header from "@/components/Header";

// import { getMockTelegramEnv } from "@/lib/mock";

// if (
//   typeof window !== "undefined" &&
//   window.location.href.includes("localhost")
// ) {
//   getMockTelegramEnv();
// }

const Home: FC = () => {
  const user = useCurrentUser();

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
  console.log({ haptic });

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
      {user && <Header user={user} />}
      {user && <Tap userId={user.id.toString() ?? ""} />}
    </main>
  );
};

export default Home;
