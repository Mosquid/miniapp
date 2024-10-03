"use client";

import { FC, Fragment, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import { postEvent, initMiniApp } from "@telegram-apps/sdk";
import Tap from "@/components/Tap";
import { useCurrentUser } from "@/app/CurrentUserProvider";
import Header from "@/components/Header";
import dynamic from "next/dynamic";
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

import { getMockTelegramEnv } from "@/lib/mock";
import GameCTA from "@/components/Game/CTA";
import { updateUser } from "@/services/users";

if (
  typeof window !== "undefined" &&
  window.location.href.includes("localhost")
) {
  getMockTelegramEnv();
}

const Home: FC = () => {
  const { user, updateCurrentUser } = useCurrentUser();
  const [showGame, setShowGame] = useState(true);
  const userId = user?.id.toString() ?? "";

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

  const handlePlay = () => {
    setShowGame(true);
  };

  const handleEndGame = (score: number) => {
    setShowGame(false);

    if (user) {
      updateUser(userId, { tokens: (user.tokens || 0) + score }).then((data) =>
        updateCurrentUser({ tokens: data.tokens, updatedAt: data.updatedAt })
      );
    }
  };

  return (
    <Fragment>
      <main className={styles.main}>
        {user && <Header user={user} />}
        {user && <Tap userId={userId} />}

        <GameCTA onPlay={handlePlay} />
      </main>
      {showGame && <Game onStop={handleEndGame} />}
    </Fragment>
  );
};

export default Home;
