"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { validate } from "@telegram-apps/init-data-node";

const API_KEY: string = process.env.BOT_API_KEY || "";

type ResponseData = {
  message: string;
};

export default function handler(
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
