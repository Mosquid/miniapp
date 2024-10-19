"use client";

import NavLayout from "@/components/NavLayout";
import styles from "../../page.module.css";
import Typography from "@/components/Typography";

const Tasks = () => {
  return (
    <main className={styles.main}>
      <Typography variant="h1">Here will be the Tasks</Typography>
    </main>
  );
};

Tasks.getLayout = (page: React.ReactNode) => <NavLayout>{page}</NavLayout>;

export default Tasks;
