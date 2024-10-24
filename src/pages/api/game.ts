import { User } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { GameResult } from "@/lib/db";
import { getReferralPoints } from "@/lib/game";
import { getUserTokens } from "@/queries/users";
import { Decimal } from "@prisma/client/runtime/library";

Decimal.set({ toExpPos: 12, precision: 6 });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const usernameHeader = req.headers["x-username"] || "";
    const id = usernameHeader.toString();
    const tokens = new Decimal(Number(req.body.tokens).toFixed(6));

    const user = await User.findUnique({ where: { id } });
    console.log(tokens, "tokens");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await GameResult.create({
      data: {
        userId: user.id,
        tokensEarned: tokens,
        gameType: "numans",
      },
    });

    if (user.invitedById) {
      const referralPoints = getReferralPoints(tokens.toNumber());

      await GameResult.create({
        data: {
          userId: user.invitedById,
          tokensEarned: new Decimal(referralPoints),
          gameType: "referral",
        },
      });
    }

    const { total, daily } = await getUserTokens(user.id);

    res.status(200).json({ tokens: total, dailyTokens: daily });
  } catch (error) {
    console.error("Failed to save game result", error);
    res.status(400).json({ message: "Failed to save game result" });
  }
}
