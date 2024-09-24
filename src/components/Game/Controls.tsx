import { FC, useMemo } from "react";
import Button from "../Button";
import styles from "./game.module.css";
import { GameStatus } from "./types";

export interface ScoreProps {
  points: number;
  onClick(): void;
  status: GameStatus;
  currency?: string;
}

const Controls: FC<ScoreProps> = ({
  points,
  status,
  onClick,
  currency = "YCN",
}) => {
  const btnProps = useMemo(() => {
    if (status === GameStatus.pending) {
      return { children: "Start" };
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
      <span>
        {points}&nbsp;{currency}
      </span>
      <Button {...btnProps} onClick={onClick} />
    </div>
  );
};

export default Controls;
