import { FC, ReactElement, ReactNode } from "react";
import styles from "./button.module.css";
import { cls } from "@/helpers/classNames";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick(): void;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  className,
}): ReactElement => {
  return (
    <button onClick={onClick} className={cls(styles.button, className)}>
      {children}
    </button>
  );
};

export default Button;
