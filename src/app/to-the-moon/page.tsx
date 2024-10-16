"use client";

import { FC } from "react";
import styles from "../page.module.css";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { saveGameResult } from "@/services/game";
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

const ToTheMoon: FC = () => {
  const router = useRouter();
  const { user, updateCurrentUser } = useCurrentUser();
  const userId = user?.id.toString() ?? "";
  const handleEndGame = (score: number) => {
    if (user) {
      saveGameResult(userId, score).then((data) => {
        updateCurrentUser({ tokens: data.tokens, updatedAt: new Date() });
        router.push("/");
      });
    }
  };

  return (
    <main className={styles.main}>
      <Game onStop={handleEndGame} />
    </main>
  );
};

export default ToTheMoon;
