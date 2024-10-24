import { FC } from "react";
import styles from "./touchArea.module.css";
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
    </div>
  );
};

export default TouchArea;
