/**
 * Каталог загружается из CatalogStore (localStorage → data/tools.json).
 * Управление: admin.html
 */
let ИНСТРУМЕНТЫ = [];


/** Сколько характеристик показывать в карточке каталога (CRO: меньше — быстрее решение) */
const ХАРАКТЕРИСТИК_В_КАРТОЧКЕ = 3;

/**
 * Контакты для hero, формы и блока «Контакты»
 * При смене номера правьте здесь
 */
const КОНТАКТЫ = {
  телефонE164: "+79153194415",
  телефон: "+7 915 319 44 15",
  whatsapp: "https://wa.me/79153194415",
  whatsappТекст: "Здравствуйте! Хочу арендовать инструмент в Красногорске.",
};

/** Карточки преимуществ на первом экране */
const ПРЕИМУЩЕСТВА_HERO = [
  {
    метка: "01",
    заголовок: "Выдача в день обращения",
    текст: "Оформим заявку по телефону или WhatsApp — инструмент можно забрать сегодня",
  },
  {
    метка: "02",
    заголовок: "Проверенный инструмент",
    текст: "Профессиональные модели Bosch, Makita, BIHUI — исправны и готовы к работе",
  },
  {
    метка: "03",
    заголовок: "Гибкие сроки аренды",
    текст: "От одних суток до нескольких недель — платите только за нужный период",
  },
  {
    метка: "04",
    заголовок: "Быстрое оформление",
    текст: "Минимум документов, понятные условия и залог — без лишней бюрократии",
  },
];

const ТЕКСТ_УСПЕХА =
  "Спасибо! Заявка принята. Перезвоним в течение 15 минут в рабочее время для подтверждения аренды. Если срочно — позвоните нам.";

/** Тексты о расходных материалах */
const РАСХОДНИКИ = {
  кратко: "Расходные материалы приобретаются отдельно.",
  полный:
    "Расходные материалы (диски, буры, коронки, шлифовальные круги и другие комплектующие) не входят в стоимость аренды инструмента и приобретаются отдельно.",
  форма: "Расходные материалы оплачиваются отдельно.",
};

