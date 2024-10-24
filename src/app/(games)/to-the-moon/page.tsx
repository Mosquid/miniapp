"use client";

import styles from "../../page.module.css";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { saveGameResult } from "@/services/game";
import FullscreenLayout from "@/components/FullscreenLayout";
import { useState } from "react";
import GameStateProvider from "@/components/GameStateProvider";
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

const ToTheMoon = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user, updateCurrentUser } = useCurrentUser();
  const userId = user?.id.toString() ?? "";
  const handleEndGame = (score: number) => {
    router.push("/");
  };

  const handleRepeat = (score: number) => {
    window.location.reload();
  };

  const handleEnd = (score: number) => {
    if (user) {
      setIsLoading(true);
      saveGameResult(userId, score).then((data) => {
        updateCurrentUser({
          tokens: data.tokens,
          dailyTokens: data.dailyTokens,
          updatedAt: new Date(),
        });
        setIsLoading(false);
      });
    }
  };

  return (
    <GameStateProvider isLoading={isLoading}>
      <main className={styles.main}>
        <Game
          onStop={handleEndGame}
          onRepeat={handleRepeat}
          onEnd={handleEnd}
        />
      </main>
    </GameStateProvider>
  );
};

ToTheMoon.getLayout = (page: React.ReactNode) => (
  <FullscreenLayout>{page}</FullscreenLayout>
);

export default ToTheMoon;
