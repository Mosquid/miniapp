"use client";

import { FC, useMemo } from "react";
import Image from "next/image";
import styles from "./navigation.module.css";
import Typography from "../Typography";
import { cls } from "@/helpers/classNames";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface ItemProps {
  title: string;
  icon: string;
  path: string;
}

const Item: FC<ItemProps> = ({ title, icon, path }) => {
  const router = useRouter();
  const pathname = usePathname();
  const active = useMemo(() => {
    return path === pathname;
  }, [path, pathname]);

  const handleItemClick = () => {
    router.push(path);
  };

  return (
    <li
      className={cls(styles.menuItem, active ? styles.active : "")}
      onClick={handleItemClick}
    >
      <Image src={icon} alt={title} width={24} height={24} />
      <Typography variant="p" weight={300}>
        {title}
      </Typography>
    </li>
  );
};

export default Item;
