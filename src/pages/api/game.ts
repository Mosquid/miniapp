import { User } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { GameResult } from "@/lib/db";
import { getReferralPoints } from "@/lib/game";
import { getUserTokens } from "@/queries/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const usernameHeader = req.headers["x-username"] || "";
    const id = usernameHeader.toString();
    const tokens = parseInt(req.body.tokens);

    const user = await User.findUnique({ where: { id } });

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

    if (user.invitedById && tokens > 0) {
      console.log("user.invitedById", user.invitedById);
      const referralPoints = getReferralPoints(tokens);
      console.log("referralPoints", referralPoints);
      await GameResult.create({
        data: {
          userId: user.invitedById,
          tokensEarned: referralPoints,
          gameType: "referral",
        },
      });
    }

    const totalPoints = await getUserTokens(user.id);

    res.status(200).json({ tokens: totalPoints });
  } catch (error) {
    console.error("Failed to save game result", error);
    res.status(400).json({ message: "Failed to save game result" });
  }
}
