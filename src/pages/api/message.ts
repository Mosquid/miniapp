import { User } from "@/lib/db";
import { generateReferralCode } from "@/lib/strings";
import { getUserByReferralCode } from "@/queries/users";
import { NextApiRequest, NextApiResponse } from "next/types";
import { Message } from "node-telegram-bot-api";

function isStartWithReferralCode(req: NextApiRequest) {
  try {
    if (req.body && req.body.message && req.body.message.text) {
      const text = req.body.message.text;

      const pattern = /^\/start\s+[a-zA-Z0-9]{8}$/;
      return pattern.test(text);
    }

    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function handleSetInvitedBy(req: NextApiRequest, res: NextApiResponse) {
  try {
    const from: Message["from"] = req.body.message.from;
    const id = String(from?.id);
    const referralCode = req.body.message.text.split(" ")[1];
    const invitedByUser = await getUserByReferralCode(referralCode);

    if (!invitedByUser) {
      return res.status(200).json({ message: "Referral code not found" });
    }

    const user = await User.upsert({
      where: { id },
      update: {
        updatedAt: new Date(),
      },
      create: {
        name: `${from?.first_name} ${from?.last_name}`,
        id,
        username: from?.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        tokens: 0,
        referralCode: generateReferralCode(),
        invitedBy: invitedByUser
          ? { connect: { id: invitedByUser.id } }
          : undefined,
      },
    });

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: (error as Error).message });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (isStartWithReferralCode(req)) {
    return handleSetInvitedBy(req, res);
  }

  return res.status(200).json({ message: "ok" });
}
