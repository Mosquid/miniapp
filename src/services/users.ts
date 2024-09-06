import { User } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

export const fetchUser = async (username: string): Promise<User> => {
  const response = await fetch(`${APP_URL}/api/users`, {
    headers: {
      "x-username": username,
    },
  });

  const data = await response.json();

  return data.user;
};

export const updateUser = async (
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
