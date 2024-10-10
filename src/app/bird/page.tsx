"use client";

import { FC, useEffect, useRef, useState } from "react";
import styles from "../page.module.css";
import Game from "./Game";

const Staking: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    console.log(ref);
    const handleResize = () => {
      if (ref.current) {
        console.log("current");
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log(size);

  return (
    <main className={styles.main} ref={ref}>
      {size.width && size.height ? <Game size={size} /> : null}
    </main>
  );
};

export default Staking;
