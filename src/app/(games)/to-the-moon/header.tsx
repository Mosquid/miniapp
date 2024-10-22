import { FC } from "react";
import styles from "./styles.module.css";
import Typography from "@/components/Typography";
import { CurrentUser } from "@/types/User";
import Avatar from "@/components/Avatar";

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
              <Avatar user={user} />
              <Typography weight={300} variant="medium">
                {user.name}
              </Typography>
            </div>
            <div className={styles.score}>
              <Typography
                variant="medium"
                weight={300}
                element="div"
                className={styles.scoreValue}
              >
                {score > 0 ? "+" : ""}
                {score
                  .toFixed(2)
                  .split(".")
                  .map((part, index) => (
                    <span
                      key={index}
                      className={index === 1 ? styles.decimal : ""}
                    >
                      {index === 1 && "."}
                      {part}
                    </span>
                  ))}
              </Typography>
              <Typography variant="medium" element="div" weight={300}>
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
