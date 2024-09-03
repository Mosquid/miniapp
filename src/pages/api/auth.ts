"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { validate, parse } from "@telegram-apps/init-data-node";

import { User } from "@/lib/db";

const API_KEY: string = process.env.BOT_API_KEY || "";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const authHeader = req.headers.authorization || "";
  const [authType, authData = ""] = authHeader.split(" ");

  switch (authType) {
    case "tma":
      try {
        // Validate init data.
        validate(authData, API_KEY, {
          // We consider init data sign valid for 1 hour from their creation moment.
          expiresIn: 3600,
        });
        const userData = parse(authData);
        const { user } = userData;

        await User.upsert({
          where: { username: userData.user?.username },
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
      } catch (e) {
        console.log(e);
        return res.status(401).json({ message: "Unauthorized" });
      }
    // ... other authorization methods.
    default:
      return res.status(401).json({ message: "Unauthorized" });
  }
}
