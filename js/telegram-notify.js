/**
 * Отправка уведомлений о новых заявках в Telegram Bot API.
 * При ошибке сети или CORS заявка всё равно сохраняется в localStorage.
 */
const TelegramNotify = (function () {
  function formatDate(iso) {
    return ApplicationsStore.formatDateTime(iso);
  }

  function buildMessage(app) {
    const comment = app.комментарий || "—";
    return (
      "🔔 Новая заявка\n\n" +
      `👤 Клиент: ${app.имя}\n\n` +
      `📞 Телефон: ${app.телефон}\n\n` +
      `🛠 Инструмент: ${app.инструмент}\n\n` +
      `💬 Комментарий:\n${comment}\n\n` +
      `🕒 Дата:\n${formatDate(app.createdAt)}`
    );
  }

  async function sendNewApplication(app) {
    const cfg = typeof TelegramConfig !== "undefined" ? TelegramConfig : {};
    const token = cfg.BOT_TOKEN;
    const chatId = cfg.CHAT_ID;

    if (!token || !chatId) {
      console.warn("[Telegram] BOT_TOKEN или CHAT_ID не заданы в js/telegram-config.js");
      return { ok: false, reason: "not_configured" };
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: buildMessage(app),
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("[Telegram] Ошибка API:", res.status, body);
        return { ok: false, reason: "api_error" };
      }

      return { ok: true };
    } catch (err) {
      console.warn("[Telegram] Недоступен:", err.message);
      return { ok: false, reason: "network" };
    }
  }

  return { sendNewApplication, buildMessage };
})();
