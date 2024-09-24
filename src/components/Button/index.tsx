import { FC, ReactElement, ReactNode, CSSProperties } from "react";
import styles from "./button.module.css";
import { cls } from "@/helpers/classNames";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick(): void;
  children: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  className,
  disabled,
  style,
}): ReactElement => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={cls(styles.button, className, disabled ? styles.disabled : "")}
    >
      {children}
    </button>
  );
};

export default Button;
