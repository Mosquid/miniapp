"use client";

import { FC, Fragment, useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { postEvent, initMiniApp } from "@telegram-apps/sdk";
import Tap from "@/components/Tap";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { getMockTelegramEnv } from "@/lib/mock";
import GameCTA from "@/components/Game/CTA";
import BirdGameCTA from "./bird/Cta";

if (
  typeof window !== "undefined" &&
  window.location.href.includes("localhost")
) {
  getMockTelegramEnv();
}

const Home: FC = () => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const userId = user?.id.toString() ?? "";

  const [miniApp] = useMemo(() => {
    if (typeof window !== "undefined") {
      if ("Telegram" in window) {
        return initMiniApp();
      }
    }
    return [];
  }, []);

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

  const handlePlay = () => {
    router.push("/to-the-moon");
  };

  return (
    <Fragment>
      <main className={styles.main}>
        {user && <Header user={user} />}
        {user && <Tap userId={userId} />}

        <GameCTA onPlay={handlePlay} />
        <BirdGameCTA
          onPlay={() => {
            router.push("/bird");
          }}
        />
      </main>
    </Fragment>
  );
};

export default Home;
