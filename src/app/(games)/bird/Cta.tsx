import { FC } from "react";
import TouchArea from "@/components/TouchArea";
import bird from "./assets/bird.svg";
import Typography from "@/components/Typography";
import styles from "@/components/Game/game.module.css";

export interface CTAProps {
  onPlay: () => void;
}

const BirdGameCTA: FC<CTAProps> = ({ onPlay }) => {
  return (
    <TouchArea onClick={onPlay} className={styles.cta}>
      <img
        src={bird.src}
        alt="rocket"
        style={{
          maxWidth: 20,
        }}
      />
      <Typography variant="p">Mad Flight</Typography>
    </TouchArea>
  );
};

export default BirdGameCTA;
