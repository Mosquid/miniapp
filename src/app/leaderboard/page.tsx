"use client";

import { FC } from "react";
import styles from "../page.module.css";
import Typography from "@/components/Typography";

const Leaderboard: FC = () => {
  return (
    <main className={styles.main}>
      <Typography variant="h1">Here we'll put the leaderboard</Typography>
    </main>
  );
};

export default Leaderboard;
