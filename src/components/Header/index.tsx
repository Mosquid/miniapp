import { User } from "@telegram-apps/sdk";
import { FC } from "react";
import styles from "./header.module.css";
import Typography from "../Typography";

export interface HeaderProps {
  user: User;
}

const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header className={styles.header}>
      <img className={styles.avatar} src={user.photoUrl} alt="" />
      <Typography variant="h2" weight={600}>
        {user.username}
      </Typography>
    </header>
  );
};

export default Header;
