import { FC, useMemo } from "react";
import styles from "./game.module.css";
import { GameStatus } from "./types";
import Typography from "../Typography";
import Image from "next/image";
import rocketIcon from "./assets/rocket.svg";

export interface ScoreProps {
  points: number;
  onClick(): void;
  status: GameStatus;
  currency?: string;
}

const Controls: FC<ScoreProps> = ({ points, status, onClick }) => {
  const btnProps = useMemo(() => {
    if (status === GameStatus.pending) {
      return { children: "Go", icon: true };
    }

    if (status === GameStatus.running) {
      return { children: "Take" };
    }

    if (status === GameStatus.ended) {
      const text = points > 0 ? "Take" : "Claim loss";
      return { children: text };
    }

    return { children: "Take", disabled: true };
  }, [status]);

  return (
    <div className={styles.controls}>
      <div {...btnProps} onClick={onClick} className={styles.button}>
        <Typography variant="p" weight={300}>
          {btnProps.icon && <Image width={28} src={rocketIcon} alt="rocket" />}
          {btnProps.children}
        </Typography>
      </div>
    </div>
  );
};

export default Controls;
