import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, name, phone, city, address, payment, comment, items, total } = body;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const crmUrl = process.env.GOOGLE_CRM_WEBHOOK_URL;

    if (!token || !chatId) {
      return NextResponse.json({ error: "Telegram env missing" }, { status: 500 });
    }

    let orderNumber = "";

    if (crmUrl) {
      const crmRes = await fetch(crmUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          name,
          phone,
          city,
          address,
          payment,
          comment,
          items,
          total,
        }),
      });

      const crmData = await crmRes.json().catch(() => null);
      orderNumber = crmData?.orderNumber || "";
    }

    const telegramText = orderNumber
      ? `🧾 Заказ № ${orderNumber}\n\n${text}`
      : text;

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramText,
        parse_mode: "HTML",
      }),
    });

    if (!telegramRes.ok) {
      return NextResponse.json({ error: "Telegram send failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, orderNumber });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
