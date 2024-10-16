"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "@telegram-apps/init-data-node";

import { User } from "@/lib/db";
import { authorizeRequest, getUserAuthData } from "@/lib/auth";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const [authType, authData = ""] = getUserAuthData(req);

  switch (authType) {
    case "tma":
      try {
        const userData = parse(authData);
        authorizeRequest(req);

        const { user } = userData;

        await User.upsert({
          where: { id: userData.user?.id?.toString() },
          update: {
            updatedAt: new Date(),
          },
          create: {
            name: `${user?.firstName} ${user?.lastName}`,
            id: String(user?.id),
            username: user?.username,
            createdAt: new Date(),
            updatedAt: new Date(),
            tokens: 0,
          },
        });

        return res.json({ message: "Authorized" });
      } catch (err) {
        console.error("Failed to authorize", err);
        return res.status(401).json({ message: "Unauthorized" });
      }
    default:
      return res.status(401).json({ message: "Unauthorized" });
  }
}
