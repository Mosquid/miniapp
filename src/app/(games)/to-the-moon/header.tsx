import { FC } from "react";
import styles from "./styles.module.css";
import Typography from "@/components/Typography";
import Image from "next/image";
import rocket from "@/assets/rocket.svg";
import { CurrentUser } from "@/types/User";

export interface GameHeaderProps {
  user: CurrentUser | null;
  score: number;
}

const ToTheMoonHeader: FC<GameHeaderProps> = ({ user, score }) => {
  return (
    <div className={styles.root}>
      {user && (
        <>
          <div className={styles.flex}>
            <div className={styles.profile}>
              <Image
                className={styles.avatar}
                width={40}
                height={40}
                src={user.photoUrl || rocket}
                alt={user.username || user.name || ""}
              />
              <Typography weight={300} variant="medium">
                {user.name}
              </Typography>
            </div>
            <div className={styles.score}>
              <Typography
                variant="medium"
                weight={300}
                className={styles.scoreValue}
              >
                {score.toFixed(2)}
              </Typography>
              <Typography variant="medium" weight={300}>
                sqz
              </Typography>
            </div>
          </div>
          <div className={styles.divider} />
        </>
      )}
    </div>
  );
};

export default ToTheMoonHeader;
