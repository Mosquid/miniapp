import TelegramBot from "node-telegram-bot-api";

const API_KEY: string = process.env.BOT_API_KEY || "";

export async function getUserPhoto(
  userId: number
): Promise<string | undefined> {
  if (typeof window !== "undefined") {
    try {
      const bot = new TelegramBot(API_KEY, { polling: false });
      const photos = await bot.getUserProfilePhotos(userId);
      const [photo] = photos.photos;
      return await bot.getFileLink(photo[1].file_id);
    } catch (error) {
      console.error("[getUserPhoto]", error);
    }
  }
}