(function () {
  const catalogRoot = document.getElementById("catalog-root");
  const toolSelect = document.getElementById("field-tool");
  const form = document.getElementById("rent-form");
  const formError = document.getElementById("form-error");
  const modalSuccess = document.getElementById("modal-success");
  const modalSuccessText = document.getElementById("modal-success-text");
  const modalTool = document.getElementById("modal-tool");
  const modalToolContent = document.getElementById("modal-tool-content");
  const fieldName = document.getElementById("field-name");
  const fieldPhone = document.getElementById("field-phone");
  const fieldStart = document.getElementById("field-start");
  const fieldEnd = document.getElementById("field-end");
  const fieldComment = document.getElementById("field-comment");
  const fieldConsent = document.getElementById("field-consent");
  const formSubmitBtn = document.getElementById("form-submit-btn");
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");

  let lastFocusBeforeModal = null;
  let openModalId = null;

  function formatMoney(n) {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function getWhatsAppHref() {
    return (
      КОНТАКТЫ.whatsapp + "?text=" + encodeURIComponent(КОНТАКТЫ.whatsappТекст)
    );
  }

  const SVG_WHATSAPP =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" focusable="false" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  function getToolById(id) {
    return ИНСТРУМЕНТЫ.find((t) => t.id === id);
  }

  function renderSpecsList(specs, limit) {
    const items = limit ? specs.slice(0, limit) : specs;
    const rows = items
      .map(
        (s) =>
          `<li class="spec-list__item"><span class="spec-list__name">${escapeHtml(s.название)}</span><span class="spec-list__value">${escapeHtml(s.значение)}</span></li>`
      )
      .join("");
    const more =
      limit && specs.length > limit
        ? `<li class="spec-list__more">+ ещё ${specs.length - limit} характеристик</li>`
        : "";
    return `<ul class="spec-list">${rows}${more}</ul>`;
  }

  function renderPricing(item, compact) {
    if (compact) {
      return `
        <dl class="price-block price-block--compact">
          <div class="price-block__row">
            <dt>Сутки</dt>
            <dd>${formatMoney(item.ценаЗаСутки)}</dd>
          </div>
          <div class="price-block__row">
            <dt>Неделя</dt>
            <dd>${formatMoney(item.ценаЗаНеделю)}</dd>
          </div>
          <div class="price-block__row price-block__row--deposit">
            <dt>Залог</dt>
            <dd>${formatMoney(item.залог)}</dd>
          </div>
        </dl>`;
    }
    return `
      <dl class="price-block">
        <div class="price-block__row price-block__row--main">
          <dt>Цена за сутки</dt>
          <dd>${formatMoney(item.ценаЗаСутки)}</dd>
        </div>
        <div class="price-block__row">
          <dt>Цена за неделю</dt>
          <dd>${formatMoney(item.ценаЗаНеделю)}</dd>
        </div>
        <div class="price-block__row price-block__row--deposit">
          <dt>Залог</dt>
          <dd>${formatMoney(item.залог)}</dd>
        </div>
      </dl>`;
  }

  function renderStatus(status) {
    const cls = status === "В наличии" ? "status-badge--ok" : "status-badge--busy";
    return `<span class="status-badge ${cls}">${escapeHtml(status)}</span>`;
  }

  function renderConsumablesNotice(modifier, text) {
    const msg = text || РАСХОДНИКИ.кратко;
    const modClass = modifier ? ` consumables-notice--${modifier}` : "";
    return `
      <p class="consumables-notice${modClass}" role="note">
        <span class="consumables-notice__icon" aria-hidden="true">ℹ</span>
        <span class="consumables-notice__text">${escapeHtml(msg)}</span>
      </p>`;
  }

  function renderToolCard(item) {
    const imgBlock = item.изображение
      ? `<img class="tool-card__img" src="${escapeAttr(item.изображение)}" alt="${escapeAttr(item.название)}" loading="lazy" decoding="async">`
      : `<span class="tool-card__media-fallback" aria-hidden="true">${item.плейсхолдер}</span>`;

    return `
      <article class="tool-card" data-tool-id="${escapeAttr(item.id)}">
        <div class="tool-card__media">
          ${imgBlock}
          ${renderStatus(item.статус)}
        </div>
        <div class="tool-card__body">
          <h3 class="tool-card__title">${escapeHtml(item.название)}</h3>
          <div class="tool-card__pricing">
            <p class="tool-card__price-hero">от ${formatMoney(item.ценаЗаСутки)} <span>/ сутки</span></p>
            <p class="tool-card__deposit-note">Залог: ${formatMoney(item.залог)} · неделя ${formatMoney(item.ценаЗаНеделю)}</p>
            ${renderConsumablesNotice("card")}
          </div>
          <p class="tool-card__desc">${escapeHtml(item.описание)}</p>
          <div class="tool-card__section">
            <h4 class="tool-card__subtitle">Ключевые характеристики</h4>
            ${renderSpecsList(item.характеристики, ХАРАКТЕРИСТИК_В_КАРТОЧКЕ)}
          </div>
          <div class="tool-card__actions">
            <button type="button" class="btn btn--primary js-rent" data-tool-id="${escapeAttr(item.id)}">Забронировать</button>
            <button type="button" class="btn btn--outline js-details" data-tool-id="${escapeAttr(item.id)}">Подробнее</button>
          </div>
        </div>
      </article>`;
  }

  function renderToolModalContent(item) {
    return `
      <header class="tool-modal__head">
        <span class="tool-modal__icon" aria-hidden="true">${item.плейсхолдер}</span>
        <div>
          ${renderStatus(item.статус)}
          <h3 class="tool-modal__title" id="modal-tool-title">${escapeHtml(item.название)}</h3>
        </div>
      </header>
      <div class="tool-modal__body">
        <section class="tool-modal__block">
          <h4 class="tool-modal__label">Описание</h4>
          <p class="tool-modal__text">${escapeHtml(item.описаниеПодробное)}</p>
        </section>
        <section class="tool-modal__block">
          <h4 class="tool-modal__label">Область применения</h4>
          <p class="tool-modal__text">${escapeHtml(item.областьПрименения)}</p>
        </section>
        <section class="tool-modal__block">
          <h4 class="tool-modal__label">Технические характеристики</h4>
          ${renderSpecsList(item.характеристики)}
        </section>
        <section class="tool-modal__block tool-modal__block--pricing">
          <h4 class="tool-modal__label">Стоимость аренды</h4>
          ${renderPricing(item, false)}
          ${renderConsumablesNotice("modal", РАСХОДНИКИ.полный)}
        </section>
      </div>
      <footer class="tool-modal__foot">
        <button type="button" class="btn btn--outline js-tool-modal-close">Закрыть</button>
        <button type="button" class="btn btn--primary js-rent-modal" data-tool-id="${escapeAttr(item.id)}">Забронировать</button>
      </footer>`;
  }

  function renderCatalog() {
    if (!catalogRoot) return;
    catalogRoot.innerHTML = ИНСТРУМЕНТЫ.map(renderToolCard).join("");
    fillToolSelect();
    if (typeof refreshGsapScrollReveal === "function") {
      refreshGsapScrollReveal();
    }
  }

  function refreshHeroToolsPreview() {
    const toolsPreview = document.getElementById("hero-tools-preview");
    if (!toolsPreview) return;
    if (!ИНСТРУМЕНТЫ.length) {
      toolsPreview.innerHTML = "";
      return;
    }
    toolsPreview.innerHTML = ИНСТРУМЕНТЫ.map(
      (item) =>
        `<li>${escapeHtml(item.название.replace(/\s*\([^)]*\)\s*/g, " ").trim())}</li>`
    ).join("");
  }

  function syncCatalogFromStore() {
    ИНСТРУМЕНТЫ = CatalogStore.getTools();
    renderCatalog();
    refreshHeroToolsPreview();
  }

  function fillToolSelect() {
    if (!toolSelect) return;
    toolSelect.innerHTML = '<option value="">Выберите из списка</option>';
    ИНСТРУМЕНТЫ.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.название;
      toolSelect.appendChild(opt);
    });
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    lastFocusBeforeModal = document.activeElement;
    openModalId = modalEl.id;
    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const focusTarget =
      modalEl.querySelector(".js-tool-modal-close") ||
      modalEl.querySelector(".modal__btn") ||
      modalEl.querySelector(".modal__close");
    requestAnimationFrame(() => {
      if (focusTarget) focusTarget.focus();
    });
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.is-open")) {
      document.body.classList.remove("modal-open");
    }
    if (openModalId === modalEl.id) {
      if (lastFocusBeforeModal && typeof lastFocusBeforeModal.focus === "function") {
        lastFocusBeforeModal.focus();
      }
      lastFocusBeforeModal = null;
      openModalId = null;
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal.is-open").forEach((m) => closeModal(m));
  }

  function openToolModal(id) {
    const item = getToolById(id);
    if (!item || !modalTool || !modalToolContent) return;
    modalToolContent.innerHTML = renderToolModalContent(item);
    openModal(modalTool);
  }

  function openSuccessModal() {
    if (!modalSuccess || !modalSuccessText) return;
    modalSuccessText.textContent = ТЕКСТ_УСПЕХА;
    openModal(modalSuccess);
  }

  function scrollToRentForm(toolId) {
    if (toolId) toolSelect.value = toolId;
    closeAllModals();
    document.getElementById("заявка").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => {
      if (toolId && fieldPhone && !fieldPhone.value.trim()) {
        fieldPhone.focus();
      } else if (fieldName && !fieldName.value.trim()) {
        fieldName.focus();
      } else {
        toolSelect.focus();
      }
    }, 450);
  }

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

  catalogRoot?.addEventListener("click", (e) => {
    const detailsBtn = e.target.closest(".js-details");
    if (detailsBtn) {
      openToolModal(detailsBtn.getAttribute("data-tool-id"));
      return;
    }
    const rentBtn = e.target.closest(".js-rent");
    if (rentBtn) {
      scrollToRentForm(rentBtn.getAttribute("data-tool-id"));
    }
  });

  if (modalTool) {
    modalTool.addEventListener("click", (e) => {
      if (e.target.closest(".js-tool-modal-close") || e.target.classList.contains("modal__backdrop")) {
        closeModal(modalTool);
        return;
      }
      const rentModalBtn = e.target.closest(".js-rent-modal");
      if (rentModalBtn) {
        scrollToRentForm(rentModalBtn.getAttribute("data-tool-id"));
      }
    });
  }

  if (modalSuccess) {
    modalSuccess.querySelectorAll(".js-modal-close").forEach((el) => {
      el.addEventListener("click", () => closeModal(modalSuccess));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = document.querySelector(".modal.is-open");
    if (open) closeModal(open);
  });

  function normalizePhone(raw) {
    return raw.replace(/\D/g, "");
  }

  function isPhoneOk(raw) {
    return normalizePhone(raw).length >= 10;
  }

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
    if (!fieldConsent || !fieldConsent.checked) {
      showError("Необходимо согласие на обработку персональных данных.");
      fieldConsent?.focus();
      return;
    }

    const tool = getToolById(toolSelect.value);
    const applicationData = {
      имя: fieldName.value.trim(),
      телефон: fieldPhone.value.trim(),
      инструментId: toolSelect.value,
      инструмент: tool ? tool.название : toolSelect.options[toolSelect.selectedIndex].textContent.trim(),
      датаНачала: fieldStart.value,
      датаВозврата: fieldEnd.value,
      комментарий: fieldComment?.value.trim() || "",
    };

    try {
      const app = ApplicationsStore.create(applicationData);
      void TelegramNotify.sendNewApplication(app);
    } catch (err) {
      console.error("[Заявка] Ошибка сохранения:", err);
      showError("Не удалось сохранить заявку. Попробуйте позже или позвоните нам.");
      return;
    }

    form.reset();
    fillToolSelect();
    if (fieldConsent) fieldConsent.checked = false;
    updateFormSubmitState();
    openSuccessModal();
  });

  function updateFormSubmitState() {
    if (!formSubmitBtn || !fieldConsent) return;
    formSubmitBtn.disabled = !fieldConsent.checked;
  }

  if (fieldConsent) {
    fieldConsent.addEventListener("change", updateFormSubmitState);
    updateFormSubmitState();
  }

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

  /** CSS-анимация для секций без GSAP (заявка, подвал) */
  function initCssScrollReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("reveal--visible"));
      return;
    }

    const elements = document.querySelectorAll(".reveal:not(.reveal--instant)");
    if (!elements.length || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("reveal--visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal--visible");
          observer.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );

    elements.forEach((el) => io.observe(el));
  }

  function initHeroReveal() {
    const hero = document.querySelector(".hero.reveal--instant");
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hero.classList.add("reveal--visible");
      return;
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => hero.classList.add("reveal--visible"));
    });
  }

  function initHeroBlock() {
    const contactRoot = document.getElementById("hero-contact");
    const benefitsRoot = document.getElementById("hero-benefits");

    if (contactRoot) {
      const waHref = getWhatsAppHref();
      contactRoot.innerHTML = `
        <a href="tel:${escapeAttr(КОНТАКТЫ.телефонE164)}" class="hero__contact-btn hero__contact-btn--phone">
          <span class="hero__contact-icon" aria-hidden="true">☎</span>
          <span class="hero__contact-text">
            <span class="hero__contact-label">Позвонить</span>
            <span class="hero__contact-value">${escapeHtml(КОНТАКТЫ.телефон)}</span>
          </span>
        </a>
        <a href="${escapeAttr(waHref)}" class="hero__contact-btn hero__contact-btn--wa" target="_blank" rel="noopener noreferrer">
          <span class="hero__contact-icon hero__contact-icon--wa" aria-hidden="true">${SVG_WHATSAPP}</span>
          <span class="hero__contact-text">
            <span class="hero__contact-label">WhatsApp</span>
            <span class="hero__contact-value">Написать нам</span>
          </span>
        </a>`;
    }

    if (benefitsRoot) {
      benefitsRoot.innerHTML = ПРЕИМУЩЕСТВА_HERO.map(
        (item) => `
        <li class="hero-card">
          <span class="hero-card__num" aria-hidden="true">${escapeHtml(item.метка)}</span>
          <h2 class="hero-card__title">${escapeHtml(item.заголовок)}</h2>
          <p class="hero-card__text">${escapeHtml(item.текст)}</p>
        </li>`
      ).join("");
    }

    refreshHeroToolsPreview();
  }

  function initWhatsAppFloat() {
    const floatBtn = document.getElementById("whatsapp-float");
    if (!floatBtn) return;

    floatBtn.href = getWhatsAppHref();

    const iconEl = floatBtn.querySelector(".whatsapp-float__icon");
    if (iconEl) iconEl.innerHTML = SVG_WHATSAPP;
  }

  function initSiteContacts() {
    document.querySelectorAll("[data-contact-phone]").forEach((el) => {
      el.href = "tel:" + КОНТАКТЫ.телефонE164;
      if (el.classList.contains("header-phone") || el.classList.contains("form-trust__phone") || el.classList.contains("site-footer__link") || el.classList.contains("contact-link")) {
        el.textContent = КОНТАКТЫ.телефон;
      }
    });
    document.querySelectorAll("[data-contact-phone-btn]").forEach((el) => {
      el.href = "tel:" + КОНТАКТЫ.телефонE164;
    });
    document.querySelectorAll("[data-contact-wa]").forEach((el) => {
      el.href = getWhatsAppHref();
    });
  }

  function initFormCro() {
    const today = new Date().toISOString().split("T")[0];
    if (fieldStart) fieldStart.min = today;
    if (fieldEnd) fieldEnd.min = today;
    if (fieldStart && fieldEnd) {
      fieldStart.addEventListener("change", () => {
        fieldEnd.min = fieldStart.value || today;
      });
    }
  }

  function initMobileCtaBar() {
    const bar = document.getElementById("mobile-cta-bar");
    const hero = document.getElementById("главная");
    if (!bar || !hero) return;

    const mq = window.matchMedia("(max-width: 768px)");
    let visible = false;

    function update() {
      if (!mq.matches) {
        bar.hidden = true;
        document.body.classList.remove("has-mobile-cta");
        return;
      }
      const pastHero = window.scrollY > hero.offsetHeight * 0.5;
      if (pastHero !== visible) {
        visible = pastHero;
        bar.hidden = !visible;
        document.body.classList.toggle("has-mobile-cta", visible);
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    mq.addEventListener("change", update);
    update();
  }

  function initFaqAccordion() {
    const root = document.getElementById("faq-accordion");
    if (!root) return;

    const items = Array.from(root.querySelectorAll(".faq-item"));

    function closeItem(item) {
      const trigger = item.querySelector(".faq-item__trigger");
      const panel = item.querySelector(".faq-item__panel");
      if (!trigger || !panel) return;
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    }

    function openItem(item) {
      const trigger = item.querySelector(".faq-item__trigger");
      const panel = item.querySelector(".faq-item__panel");
      if (!trigger || !panel) return;
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }

    items.forEach((item) => {
      const trigger = item.querySelector(".faq-item__trigger");
      if (!trigger) return;

      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        if (isOpen) {
          closeItem(item);
        } else {
          openItem(item);
        }
      });
    });

    root.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const open = items.find((item) => item.classList.contains("is-open"));
      if (!open) return;
      closeItem(open);
      open.querySelector(".faq-item__trigger")?.focus();
    });
  }

  async function bootstrap() {
    try {
      await CatalogStore.init();
      syncCatalogFromStore();
      CatalogStore.onChange(syncCatalogFromStore);
    } catch (err) {
      console.error("[Catalog] Ошибка загрузки каталога:", err);
      if (catalogRoot) {
        catalogRoot.innerHTML =
          '<p class="catalog-error">Не удалось загрузить каталог. Откройте сайт через локальный сервер или обновите страницу.</p>';
      }
      return;
    }

    initHeroBlock();
    initSiteContacts();
    initWhatsAppFloat();
    initFormCro();
    initFaqAccordion();
    initMobileCtaBar();
    initHeroReveal();

    if (typeof initGsapScrollReveal === "function" && initGsapScrollReveal()) {
      window.addEventListener("load", () => {
        if (typeof refreshGsapScrollReveal === "function") refreshGsapScrollReveal();
      });
    }

    initCssScrollReveal();
  }

  bootstrap();
})();
