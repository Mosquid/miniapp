"use client";

import { FC } from "react";
import styles from "../page.module.css";
import Typography from "@/components/Typography";

const Friends: FC = () => {
  return (
    <main className={styles.main}>
      <Typography variant="h1">Here you'll see your friends</Typography>
    </main>
  );
};

export default Friends;
