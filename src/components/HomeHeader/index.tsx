import { FC } from "react";
import styles from "./homeHeader.module.css";
import Avatar from "../Avatar";
import { CurrentUser } from "@/types/User";
import Typography from "../Typography";

export interface HomeHeaderProps {
  user: CurrentUser;
}

const HomeHeader: FC<HomeHeaderProps> = ({ user }) => {
  return (
    <>
      {user && (
        <div className={styles.homeHeader}>
          <Avatar user={user} />
          <div>
            <Typography
              variant="p"
              element="div"
              className={styles.welcome}
              weight={300}
            >
              Welcome back
            </Typography>
            <Typography variant="p" weight={500} className={styles.username}>
              {user.username}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeHeader;
