"use client";

import { FC } from "react";
import styles from "../page.module.css";
import { updateUser } from "@/services/users";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
const Game = dynamic(() => import("@/components/Game"), { ssr: false });

const ToTheMoon: FC = () => {
  const router = useRouter();
  const { user, updateCurrentUser } = useCurrentUser();
  const userId = user?.id.toString() ?? "";
  const handleEndGame = (score: number) => {
    if (user) {
      updateUser(userId, { tokens: (user.tokens || 0) + score }).then(
        (data) => {
          updateCurrentUser({ tokens: data.tokens, updatedAt: data.updatedAt });
          router.push("/");
        }
      );
    }
  };

  return (
    <main className={styles.main}>
      <Game onStop={handleEndGame} />
    </main>
  );
};

export default ToTheMoon;
