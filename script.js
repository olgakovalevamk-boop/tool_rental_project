/**
 * ============================================
 * КАТАЛОГ: инструменты, цены, характеристики
 * ============================================
 */
const ИНСТРУМЕНТЫ = [
  {
    id: "tile-cutter-bihui",
    название: "Электрический плиткорез BIHUI LFECMR New",
    описание:
      "Профессиональный электрический плиткорез для крупноформатной керамической плитки и керамогранита.",
    описаниеПодробное:
      "Модель BIHUI LFECMR New рассчитана на точный рез крупноформатной плитки и керамогранита. Высокая частота вращения и мощный двигатель 1500 Вт обеспечивают ровный срез без сколов. Подходит для монтажных бригад и частных мастеров, которым нужен надёжный инструмент на объекте.",
    областьПрименения:
      "Резка крупноформатной плитки и керамогранита, подрезка плит под углом, работы при укладке напольных и настенных покрытий в квартирах, домах и коммерческих помещениях.",
    ценаЗаСутки: 5400,
    ценаЗаНеделю: 34000,
    залог: 54000,
    статус: "В наличии",
    плейсхолдер: "◫",
    изображение: "images/Плиткорез.jpg",
    характеристики: [
      { название: "Тип", значение: "электрический плиткорез" },
      { название: "Номинальное напряжение", значение: "220 В" },
      { название: "Мощность", значение: "1500 Вт" },
      { название: "Обороты", значение: "13000 об/мин" },
      { название: "Диаметр посадки диска", значение: "22,2 мм" },
      { название: "Макс. диаметр диска", значение: "125 мм" },
      { название: "Максимальная толщина резки", значение: "17 мм" },
      { название: "Вес нетто", значение: "12,8 кг" },
    ],
  },
  {
    id: "demolisher-makita",
    название: "Отбойный молоток Makita HM0870C",
    описание:
      "Мощный отбойный молоток SDS Max для демонтажа бетона, кирпича и тяжёлых штробительных работ.",
    описаниеПодробное:
      "Makita HM0870C — профессиональный отбойный молоток с энергией удара 11,6 Дж и регулировкой частоты ударов. Патрон SDS Max и режим долбления делают его незаменимым при демонтаже стен, полов и проёмов.",
    областьПрименения:
      "Демонтаж бетона и кирпича, пробивка проёмов, штробление, снятие старых покрытий, разрушение монолитных конструкций на стройплощадке и в ремонте.",
    ценаЗаСутки: 1200,
    ценаЗаНеделю: 7550,
    залог: 14000,
    статус: "В наличии",
    плейсхолдер: "🔨",
    изображение: "images/Отбойный молоток.jpeg",
    характеристики: [
      { название: "Мощность", значение: "1110 Вт" },
      { название: "Патрон", значение: "SDS Max" },
      { название: "Тип хвостовика", значение: "SDS Max" },
      { название: "Режим работы", значение: "долбление" },
      { название: "Энергия удара", значение: "11,6 Дж" },
      { название: "Частота ударов", значение: "1100–2650 уд/мин" },
      { название: "Регулировка оборотов", значение: "есть" },
      { название: "Вес", значение: "5,6 кг" },
    ],
  },
  {
    id: "perforator-bosch",
    название: "Перфоратор Bosch GBH 240 Professional",
    описание:
      "Трёхрежимный перфоратор SDS-plus для сверления и долбления бетона, кирпича, дерева и металла.",
    описаниеПодробное:
      "Bosch GBH 240 Professional (0611272100) — компактный перфоратор с силой удара 2,7 Дж по EPTA. Три режима работы, предохранительная муфта и широкий диапазон сверления — от шурупов до коронок по кирпичу.",
    областьПрименения:
      "Сверление отверстий в бетоне и кирпиче, анкеровка, монтаж каркасов, штробление, работы с коронками, ремонт и отделка в квартирах и на объектах.",
    ценаЗаСутки: 1100,
    ценаЗаНеделю: 6900,
    залог: 7600,
    статус: "В наличии",
    плейсхолдер: "⚡",
    изображение: "images/Перфоратор.webp",
    характеристики: [
      { название: "Тип хвостовика", значение: "SDS-plus" },
      { название: "Мощность", значение: "790 Вт" },
      { название: "Количество режимов", значение: "3" },
      { название: "Макс. сила удара", значение: "2,7 Дж" },
      { название: "Реверс", значение: "поворотом щёток" },
      { название: "Виброзащита", значение: "нет" },
      { название: "Макс. диаметр сверления буром (бетон)", значение: "24 мм" },
      { название: "Длина кабеля", значение: "4 м" },
      { название: "Вес нетто", значение: "2,8 кг" },
      { название: "Габариты без упаковки", значение: "367×82×210 мм" },
      { название: "Частота вращения шпинделя", значение: "0–930 об/мин" },
      { название: "Регулировка частоты вращения", значение: "есть" },
      { название: "Частота ударов", значение: "0–4200 уд/мин" },
      { название: "Макс. диаметр сверления (дерево)", значение: "30 мм" },
      { название: "Макс. диаметр сверления (металл)", значение: "13 мм" },
      { название: "Макс. диаметр сверления коронкой (кирпич)", значение: "68 мм" },
      { название: "Предохранительная муфта", значение: "да" },
      { название: "Высокая сила удара (EPTA)", значение: "2,7 Дж" },
    ],
  },
  {
    id: "grinder-elitech",
    название: "Шлифмашина угловая МШУ 1412Э Elitech 194411",
    описание:
      "Сетевая углошлифовальная машина 125 мм с регулировкой оборотов и виброручкой.",
    описаниеПодробное:
      "Elitech МШУ 1412Э — универсальная «болгарка» 125 мм с плавным пуском, поддержанием оборотов под нагрузкой и виброручкой. Подходит для резки и шлифования металла, плитки и бетона на ремонте и стройке.",
    областьПрименения:
      "Резка и зачистка металла, шлифование сварных швов, подрезка плитки и камня, работы по бетону, подготовка поверхностей перед покраской и укладкой.",
    ценаЗаСутки: 500,
    ценаЗаНеделю: 3150,
    залог: 3350,
    статус: "В наличии",
    плейсхолдер: "◎",
    изображение: "images/Шлифмашина.jpeg",
    характеристики: [
      { название: "Напряжение", значение: "220 В" },
      { название: "Мощность", значение: "1400 Вт" },
      { название: "Тип двигателя", значение: "щеточный" },
      { название: "Диаметр диска", значение: "125 мм" },
      { название: "Посадочный диаметр", значение: "22,2 мм" },
      { название: "Резьба шпинделя", значение: "М14" },
      { название: "Число оборотов", значение: "2000–9000 об/мин" },
      { название: "Электр. регулировка оборотов", значение: "есть" },
      { название: "Вид кнопки включения", значение: "сдвижная клавиша" },
      { название: "Кнопка фиксации пуска", значение: "да" },
      { название: "Работа по бетону (камню)", значение: "да" },
      { название: "Регулировка положения кожуха без инструмента", значение: "да" },
      { название: "Поддержание постоянных оборотов под нагрузкой", значение: "да" },
      { название: "Наличие виброручки", значение: "да" },
      { название: "Защита от перегрева двигателя", значение: "есть" },
      { название: "Длина кабеля", значение: "3 м" },
      { название: "Плавный пуск", значение: "да" },
      { название: "Длина инструмента", значение: "320 мм" },
      { название: "Количество положений рукоятки", значение: "2" },
      { название: "Макс. глубина реза", значение: "35 мм" },
      { название: "Габариты без упаковки", значение: "320×220×110 мм" },
      { название: "Вес нетто", значение: "2,8 кг" },
      { название: "Диск в комплекте", значение: "нет" },
    ],
  },
  {
    id: "grinder-worx",
    название: "УШМ аккумуляторная WORX WX801 20V 76 мм",
    описание:
      "Компактная аккумуляторная углошлифовальная машина 76 мм для резки и шлифования в стеснённых условиях.",
    описаниеПодробное:
      "WORX WX801 — лёгкая аккумуляторная «болгарка» на 20 В с диском 76 мм. Быстрая замена дисков, блокировка шпинделя и защитный кожух. Для работы нужен один аккумулятор 20V (в комплект аренды уточняйте при заказе).",
    областьПрименения:
      "Резка и шлифование в труднодоступных местах, мелкий ремонт, обработка металла и плитки, работы без сети 220 В на объекте.",
    ценаЗаСутки: 1200,
    ценаЗаНеделю: 7560,
    залог: 8000,
    статус: "В наличии",
    плейсхолдер: "⚙",
    изображение: "images/Болгарка.jpg",
    характеристики: [
      { название: "Диаметр диска", значение: "76 мм" },
      { название: "Диаметр посадочного отверстия", значение: "9,5 мм" },
      { название: "Режимы работы", значение: "резка / шлифование" },
      { название: "Резьба шпинделя", значение: "М6" },
      { название: "Блокировка шпинделя", значение: "да" },
      { название: "Быстрая замена дисков", значение: "да" },
      { название: "Плавная регулировка скорости", значение: "нет" },
      { название: "Защитный кожух", значение: "да" },
      { название: "Напряжение", значение: "20 В" },
      { название: "Тип двигателя", значение: "щеточный" },
      { название: "Напряжение аккумулятора", значение: "20 В" },
      { название: "Частота вращения", значение: "19500 об/мин" },
      { название: "Уровень вибрации", значение: "3,693" },
      { название: "Уровень шума", значение: "91,9 дБ" },
      { название: "Аккумуляторов 20V для работы", значение: "1" },
      { название: "Вес", значение: "2,4 кг" },
    ],
  },
];

