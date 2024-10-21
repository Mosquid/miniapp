"use client";

import styles from "../../page.module.css";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { saveGameResult } from "@/services/game";
import FullscreenLayout from "@/components/FullscreenLayout";
import { useState } from "react";
import Loader from "@/components/Loader";
import useDebounce from "@/hooks/useDebounce";
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

const ToTheMoon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const debounceLoading = useDebounce(isLoading, 600);
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
        updateCurrentUser({ tokens: data.tokens, updatedAt: new Date() });
        setIsLoading(false);
      });
    }
  };

  return (
    <main className={styles.main}>
      {(debounceLoading || isLoading) && <Loader />}
      <Game onStop={handleEndGame} onRepeat={handleRepeat} onEnd={handleEnd} />
    </main>
  );
};

ToTheMoon.getLayout = (page: React.ReactNode) => (
  <FullscreenLayout>{page}</FullscreenLayout>
);

export default ToTheMoon;
