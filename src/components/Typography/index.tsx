import { cls } from "@/helpers/classNames";
import { FC } from "react";
import styles from "./typography.module.css";

const sizeClasses = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  h4: styles.h4,
  h5: styles.h5,
  h6: styles.h6,
  medium: styles.medium,
};
export interface TypographyProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  element?: keyof JSX.IntrinsicElements;
  weight?: 300 | 400 | 500 | 600 | 700 | 800 | 900;
  variant: keyof typeof sizeClasses | "p";
}

const Typography: FC<TypographyProps> = ({
  children,
  className,
  element: Element = "span",
  weight = 400,
  variant = "p",
}) => {
  const sizeClass =
    variant in sizeClasses
      ? sizeClasses[variant as keyof typeof sizeClasses]
      : "";
  console.log({ sizeClass });
  return (
    <Element
      style={{
        fontWeight: weight,
      }}
      className={cls(className, sizeClass, styles.typography)}
    >
      {children}
    </Element>
  );
};

export default Typography;
