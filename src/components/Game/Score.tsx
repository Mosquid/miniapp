import { FC, useEffect, useState } from "react";
import styles from "./game.module.css";
import Button from "../Button";
import { CurrentUser } from "@/types/User";
import ToTheMoonHeader from "@/app/(games)/to-the-moon/header";
import Typography from "../Typography";

export interface ScoreProps {
  points: number;
  onClose(): void;
  onRepeat(): void;
  user: CurrentUser | null;
}

const Score: FC<ScoreProps> = ({ points, onClose, onRepeat, user }) => {
  const [repeatLoading, setRepeatLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const [score, setScore] = useState(user?.tokens || 0);
  const [pointsToAdd, setPointsToAdd] = useState(Math.abs(points));

  useEffect(() => {
    if (pointsToAdd > 0) {
      const increment = points > 0 ? 0.1 : -0.1;
      const timeout = setTimeout(() => {
        setScore((prevScore) => {
          const newScore = prevScore + increment;
          return Number(newScore.toFixed(2));
        });
        setPointsToAdd((prevPoints) => Math.max(0, prevPoints - 0.1));
      }, 0.1);
      return () => clearTimeout(timeout);
    }
  }, [points, pointsToAdd]);

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
      <Typography variant="h2">Total: {score.toFixed(2)} sqz</Typography>

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
