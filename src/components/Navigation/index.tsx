import { FC } from "react";
import styles from "./navigation.module.css";

const Navigation: FC = () => {
  return (
    <nav className={styles.root}>
      <ul>
        <li>
          <a href="/">🏠</a>
        </li>
        <li>
          <a href="/to-the-moon">🚀</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
