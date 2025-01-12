import { apiClient } from "../api/base";

export interface resMessageToTg {
  success?: string;
  error?: string;
}

export const sendMessageToTg = async (
  email: string
): Promise<resMessageToTg> => {
  const telegramBotToken = "YOUR_TELEGRAM_BOT_TOKEN";
  const chatId = "YOUR_CHAT_ID";
  const message = `Новая подписка: ${email}`;

  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  return await apiClient.post(url, {
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
};
