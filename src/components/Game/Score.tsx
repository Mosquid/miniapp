import { FC } from "react";
import styles from "./game.module.css";
import Button from "../Button";
import { CurrentUser } from "@/types/User";
import ToTheMoonHeader from "@/app/(games)/to-the-moon/header";

export interface ScoreProps {
  points: number;
  onClose(): void;
  onRepeat(): void;
  user: CurrentUser | null;
}

const Score: FC<ScoreProps> = ({ points, onClose, onRepeat, user }) => {
  return (
    <div className={styles.score}>
      <ToTheMoonHeader score={points} user={user} />

      <div style={{ display: "flex", gap: 10 }}>
        <Button onClick={onClose} type="highlight">
          Close
        </Button>
        <Button onClick={onRepeat} type="highlight">
          Repeat
        </Button>
      </div>
    </div>
  );
};

export default Score;
