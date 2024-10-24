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

export const getUserTokens = async (
  userId: string
): Promise<{
  total: Decimal;
  daily: Decimal;
}> => {
  try {
    const [totalPoints, dailyPoints] = await Promise.all([
      GameResult.aggregate({
        where: { userId },
        _sum: { tokensEarned: true },
      }),
      GameResult.aggregate({
        where: {
          userId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { tokensEarned: true },
      }),
    ]);

    return {
      total: new Decimal(totalPoints._sum.tokensEarned || 0),
      daily: new Decimal(dailyPoints._sum.tokensEarned || 0),
    };
  } catch (error) {
    console.error("Failed to get user tokens", error);
    return {
      total: new Decimal(0),
      daily: new Decimal(0),
    };
  }
};
