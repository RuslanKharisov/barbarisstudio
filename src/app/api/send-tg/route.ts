import { NextResponse } from "next/server";

// Функция для проверки токена reCAPTCHA v3
async function verifyRecaptchaV3(
  token: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY не найдена в переменных окружения.");
    return { success: false, error: "Ошибка сервера." };
  }

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify`;

  try {
    const response = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (data.success) {
      // Устанавливаем порог score, например, 0.5
      const threshold = 0.5;
      if (data.score >= threshold) {
        return { success: true, score: data.score };
      } else {
        console.log(`reCAPTCHA score слишком низкий: ${data.score}`);
        return { success: false, error: "Проверка безопасности не пройдена." };
      }
    } else {
      console.error("reCAPTCHA v3 verification failed:", data["error-codes"]);
      return { success: false, error: "Проверка безопасности не пройдена." };
    }
  } catch (error) {
    console.error("Ошибка при проверке reCAPTCHA v3:", error);
    return { success: false, error: "Ошибка сервера." };
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  // Добавляем recaptchaToken к получаемым данным
  const { name, email, phone, messageText, recaptchaToken } = body;

  // Проверяем наличие обязательного токена капчи
  if (!recaptchaToken) {
    return NextResponse.json(
      { error: "Требуется проверка безопасности." },
      { status: 400 }
    );
  }

  // Проверяем токен капчи v3
  const recaptchaResult = await verifyRecaptchaV3(recaptchaToken);
  if (!recaptchaResult.success) {
    return NextResponse.json(
      { error: recaptchaResult.error || "Проверка безопасности не пройдена." },
      { status: 400 } // 400, так как это проблема с данными запроса
    );
  }

  console.log(`reCAPTCHA v3 score: ${recaptchaResult.score}`);

  // Проверка остальных данных формы
  if (!name || (!email && !phone)) {
    return NextResponse.json(
      { error: "Некорректные данные формы" },
      { status: 400 }
    );
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { error: "Не настроены переменные окружения" },
      { status: 500 }
    );
  }

  const message = `
barbarisstudio.vercel
👤 Имя: ${name}
📧 Email: ${email || "-"}
📱 Телефон: ${phone || "-"}
💬 Сообщение: ${messageText || "_"}
  `;

  // Убираем лишний пробел в URL
  const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const res = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Ошибка от Telegram API:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    // const telegramResult = await res.json(); // Можно раскомментировать, если нужен ответ от Telegram
    // console.log("Ответ от Telegram API:", telegramResult);

    return NextResponse.json({ success: "Сообщение успешно отправлено!" });
  } catch (error: any) {
    console.error("Ошибка при отправке в Telegram:", error);
    return NextResponse.json(
      { error: error.message || "Ошибка отправки" },
      { status: 500 }
    );
  }
}
