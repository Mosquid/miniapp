import serviceFetch, { get } from "@/lib/service";
import { UserDTO } from "@/types/User";
import { User } from "@prisma/client";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

export const fetchUser = async (userId: string): Promise<UserDTO> => {
  const response = await get(`${APP_URL}/api/users`, {
    headers: {
      "x-username": userId,
    },
  });

  const data = await response.json();

  return data.user;
};

export const updateUser = async (
  userId: string,
  payload: Partial<User>
): Promise<User> => {
  const response = await serviceFetch("/api/users", {
    method: "PUT",
    headers: {
      "x-username": userId,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return data.user;
};
