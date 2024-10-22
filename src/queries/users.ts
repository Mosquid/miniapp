import { GameResult, User as UserModel } from "@/lib/db";
import { User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export const getUserByReferralCode = async (
  code: string
): Promise<User | null> => {
  const user = await UserModel.findFirst({
    where: {
      referralCode: code,
    },
  });

  return user;
};

export const getUserTokens = async (userId: string): Promise<Decimal> => {
  try {
    const totalPoints = await GameResult.aggregate({
      where: { userId },
      _sum: { tokensEarned: true },
    });

    return new Decimal(totalPoints._sum.tokensEarned || 0);
  } catch (error) {
    console.error("Failed to get user tokens", error);
    return new Decimal(0);
  }
};
