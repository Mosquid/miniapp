import { CurrentUser } from "@/types/User";
import { FC } from "react";
import rocket from "@/assets/rocket.svg";
import styles from "./avatar.module.css";

export interface AvatarProps {
  user: CurrentUser;
}

const Avatar: FC<AvatarProps> = ({ user }) => {
  return (
    <img
      className={styles.avatar}
      width={40}
      height={40}
      src={user.photoUrl || rocket}
      alt={user.username || user.name || ""}
    />
  );
};

export default Avatar;
