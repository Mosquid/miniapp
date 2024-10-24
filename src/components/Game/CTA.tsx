import { FC } from "react";
import TouchArea from "../TouchArea";
import rocket from "./assets/rocket-diagonal.svg";
import Typography from "../Typography";
import styles from "./game.module.css";

export interface CTAProps {
  onPlay: () => void;
}

const GameCTA: FC<CTAProps> = ({ onPlay }) => {
  return (
    <TouchArea onClick={onPlay} className={styles.cta}>
      <img src={rocket.src} alt="rocket" />
      <div>
        <Typography
          variant="p"
          element="div"
          weight={300}
          style={{
            marginBottom: 2,

            fontSize: 28,
          }}
        >
          To the Moon
        </Typography>
        <Typography
          variant="p"
          weight={300}
          element="div"
          style={{ fontSize: 10, lineHeight: "12px", maxWidth: "70%" }}
        >
          You have 15 seconds. At any moment, there could be a big drop. Lock in
          your winnings before the market crashes.
        </Typography>
      </div>
    </TouchArea>
  );
};

export default GameCTA;
