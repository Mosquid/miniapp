import { FC, useEffect, useState } from "react";
import styles from "./game.module.css";
import Button from "../Button";
import { CurrentUser } from "@/types/User";
import ToTheMoonHeader from "@/app/(games)/to-the-moon/header";
import Typography from "../Typography";
import { useGameState } from "../GameStateProvider";

export interface ScoreProps {
  points: number;
  onClose(): void;
  onRepeat(): void;
  user: CurrentUser | null;
}

const Score: FC<ScoreProps> = ({ points, onClose, onRepeat, user }) => {
  const { isLoading } = useGameState();
  const [score, setScore] = useState(user?.tokens || 0);
  const [pointsToAdd, setPointsToAdd] = useState(Math.abs(points));
  const delay = Math.abs(points) > 50 ? 0.2 : 1;

  useEffect(() => {
    if (pointsToAdd > 0) {
      const increment = points > 0 ? 0.1 : -0.1;
      const timeout = setTimeout(() => {
        setScore((prevScore) => {
          const newScore = Number(prevScore) + increment;

          return Number(newScore.toFixed(2));
        });
        setPointsToAdd((prevPoints) => Math.max(0, prevPoints - 0.1));
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [points, pointsToAdd]);

  return (
    <div className={styles.score}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <ToTheMoonHeader score={points} user={user} />
        <Typography variant="h2" style={{ marginLeft: 12 }}>
          Total: {score} sqz
        </Typography>
      </div>
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: "auto",
          marginBottom: 50,
        }}
      >
        <Button onClick={onClose} type="highlight" disabled={isLoading}>
          Close
        </Button>
        <Button
          onClick={onRepeat}
          style={{
            width: 188,
          }}
          type="highlight"
          disabled={isLoading}
        >
          Repeat
        </Button>
      </div>
    </div>
  );
};

export default Score;
