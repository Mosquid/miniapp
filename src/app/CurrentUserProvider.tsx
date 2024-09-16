"use client";

import { get } from "@/lib/service";
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

  const initData = useMemo(() => {
    if (typeof window !== "undefined") {
      const { initData } = retrieveLaunchParams();

      return initData;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      get("/api/auth", {
        method: "GET",
      })
        .then(() => {
          setAuthorized(true);
        })
        .catch((err) => {
          console.log("Authorization failed", err);
          // WebApp.showAlert("Unauthorized");
        });
    }
  }, [initData]);

  useEffect(() => {
    if (initData?.user?.id) {
      fetchUser(initData?.user?.id.toString()).then((user) => {
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
  }, [initData?.user?.id]);

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
