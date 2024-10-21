import styles from "./styles.module.css";
import rocket from "@/assets/rocket.svg";
import Image from "next/image";

export default function Loader() {
  return (
    <div className={styles.loader}>
      <Image
        src={rocket}
        alt="rocket"
        width={100}
        height={100}
        className={styles.loaderImage}
      />
    </div>
  );
}
