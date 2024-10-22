"use server";

import type { NextApiRequest } from "next";
import { parse, validate } from "@telegram-apps/init-data-node";
const API_KEY: string = process.env.BOT_API_KEY || "";

export function getUserAuthData(req: NextApiRequest) {
  const authHeader = req.headers.authorization || "";

  return authHeader.split(" ");
}

export function authorizeRequest(req: NextApiRequest) {
  // TODO: set secret key
  const [authType, authData = ""] = getUserAuthData(req);
  const userData = parse(authData);
  const debug = userData.startParam === "debug";

  if (authType === "tma" && !debug) {
    const valid = validate(authData, API_KEY, {
      // We consider init data sign valid for 1 hour from their creation moment.
      expiresIn: 3600,
    });
  }
}
