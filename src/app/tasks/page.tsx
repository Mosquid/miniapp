"use client";

import { FC } from "react";
import styles from "../page.module.css";
import Typography from "@/components/Typography";

const Tasks: FC = () => {
  return (
    <main className={styles.main}>
      <Typography variant="h1">Here will be the Tasks</Typography>
    </main>
  );
};

export default Tasks;