/** Сколько характеристик показывать в карточке каталога */
const ХАРАКТЕРИСТИК_В_КАРТОЧКЕ = 5;

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
  "Спасибо! Ваша заявка отправлена. Мы свяжемся с вами для подтверждения аренды.";

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
          <p class="tool-card__desc">${escapeHtml(item.описание)}</p>
          <div class="tool-card__section">
            <h4 class="tool-card__subtitle">Область применения</h4>
            <p class="tool-card__use">${escapeHtml(item.областьПрименения)}</p>
          </div>
          <div class="tool-card__section">
            <h4 class="tool-card__subtitle">Характеристики</h4>
            ${renderSpecsList(item.характеристики, ХАРАКТЕРИСТИК_В_КАРТОЧКЕ)}
          </div>
          ${renderPricing(item, true)}
          <div class="tool-card__actions">
            <button type="button" class="btn btn--outline js-details" data-tool-id="${escapeAttr(item.id)}">Подробнее</button>
            <button type="button" class="btn btn--primary js-rent" data-tool-id="${escapeAttr(item.id)}">Арендовать</button>
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
        </section>
      </div>
      <footer class="tool-modal__foot">
        <button type="button" class="btn btn--outline js-tool-modal-close">Закрыть</button>
        <button type="button" class="btn btn--primary js-rent-modal" data-tool-id="${escapeAttr(item.id)}">Арендовать</button>
      </footer>`;
  }

  function renderCatalog() {
    catalogRoot.innerHTML = ИНСТРУМЕНТЫ.map(renderToolCard).join("");
    fillToolSelect();
  }

  function fillToolSelect() {
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
    setTimeout(() => toolSelect.focus(), 400);
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

  catalogRoot.addEventListener("click", (e) => {
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

  form.addEventListener("submit", (e) => {
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

    form.reset();
    fillToolSelect();
    openSuccessModal();
  });

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
    const toolsPreview = document.getElementById("hero-tools-preview");

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

    if (toolsPreview && ИНСТРУМЕНТЫ.length) {
      toolsPreview.innerHTML = ИНСТРУМЕНТЫ.map(
        (item) =>
          `<li>${escapeHtml(item.название.replace(/\s*\([^)]*\)\s*/g, " ").trim())}</li>`
      ).join("");
    }
  }

  function initWhatsAppFloat() {
    const floatBtn = document.getElementById("whatsapp-float");
    if (!floatBtn) return;

    floatBtn.href = getWhatsAppHref();

    const iconEl = floatBtn.querySelector(".whatsapp-float__icon");
    if (iconEl) iconEl.innerHTML = SVG_WHATSAPP;
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

  initHeroBlock();
  initWhatsAppFloat();
  initFaqAccordion();
  initHeroReveal();
  renderCatalog();

  if (typeof initGsapScrollReveal === "function" && initGsapScrollReveal()) {
    window.addEventListener("load", () => {
      if (typeof refreshGsapScrollReveal === "function") refreshGsapScrollReveal();
    });
  }

  initCssScrollReveal();
})();
