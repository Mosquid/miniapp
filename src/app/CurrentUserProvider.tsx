"use client";

import { fetchUser } from "@/services/users";
import { CurrentUser } from "@/types/User";
import { retrieveLaunchParams } from "@telegram-apps/sdk";
// import WebApp from "@twa-dev/sdk";
import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CurrentUserContext = createContext<CurrentUser | null>(null);

export interface CurrentUserProviderProps {
  children: React.ReactNode;
}

const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children }) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const initDataRaw = useMemo(() => {
    if (typeof window !== "undefined") {
      const { initDataRaw } = retrieveLaunchParams();

      return initDataRaw;
    }
  }, []);

  const initData = useMemo(() => {
    if (typeof window !== "undefined") {
      const { initData } = retrieveLaunchParams();

      return initData;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("/api/auth", {
        method: "GET",
        headers: {
          Authorization: `tma ${initDataRaw}`,
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          setAuthorized(true);
        })
        .catch((e) => {
          console.log(e);
          // WebApp.showAlert("Unauthorized");
        });
    }
  }, [initData]);

  useEffect(() => {
    if (initData?.user?.username) {
      fetchUser(initData?.user?.username).then((user) => {
        setCurrentUser({
          ...user,
          firstName: initData?.user?.firstName || "",
          ...initData?.user,
          id: initData?.user?.id || 0,
          photoUrl: user?.photoUrl || "",
          username: initData?.user?.username || "",
        });
      });
    }
  }, [initData?.user?.username]);

  const user = useMemo(() => {
    return authorized ? currentUser : null;
  }, [authorized, currentUser]);
  console.log({ authorized });
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);

  return context;
};

export default CurrentUserProvider;
