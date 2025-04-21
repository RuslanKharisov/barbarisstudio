import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const { name, email, phone } = body;

    if (!name || (!email && !phone)) {
        return NextResponse.json({ error: "Некорректные данные формы" }, { status: 400 });
    }

    const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return NextResponse.json({ error: "Не настроены переменные окружения" }, { status: 500 });
    }

    const message = `
💬 Новая заявка:
👤 Имя: ${name}
📧 Email: ${email || "-"}
📱 Телефон: ${phone || "-"}
  `;

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
            return NextResponse.json({ error: err }, { status: 500 });
        }

        return NextResponse.json({ success: "Сообщение успешно отправлено!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Ошибка отправки" }, { status: 500 });
    }
}
