import { FC } from "react";
import Typography from "../Typography";
import styles from "./game.module.css";
import Button from "../Button";

export interface ScoreProps {
  points: number;
  currency?: string;
  onClick(): void;
}

const Score: FC<ScoreProps> = ({ points, currency, onClick }) => {
  if (points <= 0) {
    return (
      <div className={styles.score} onClick={onClick}>
        <Typography element="div" variant="h5">
          You lost
        </Typography>
      </div>
    );
  }

  return (
    <div className={styles.score}>
      <Typography element="div" variant="h5">
        You Won!
      </Typography>
      <Typography element="div" variant="h5">
        <strong>{points}</strong>&nbsp;{currency}
      </Typography>
      <Button style={{ marginTop: 20 }} onClick={onClick}>
        Claim
      </Button>
    </div>
  );
};

export default Score;
