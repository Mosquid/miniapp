"use client";

import { FC } from "react";
import styles from "./navigation.module.css";
import homeIcon from "./assets/home.svg";
import cashIcon from "./assets/cash.svg";
import percentIcon from "./assets/percent.svg";
import peopleIcon from "./assets/people.svg";
import barsIcon from "./assets/bars.svg";
import Item from "./Item";

const MenuItems = [
  {
    title: "Home",
    icon: homeIcon,
    path: "/",
  },
  {
    title: "Tasks",
    icon: cashIcon,
    path: "/tasks",
  },
  {
    title: "Staking",
    icon: percentIcon,
    path: "/staking",
  },
  {
    title: "Friends",
    icon: peopleIcon,
    path: "/friends",
  },
  {
    title: "Leaderboard",
    icon: barsIcon,
    path: "/leaderboard",
  },
];

const Navigation: FC = () => {
  return (
    <nav className={styles.root}>
      <ul>
        {MenuItems.map((item, index) => (
          <Item key={index} {...item} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
