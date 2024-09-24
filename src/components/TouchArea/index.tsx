import { FC } from "react";
import styles from "./touchArea.module.css";
import Image from "next/image";
import Arrow from "./arrow.svg";
import { cls } from "@/helpers/classNames";

export interface TouchAreaProps {
  onClick(): void;
  children?: React.ReactNode;
  className?: string;
}

const TouchArea: FC<TouchAreaProps> = ({ onClick, children, className }) => {
  return (
    <div className={cls(styles.root, className)} onClick={onClick}>
      {children}
      <Image className={styles.arrow} src={Arrow} alt="arrow" />
    </div>
  );
};

export default TouchArea;
