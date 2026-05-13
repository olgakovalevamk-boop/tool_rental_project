/**
 * ============================================
 * КАТАЛОГ: список инструментов, цены и залоги
 * Меняйте ценаЗаСутки, залог, описание и эмодзи-плейсхолдер здесь
 * ============================================
 */
const ИНСТРУМЕНТЫ = [
  {
    id: "drill",
    название: "Дрель",
    описание: "Для сверления дерева, металла и пластика",
    ценаЗаСутки: 350,
    залог: 2000,
    плейсхолдер: "🔧",
  },
  {
    id: "perforator",
    название: "Перфоратор",
    описание: "Для бетона, кирпича и демонтажных работ",
    ценаЗаСутки: 550,
    залог: 4000,
    плейсхолдер: "⚡",
  },
  {
    id: "tile-cutter",
    название: "Машинка для резки плитки",
    описание: "Для аккуратной резки керамической плитки и керамогранита",
    ценаЗаСутки: 480,
    залог: 3500,
    плейсхолдер: "◫",
  },
  {
    id: "laser",
    название: "Профессиональный ротационный лазер",
    описание: "Для точной разметки, выравнивания и строительных работ",
    ценаЗаСутки: 800,
    залог: 8000,
    плейсхолдер: "📐",
  },
];

/** Текст успешной отправки (можно изменить при необходимости) */
const ТЕКСТ_УСПЕХА =
  "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами для подтверждения аренды.";

(function () {
  const catalogRoot = document.getElementById("catalog-root");
  const toolSelect = document.getElementById("field-tool");
  const form = document.getElementById("rent-form");
  const formError = document.getElementById("form-error");
  const formSuccess = document.getElementById("form-success");
  const fieldName = document.getElementById("field-name");
  const fieldPhone = document.getElementById("field-phone");
  const fieldStart = document.getElementById("field-start");
  const fieldEnd = document.getElementById("field-end");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  /* ---------- Рендер каталога ---------- */
  function formatMoney(n) {
    return (
      new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
      }).format(n)
    );
  }

  function renderCatalog() {
    catalogRoot.innerHTML = "";
    ИНСТРУМЕНТЫ.forEach((item) => {
      const article = document.createElement("article");
      article.className = "tool-card";
      article.innerHTML = `
        <div class="tool-card__media" aria-hidden="true">${item.плейсхолдер}</div>
        <div class="tool-card__body">
          <h3 class="tool-card__title">${escapeHtml(item.название)}</h3>
          <p class="tool-card__desc">${escapeHtml(item.описание)}</p>
          <div class="tool-card__meta">
            <span class="tool-card__price">Цена за сутки: ${formatMoney(item.ценаЗаСутки)}</span>
            <span class="tool-card__deposit">Залог: ${formatMoney(item.залог)}</span>
          </div>
          <button type="button" class="btn btn--primary js-rent" data-tool-id="${escapeAttr(item.id)}">Арендовать</button>
        </div>
      `;
      catalogRoot.appendChild(article);
    });

    toolSelect.innerHTML = '<option value="">Выберите из списка</option>';
    ИНСТРУМЕНТЫ.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.название;
      toolSelect.appendChild(opt);
    });
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  /* ---------- Плавная прокрутка по якорям ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const id = this.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        closeMenu();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    });
  });

  /* ---------- Кнопка «Арендовать» — подстановка в форму ---------- */
  catalogRoot.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-rent");
    if (!btn) return;
    const id = btn.getAttribute("data-tool-id");
    toolSelect.value = id;
    document.getElementById("заявка").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => toolSelect.focus(), 400);
  });

  /* ---------- Валидация телефона (простая) ---------- */
  function normalizePhone(raw) {
    return raw.replace(/\D/g, "");
  }

  function isPhoneOk(raw) {
    const digits = normalizePhone(raw);
    return digits.length >= 10;
  }

  /* ---------- Даты: возврат не раньше начала ---------- */
  function validateDates() {
    const s = fieldStart.value;
    const en = fieldEnd.value;
    if (!s || !en) return { ok: true, message: "" };
    if (new Date(en) < new Date(s)) {
      return { ok: false, message: "Дата возврата не может быть раньше даты начала аренды." };
    }
    return { ok: true, message: "" };
  }

  function showError(msg) {
    formError.textContent = msg;
    formError.hidden = !msg;
  }

  function hideSuccess() {
    formSuccess.hidden = true;
    formSuccess.textContent = ТЕКСТ_УСПЕХА;
  }

  /* ---------- Отправка формы (имитация, без сервера) ---------- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideSuccess();
    showError("");

    if (!fieldName.value.trim()) {
      showError("Укажите имя.");
      fieldName.focus();
      return;
    }
    if (!isPhoneOk(fieldPhone.value)) {
      showError("Укажите корректный номер телефона.");
      fieldPhone.focus();
      return;
    }
    if (!toolSelect.value) {
      showError("Выберите инструмент из списка.");
      toolSelect.focus();
      return;
    }
    if (!fieldStart.value || !fieldEnd.value) {
      showError("Заполните дату начала и дату возврата.");
      return;
    }
    const dates = validateDates();
    if (!dates.ok) {
      showError(dates.message);
      return;
    }

    // Имитация отправки (здесь можно добавить console.log данных при отладке)
    form.reset();
    toolSelect.innerHTML = '<option value="">Выберите из списка</option>';
    ИНСТРУМЕНТЫ.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.название;
      toolSelect.appendChild(opt);
    });

    formSuccess.textContent = ТЕКСТ_УСПЕХА;
    formSuccess.hidden = false;
    formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------- Мобильное меню ---------- */
  function closeMenu() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
  }

  if (burger && nav) {
    burger.addEventListener("click", toggleMenu);
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  renderCatalog();
})();
