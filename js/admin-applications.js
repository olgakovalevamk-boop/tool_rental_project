/**
 * Раздел «Заявки» в админ-панели.
 */
const AdminApplications = (function () {
  const view = document.getElementById("admin-view-applications");
  const statsRoot = document.getElementById("applications-stats");
  const tableBody = document.getElementById("applications-table-body");
  const emptyEl = document.getElementById("applications-empty");
  const searchInput = document.getElementById("applications-search");
  const appModal = document.getElementById("application-modal");
  const appModalTitle = document.getElementById("application-modal-title");
  const appModalBody = document.getElementById("application-modal-body");
  const appStatusSelect = document.getElementById("application-status");
  const appFormError = document.getElementById("application-form-error");

  let searchQuery = "";
  let viewingId = null;

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function showError(msg) {
    if (!appFormError) return;
    appFormError.textContent = msg;
    appFormError.hidden = !msg;
  }

  function statusBadgeClass(status) {
    if (status === "Новая") return "admin-badge--new";
    if (status === "В работе") return "admin-badge--busy";
    if (status === "Завершена") return "admin-badge--ok";
    return "admin-badge--off";
  }

  function truncate(str, max) {
    if (!str) return "—";
    return str.length > max ? str.slice(0, max) + "…" : str;
  }

  function filterApplications(apps) {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(
      (a) =>
        a.имя.toLowerCase().includes(q) ||
        a.телефон.toLowerCase().includes(q) ||
        a.инструмент.toLowerCase().includes(q)
    );
  }

  function renderStats() {
    const counts = ApplicationsStore.getCounts();
    statsRoot.innerHTML = `
      <div class="admin-stat admin-stat--new">
        <span class="admin-stat__value">${counts.новые}</span>
        <span class="admin-stat__label">Новые</span>
      </div>
      <div class="admin-stat admin-stat--progress">
        <span class="admin-stat__value">${counts.вРаботе}</span>
        <span class="admin-stat__label">В работе</span>
      </div>
      <div class="admin-stat admin-stat--done">
        <span class="admin-stat__value">${counts.завершено}</span>
        <span class="admin-stat__label">Завершено</span>
      </div>`;
  }

  function renderTable() {
    const apps = filterApplications(ApplicationsStore.getAll());
    renderStats();

    if (!apps.length) {
      tableBody.innerHTML = "";
      emptyEl.hidden = false;
      emptyEl.textContent = searchQuery.trim()
        ? "По запросу ничего не найдено."
        : "Заявок пока нет. Они появятся после отправки формы на сайте.";
      return;
    }

    emptyEl.hidden = true;
    tableBody.innerHTML = apps
      .map((app) => {
        const comment = app.комментарий || "—";
        return `
          <tr data-id="${escapeHtml(app.id)}">
            <td class="admin-table__date">${escapeHtml(ApplicationsStore.formatDateTime(app.createdAt))}</td>
            <td class="admin-table__name">${escapeHtml(app.имя)}</td>
            <td><a href="tel:${escapeHtml(app.телефон.replace(/\s/g, ""))}" class="admin-table__phone">${escapeHtml(app.телефон)}</a></td>
            <td>${escapeHtml(app.инструмент)}</td>
            <td class="admin-table__comment" title="${escapeAttr(comment)}">${escapeHtml(truncate(comment, 40))}</td>
            <td><span class="admin-badge ${statusBadgeClass(app.статус)}">${escapeHtml(app.статус)}</span></td>
            <td>
              <div class="admin-table__actions">
                <button type="button" class="btn btn--outline btn--sm js-app-view" data-id="${escapeHtml(app.id)}">Открыть</button>
                <button type="button" class="btn btn--outline btn--sm js-app-delete" data-id="${escapeHtml(app.id)}">Удалить</button>
              </div>
            </td>
          </tr>`;
      })
      .join("");
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }

  function fillStatusOptions(selected) {
    appStatusSelect.innerHTML = ApplicationsStore.STATUSES.map(
      (s) =>
        `<option value="${escapeHtml(s)}"${s === selected ? " selected" : ""}>${escapeHtml(s)}</option>`
    ).join("");
  }

  function renderModalContent(app) {
    const rental =
      app.датаНачала || app.датаВозврата
        ? `${ApplicationsStore.formatDateOnly(app.датаНачала)} — ${ApplicationsStore.formatDateOnly(app.датаВозврата)}`
        : "—";

    appModalBody.innerHTML = `
      <dl class="admin-detail">
        <div class="admin-detail__row">
          <dt>Дата заявки</dt>
          <dd>${escapeHtml(ApplicationsStore.formatDateTime(app.createdAt))}</dd>
        </div>
        <div class="admin-detail__row">
          <dt>Имя</dt>
          <dd>${escapeHtml(app.имя)}</dd>
        </div>
        <div class="admin-detail__row">
          <dt>Телефон</dt>
          <dd><a href="tel:${escapeAttr(app.телефон.replace(/\s/g, ""))}">${escapeHtml(app.телефон)}</a></dd>
        </div>
        <div class="admin-detail__row">
          <dt>Инструмент</dt>
          <dd>${escapeHtml(app.инструмент)}</dd>
        </div>
        <div class="admin-detail__row">
          <dt>Период аренды</dt>
          <dd>${escapeHtml(rental)}</dd>
        </div>
        <div class="admin-detail__row">
          <dt>Комментарий</dt>
          <dd class="admin-detail__comment">${escapeHtml(app.комментарий || "—")}</dd>
        </div>
      </dl>`;
  }

  function openModal(id) {
    const app = ApplicationsStore.getById(id);
    if (!app || !appModal) return;
    viewingId = id;
    showError("");
    appModalTitle.textContent = `Заявка · ${app.имя}`;
    renderModalContent(app);
    fillStatusOptions(app.статус);
    appModal.classList.add("is-open");
    appModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    appStatusSelect.focus();
  }

  function closeModal() {
    if (!appModal) return;
    appModal.classList.remove("is-open");
    appModal.setAttribute("aria-hidden", "true");
    if (!document.querySelector(".modal.is-open")) {
      document.body.classList.remove("modal-open");
    }
    viewingId = null;
    showError("");
  }

  function bindEvents() {
    searchInput?.addEventListener("input", () => {
      searchQuery = searchInput.value;
      renderTable();
    });

    tableBody?.addEventListener("click", (e) => {
      const viewBtn = e.target.closest(".js-app-view");
      const delBtn = e.target.closest(".js-app-delete");

      if (viewBtn) {
        openModal(viewBtn.dataset.id);
        return;
      }

      if (delBtn) {
        const id = delBtn.dataset.id;
        const app = ApplicationsStore.getById(id);
        if (!app) return;
        if (!confirm(`Удалить заявку от «${app.имя}»?`)) return;
        try {
          ApplicationsStore.delete(id);
          if (viewingId === id) closeModal();
          renderTable();
        } catch (err) {
          alert(err.message);
        }
      }
    });

    document.getElementById("application-save-status")?.addEventListener("click", () => {
      if (!viewingId) return;
      showError("");
      try {
        ApplicationsStore.updateStatus(viewingId, appStatusSelect.value);
        const app = ApplicationsStore.getById(viewingId);
        if (app) renderModalContent(app);
        renderTable();
      } catch (err) {
        showError(err.message);
      }
    });

    document.getElementById("application-delete")?.addEventListener("click", () => {
      if (!viewingId) return;
      const app = ApplicationsStore.getById(viewingId);
      if (!app) return;
      if (!confirm(`Удалить заявку от «${app.имя}»?`)) return;
      try {
        ApplicationsStore.delete(viewingId);
        closeModal();
        renderTable();
      } catch (err) {
        showError(err.message);
      }
    });

    document.getElementById("application-modal-close")?.addEventListener("click", closeModal);
    document.getElementById("application-modal-backdrop")?.addEventListener("click", closeModal);
    document.getElementById("application-modal-cancel")?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && appModal?.classList.contains("is-open")) closeModal();
    });

    ApplicationsStore.onChange(() => renderTable());
  }

  function init() {
    if (!view) return;
    bindEvents();
    renderTable();
  }

  function show() {
    renderTable();
  }

  return { init, show, closeModal };
})();
