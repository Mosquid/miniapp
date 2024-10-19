import { FC, useState } from "react";
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
  const [repeatLoading, setRepeatLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const handleRepeat = () => {
    setRepeatLoading(true);
    onRepeat();
  };

  const handleClose = () => {
    setCloseLoading(true);
    onClose();
  };

  return (
    <div className={styles.score}>
      <ToTheMoonHeader score={points} user={user} />

      <div style={{ display: "flex", gap: 10 }}>
        <Button
          onClick={handleClose}
          type="highlight"
          loading={closeLoading}
          disabled={repeatLoading || closeLoading}
        >
          Close
        </Button>
        <Button
          onClick={handleRepeat}
          type="highlight"
          loading={repeatLoading}
          disabled={repeatLoading || closeLoading}
        >
          Repeat
        </Button>
      </div>
    </div>
  );
};

export default Score;
