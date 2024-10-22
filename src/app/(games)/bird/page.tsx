"use client";

import { FC, useEffect, useRef, useState } from "react";
import styles from "../../page.module.css";
import Game from "./Game";

const Staking: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className={styles.main} ref={ref}>
      {size.width && size.height ? <Game size={size} /> : null}
    </main>
  );
};

export default Staking;
