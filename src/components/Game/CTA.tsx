import { FC } from "react";
import TouchArea from "../TouchArea";
import rocket from "./assets/rocket.png";
import Typography from "../Typography";
import styles from "./game.module.css";

export interface CTAProps {
  onPlay: () => void;
}

const GameCTA: FC<CTAProps> = ({ onPlay }) => {
  return (
    <TouchArea onClick={onPlay} className={styles.cta}>
      <img
        src={rocket.src}
        alt="rocket"
        style={{
          maxWidth: 20,
        }}
      />
      <Typography variant="p">To the moon</Typography>
    </TouchArea>
  );
};

export default GameCTA;
