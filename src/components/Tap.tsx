import { FC, useEffect, useState } from "react";
import { User } from "@prisma/client";
import useDebounce from "@/hooks/useDebounce";
import { fetchUser, updateUser } from "@/services/users";
import { useCurrentUser } from "@/components/CurrentUserProvider";
import { noop } from "lodash";
import Typography from "./Typography";

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
        marginBottom: 40,
      }}
    >
      <Typography
        variant="p"
        element="div"
        weight={300}
        style={{ fontSize: 15 }}
      >
        Total balance <span style={{ opacity: 0.5 }}>SQZ</span>
      </Typography>
      <Typography variant="h1" weight={300} style={{ fontSize: 42 }}>
        {tokens.toFixed(2)}
      </Typography>
      <Typography variant="p" weight={300} style={{ fontSize: 15 }}>
        {user.tokens}
      </Typography>
      <div
        style={{
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="p"
          weight={300}
          style={{
            fontSize: 20,
          }}
        >
          {currentUser?.dailyTokens}
        </Typography>
        <Typography weight={300} variant="p" style={{ fontSize: 10 }}>
          Daily income
        </Typography>
      </div>
      {/* <Button onClick={earn}>Claim +1</Button> */}
    </div>
  );
};

export default Tap;
