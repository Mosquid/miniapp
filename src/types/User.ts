import { User } from "@prisma/client";
import { User as TelegramUser } from "@telegram-apps/init-data-node/web";

export type UserTokens = {
  dailyTokens?: number;
  tokens?: number;
};

export type CurrentUser = TelegramUser & Omit<User, "id"> & UserTokens;

export type UserDTO = User & UserTokens;
