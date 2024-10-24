"use client";

import { get } from "@/lib/service";
import { fetchUser } from "@/services/users";
import { CurrentUser } from "@/types/User";
import { retrieveLaunchParams } from "@telegram-apps/sdk";

import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Loader from "./Loader";

export interface CurrentUserContextValue {
  user: CurrentUser | null;
  updateCurrentUser: (user: Partial<CurrentUser>) => void;
}

const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: null,
  updateCurrentUser: () => {},
});

export interface CurrentUserProviderProps {
  children: React.ReactNode;
}

const CurrentUserProvider: FC<CurrentUserProviderProps> = ({ children }) => {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
          console.error("Authorization failed", err);
          // WebApp.showAlert("Unauthorized");
        });
    }
  }, [initData]);

  useEffect(() => {
    if (initData?.user?.id) {
      setLoading(true);
      fetchUser(initData?.user?.id.toString()).then((user) => {
        setLoading(false);
        setCurrentUser({
          ...user,
          firstName: initData?.user?.firstName || "",
          ...initData?.user,
          id: initData?.user?.id || 0,
          photoUrl: user?.photoUrl || "",
          username: initData?.user?.username || "",
          tokens: user?.tokens || 0,
          dailyTokens: user?.dailyTokens || 0,
        });
      });
    }
  }, [initData?.user?.id]);

  const user = useMemo(() => {
    return authorized ? currentUser : null;
  }, [authorized, currentUser]);

  const updateCurrentUser = (user: Partial<CurrentUser>) => {
    setCurrentUser((prev) => ({
      tokens: prev?.tokens || user.tokens || 0,
      dailyTokens: prev?.dailyTokens || user.dailyTokens || 0,
      createdAt: prev?.createdAt || user.createdAt || new Date(),
      updatedAt: prev?.createdAt || user.createdAt || new Date(),
      photoUrl: prev?.photoUrl || user.photoUrl || "",
      username: prev?.username || user.username || "",
      name: prev?.name || user.name || "",
      firstName: prev?.firstName || user.firstName || "",
      referralCode: prev?.referralCode || user.referralCode || "",
      invitedById: prev?.invitedById || user.invitedById || "",
      id: prev?.id || user.id || 0,
      ...prev,
      ...user,
    }));
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <CurrentUserContext.Provider value={{ user, updateCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);

  return context;
};

export default CurrentUserProvider;
