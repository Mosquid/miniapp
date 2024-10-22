"use client";

import { useEffect, useMemo } from "react";
import styles from "./page.module.css";
import { postEvent, initMiniApp } from "@telegram-apps/sdk";
import Invite from "@/components/Invite";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import { useRouter } from "next/navigation";
import { getMockTelegramEnv } from "@/lib/mock";
import GameCTA from "@/components/Game/CTA";
import BirdGameCTA from "./(games)/bird/Cta";
import Tap from "@/components/Tap";
import NavLayout from "@/components/NavLayout";
import HomeHeader from "@/components/HomeHeader";

if (
  typeof window !== "undefined" &&
  window.location.href.includes("localhost")
) {
  getMockTelegramEnv();
}

const Home = () => {
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
    <NavLayout>
      <main className={styles.main}>
        <div
          style={{
            padding: "20px 20px 0 ",
          }}
        >
          {user && <HomeHeader user={user} />}
          {user && <Invite userId={userId} />}
          {user && <Tap userId={userId} />}

          <GameCTA onPlay={handlePlay} />
          <BirdGameCTA
            onPlay={() => {
              router.push("/bird");
            }}
          />
        </div>
      </main>
    </NavLayout>
  );
};

export default Home;
