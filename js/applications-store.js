/**
 * ApplicationsStore — хранение заявок на аренду в localStorage.
 */
const ApplicationsStore = (function () {
  const STORAGE_KEY = "toolRentalApplications";
  const STATUSES = ["Новая", "В работе", "Завершена", "Отменена"];
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      console.warn("[ApplicationsStore] Повреждённые данные, сброс списка заявок");
      return [];
    }
  }

  function save(apps) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    listeners.forEach((fn) => fn(apps));
    return apps;
  }

  function generateId() {
    return `app_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function getAll() {
    return load().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function getById(id) {
    return load().find((a) => a.id === id) || null;
  }

  function getCounts() {
    const apps = load();
    return {
      новые: apps.filter((a) => a.статус === "Новая").length,
      вРаботе: apps.filter((a) => a.статус === "В работе").length,
      завершено: apps.filter((a) => a.статус === "Завершена").length,
    };
  }

  function create(data) {
    const app = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      имя: String(data.имя || "").trim(),
      телефон: String(data.телефон || "").trim(),
      инструмент: String(data.инструмент || "").trim(),
      инструментId: data.инструментId || "",
      датаНачала: data.датаНачала || "",
      датаВозврата: data.датаВозврата || "",
      комментарий: String(data.комментарий || "").trim(),
      статус: "Новая",
    };
    const apps = load();
    apps.unshift(app);
    save(apps);
    return app;
  }

  function updateStatus(id, status) {
    if (!STATUSES.includes(status)) throw new Error("Недопустимый статус заявки.");
    const apps = load();
    const idx = apps.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Заявка не найдена.");
    apps[idx] = { ...apps[idx], статус: status };
    save(apps);
    return apps[idx];
  }

  function deleteApplication(id) {
    const apps = load();
    const next = apps.filter((a) => a.id !== id);
    if (next.length === apps.length) throw new Error("Заявка не найдена.");
    save(next);
  }

  function onChange(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  function formatDateTime(iso) {
    if (!iso) return "—";
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  }

  function formatDateOnly(value) {
    if (!value) return "—";
    const d = new Date(value + "T00:00:00");
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(d);
  }

  return {
    STORAGE_KEY,
    STATUSES,
    getAll,
    getById,
    getCounts,
    create,
    updateStatus,
    delete: deleteApplication,
    onChange,
    formatDateTime,
    formatDateOnly,
  };
})();
