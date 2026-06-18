/**
 * CatalogStore — слой данных каталога.
 * Сейчас: localStorage. Позже: заменить adapter на ApiAdapter (fetch к REST API).
 */
const CatalogStore = (function () {
  const STORAGE_KEY = "tool_rental_catalog_v1";
  const AUTH_HASH_KEY = "tool_rental_admin_password_hash";
  const SESSION_KEY = "tool_rental_admin_session";
  const DEFAULT_JSON_PATH = "data/tools.json";
  const DEFAULT_PASSWORD = "admin123";
  const SESSION_HOURS = 8;
  const MAX_IMAGE_BYTES = 900000;

  /** @type {object|null} */
  let adapter = null;
  /** @type {Array|null} */
  let cache = null;
  const listeners = new Set();

  // ——— Адаптер localStorage (этап 1) ———

  const localStorageAdapter = {
    name: "localStorage",

    async load() {
      const raw = localStorage.getItem(STORAGE_KEY);
      let data = null;

      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch {
          console.warn("[CatalogStore] Повреждённые данные в localStorage, восстановление из резервной копии");
        }
      }

      // Пустой или отсутствующий каталог — восстанавливаем из data/tools.json (не перезаписываем непустой)
      if (!Array.isArray(data) || data.length === 0) {
        data = await loadDefaults();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.info("[CatalogStore] Каталог восстановлен из резервной копии:", data.length, "инструментов");
      }

      return data;
    },

    async save(tools) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
      return tools;
    },
  };

  // ——— Заготовка ApiAdapter (этап 2 — серверная БД) ———
  // const apiAdapter = {
  //   name: "api",
  //   async load() {
  //     const res = await fetch("/api/tools", { credentials: "include" });
  //     if (!res.ok) throw new Error("API load failed");
  //     return res.json();
  //   },
  //   async save(tools) {
  //     const res = await fetch("/api/tools", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify(tools),
  //     });
  //     if (!res.ok) throw new Error("API save failed");
  //     return res.json();
  //   },
  // };

  function useAdapter(customAdapter) {
    adapter = customAdapter || localStorageAdapter;
  }

  /** Загрузка исходного каталога: fetch → TOOLS_SEED (file://) */
  async function loadDefaults() {
    try {
      const res = await fetch(DEFAULT_JSON_PATH);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Пустой tools.json");
      return data;
    } catch (fetchErr) {
      if (typeof TOOLS_SEED !== "undefined" && Array.isArray(TOOLS_SEED) && TOOLS_SEED.length > 0) {
        console.warn("[CatalogStore] fetch недоступен, используется TOOLS_SEED:", fetchErr.message);
        return TOOLS_SEED;
      }
      throw new Error("Не удалось загрузить каталог: " + fetchErr.message);
    }
  }

  function notify() {
    listeners.forEach((fn) => {
      try {
        fn(getTools());
      } catch (e) {
        console.error("[CatalogStore] listener error", e);
      }
    });
    window.dispatchEvent(new CustomEvent("catalog:updated", { detail: getTools() }));
  }

  async function hashPassword(password) {
    if (globalThis.crypto?.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
      return Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    // file:// — crypto.subtle недоступен
    let h = 5381;
    for (let i = 0; i < password.length; i++) {
      h = ((h << 5) + h) ^ password.charCodeAt(i);
    }
    return "local_" + (h >>> 0).toString(16);
  }

  async function ensurePasswordHash() {
    if (!localStorage.getItem(AUTH_HASH_KEY)) {
      localStorage.setItem(AUTH_HASH_KEY, await hashPassword(DEFAULT_PASSWORD));
    }
  }

  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[а-яё]/gi, (ch) => {
        const map = {
          а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
          и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
          с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
          ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
        };
        return map[ch.toLowerCase()] || ch;
      })
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "tool";
  }

  function generateId(name, existingIds) {
    let base = slugify(name);
    let id = base;
    let n = 2;
    while (existingIds.has(id)) {
      id = `${base}-${n++}`;
    }
    return id;
  }

  function normalizeTool(raw) {
    return {
      id: String(raw.id || "").trim(),
      название: String(raw.название || "").trim(),
      описание: String(raw.описание || "").trim(),
      описаниеПодробное: String(raw.описаниеПодробное || raw.описание || "").trim(),
      областьПрименения: String(raw.областьПрименения || "").trim(),
      ценаЗаСутки: Number(raw.ценаЗаСутки) || 0,
      ценаЗаНеделю: Number(raw.ценаЗаНеделю) || 0,
      залог: Number(raw.залог) || 0,
      статус: raw.статус === "Нет в наличии" || raw.статус === "Забронирован" ? raw.статус : "В наличии",
      плейсхолдер: String(raw.плейсхолдер || "🔧").trim() || "🔧",
      изображение: String(raw.изображение || "").trim(),
      характеристики: Array.isArray(raw.характеристики)
        ? raw.характеристики.map((s) => ({
            название: String(s.название || "").trim(),
            значение: String(s.значение || "").trim(),
          })).filter((s) => s.название && s.значение)
        : [],
    };
  }

  function validateTool(tool) {
    const errors = [];
    if (!tool.название) errors.push("Укажите название инструмента.");
    if (tool.ценаЗаСутки < 0) errors.push("Цена за сутки не может быть отрицательной.");
    if (tool.залог < 0) errors.push("Залог не может быть отрицательным.");
    return errors;
  }

  async function persist() {
    cache = await adapter.save(cache);
    notify();
    return cache;
  }

  async function init(options = {}) {
    useAdapter(options.adapter);
    await ensurePasswordHash();
    cache = (await adapter.load()).map(normalizeTool);
    window.addEventListener("storage", (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          cache = JSON.parse(e.newValue).map(normalizeTool);
          notify();
        } catch {
          /* ignore */
        }
      }
    });
    return cache;
  }

  function getTools() {
    return cache ? [...cache] : [];
  }

  function getToolById(id) {
    return cache?.find((t) => t.id === id) || null;
  }

  async function saveTools(tools) {
    cache = tools.map(normalizeTool);
    return persist();
  }

  async function createTool(data) {
    const ids = new Set(getTools().map((t) => t.id));
    const tool = normalizeTool({
      ...data,
      id: data.id || generateId(data.название || "tool", ids),
    });
    const errors = validateTool(tool);
    if (errors.length) throw new Error(errors.join(" "));
    if (ids.has(tool.id)) throw new Error("Инструмент с таким ID уже существует.");
    cache = [...getTools(), tool];
    return persist();
  }

  async function updateTool(id, data) {
    const idx = cache.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Инструмент не найден.");
    const tool = normalizeTool({ ...cache[idx], ...data, id });
    const errors = validateTool(tool);
    if (errors.length) throw new Error(errors.join(" "));
    cache = [...cache];
    cache[idx] = tool;
    return persist();
  }

  async function deleteTool(id) {
    cache = getTools().filter((t) => t.id !== id);
    return persist();
  }

  async function resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    const data = await loadDefaults();
    cache = data.map(normalizeTool);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
    notify();
    return cache;
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  // ——— Авторизация админки ———

  async function login(password) {
    const hash = await hashPassword(password);
    const stored = localStorage.getItem(AUTH_HASH_KEY);
    if (hash !== stored) return false;
    const session = {
      token: crypto.randomUUID(),
      expires: Date.now() + SESSION_HOURS * 3600000,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function isAuthenticated() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (Date.now() > session.expires) {
        logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  async function changePassword(currentPassword, newPassword) {
    if (!(await login(currentPassword))) throw new Error("Неверный текущий пароль.");
    if (!newPassword || newPassword.length < 6) throw new Error("Новый пароль — минимум 6 символов.");
    localStorage.setItem(AUTH_HASH_KEY, await hashPassword(newPassword));
    return true;
  }

  // ——— Загрузка изображений (base64 в localStorage) ———

  function compressImage(file, maxWidth = 960, quality = 0.82) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Не удалось прочитать изображение."));
      };
      img.src = url;
    });
  }

  async function uploadImage(file) {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("Выберите файл изображения (JPG, PNG, WebP).");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Файл слишком большой (макс. 5 МБ до сжатия).");
    }
    const dataUrl = await compressImage(file);
    const approxBytes = Math.ceil((dataUrl.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      throw new Error("После сжатия изображение всё ещё слишком большое. Используйте URL или меньший файл.");
    }
    return dataUrl;
  }

  return {
    STORAGE_KEY,
    DEFAULT_PASSWORD,
    STATUSES: ["В наличии", "Нет в наличии", "Забронирован"],
    init,
    useAdapter,
    getTools,
    getToolById,
    saveTools,
    createTool,
    updateTool,
    deleteTool,
    resetToDefaults,
    onChange,
    login,
    logout,
    isAuthenticated,
    changePassword,
    uploadImage,
    generateId,
    normalizeTool,
    validateTool,
  };
})();
