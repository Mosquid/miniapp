import { User } from "@prisma/client";
import { User as TelegramUser } from "@telegram-apps/init-data-node/web";

export type CurrentUser = TelegramUser & Omit<User, "id">;
