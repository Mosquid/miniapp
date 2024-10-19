import { FC, ReactElement, ReactNode, CSSProperties } from "react";
import styles from "./button.module.css";
import { cls } from "@/helpers/classNames";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick(): void;
  children: ReactNode;
  disabled?: boolean;
  style?: CSSProperties;
  type?: "default" | "highlight";
}

const Button: FC<ButtonProps> = ({
  onClick,
  children,
  className,
  disabled,
  style,
  type = "default",
}): ReactElement => {
  return (
    <button
      style={style}
      onClick={onClick}
      className={cls(
        styles.button,
        className,
        disabled ? styles.disabled : "",
        type === "highlight" ? styles.highlight : ""
      )}
    >
      {children}
    </button>
  );
};

export default Button;
