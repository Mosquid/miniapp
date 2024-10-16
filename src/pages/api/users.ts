"use server";

import { authorizeRequest } from "@/lib/auth";
import { User as UserModel } from "@/lib/db";
import { getUserPhoto } from "@/lib/telegram";
import { getUserTokens } from "@/queries/users";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  user?: User;
  message?: string;
};

async function handleUpdateUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const usernameHeader = req.headers["x-username"] || "";
  const id = usernameHeader.toString();
  const payload = req.body;

  const updatedUser = await UserModel.update({
    where: { id },
    data: payload,
  });

  if (updatedUser) {
    return res.json({ user: updatedUser });
  }

  return res.status(404).json({ message: "user not found" });
}

async function handleGetUser(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const usernameHeader = req.headers["x-username"] || "";
  const id = usernameHeader.toString();
  const [user, photoUrl, tokens] = await Promise.all([
    UserModel.findFirst({ where: { id } }),
    getUserPhoto(Number(usernameHeader)),
    getUserTokens(id),
  ]);

  if (user) {
    return res.json({
      user: { ...user, photoUrl: photoUrl || null, tokens },
    });
  }

  return res.status(404).json({ message: "user not found" });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    authorizeRequest(req);
  } catch (error) {
    console.error(error, "Failed to authorize");
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      return await handleGetUser(req, res);
    case "PUT":
      return await handleUpdateUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
