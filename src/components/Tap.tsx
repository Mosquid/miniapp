import { FC, useEffect, useState } from "react";
import { User } from "@prisma/client";
import styles from "@/app/page.module.css";
import useDebounce from "@/hooks/useDebounce";
import Button from "./Button";

export interface TapProps {
  username: string;
}

const fetchUser = async (username: string): Promise<User> => {
  const response = await fetch("/api/users", {
    headers: {
      "x-username": username,
    },
  });

  const data = await response.json();

  return data.user;
};

const updateUser = async (
  username: string,
  payload: Partial<User>
): Promise<User> => {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-username": username,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data.user;
};

const Tap: FC<TapProps> = ({ username }) => {
  const [user, setUser] = useState<User>();
  const [tokens, setTokens] = useState<number>(0);
  const debounceTokens = useDebounce(tokens, 500);

  useEffect(() => {
    if (user && user.tokens) {
      setTokens(user.tokens);
    }
  }, [user]);

  useEffect(() => {
    fetchUser(username).then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [username]);

  const earn = () => {
    setTokens(tokens + 1);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user?.tokens !== debounceTokens) {
      updateUser(username, { tokens: debounceTokens }).then((user) => {
        if (user) {
          setUser(user);
        }
      });
    }
  }, [debounceTokens]);

  if (!user) {
    return <h1>Loading...</h1>;
  }

  return (
    <div
      style={{
        paddingTop: 20,
        textAlign: "center",
      }}
    >
      <h1>Tokens: {tokens}</h1>
      <Button className={styles.button} onClick={earn}>
        Claim +1
      </Button>
    </div>
  );
};

export default Tap;
