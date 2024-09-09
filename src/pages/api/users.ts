"use server";

import { User as UserModel } from "@/lib/db";
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
  const username = usernameHeader.toString();
  const payload = req.body;

  const updatedUser = await UserModel.update({
    where: { username },
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
  const user = await UserModel.findFirst({ where: { id } });

  if (user) {
    return res.json({ user });
  }

  return res.status(404).json({ message: "user not found" });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  switch (req.method) {
    case "GET":
      return await handleGetUser(req, res);
    case "PUT":
      return await handleUpdateUser(req, res);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
