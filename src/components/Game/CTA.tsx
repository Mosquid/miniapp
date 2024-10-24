import { FC } from "react";
import TouchArea from "../TouchArea";
import rocket from "./assets/rocket-large.svg";
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
          <strong style={{ fontWeight: 700 }}>Mad</strong>Flight
        </Typography>
        <Typography
          variant="p"
          weight={300}
          element="div"
          style={{ fontSize: 10, lineHeight: "11px" }}
        >
          Blast off to victory, earning points with every cosmic mile conquered
        </Typography>
      </div>
    </TouchArea>
  );
};

export default GameCTA;
