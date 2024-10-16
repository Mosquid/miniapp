import { FC, useEffect, useState } from "react";
import { User } from "@prisma/client";
import useDebounce from "@/hooks/useDebounce";
import Button from "./Button";
import { fetchUser, updateUser } from "@/services/users";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import { noop } from "lodash";

export interface TapProps {
  userId: string;
}

const Tap: FC<TapProps> = ({ userId }) => {
  const { user: currentUser } = useCurrentUser();
  const [user, setUser] = useState<User>();
  const [tokens, setTokens] = useState<number>(0);
  const debounceTokens = useDebounce(tokens, 500);

  useEffect(() => {
    if (user && user.tokens) {
      setTokens(user.tokens);
    }
  }, [user]);

  useEffect(() => {
    if (user && currentUser && currentUser.tokens) {
      setUser({
        ...user,
        tokens: currentUser.tokens,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUser(userId).then((user) => {
      if (user) {
        setUser(user);
      }
    });
  }, [userId]);

  const earn = () => {
    setTokens(tokens + 1);
  };
  noop(earn);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user?.tokens !== debounceTokens) {
      updateUser(userId, { tokens: debounceTokens });
    }
  }, [debounceTokens]);

  if (!user) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  return (
    <div
      style={{
        paddingTop: 20,
        textAlign: "center",
      }}
    >
      <h1 id="token">Tokens: {tokens}</h1>
      {/* <Button onClick={earn}>Claim +1</Button> */}
    </div>
  );
};

export default Tap;
