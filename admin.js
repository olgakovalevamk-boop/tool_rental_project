(function () {
  const loginSection = document.getElementById("admin-login");
  const appSection = document.getElementById("admin-app");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const tableBody = document.getElementById("tools-table-body");
  const toolsEmpty = document.getElementById("tools-empty");
  const statsRoot = document.getElementById("admin-stats");
  const toolModal = document.getElementById("tool-modal");
  const toolForm = document.getElementById("tool-form");
  const toolFormError = document.getElementById("tool-form-error");
  const toolModalTitle = document.getElementById("tool-modal-title");
  const specsList = document.getElementById("specs-list");
  const statusSelect = document.getElementById("tool-status");
  const imagePreview = document.getElementById("tool-image-preview");
  const imageFallback = document.getElementById("tool-image-fallback");
  const imageFileInput = document.getElementById("tool-image-file");
  const imageUrlInput = document.getElementById("tool-image-url");
  const catalogView = document.getElementById("admin-view-catalog");
  const applicationsView = document.getElementById("admin-view-applications");
  const navLinks = document.querySelectorAll(".admin-nav__link");

  let pendingImage = null;
  let activeView = "catalog";

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

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.hidden = !msg;
  }

  function statusBadgeClass(status) {
    if (status === "В наличии") return "admin-badge--ok";
    if (status === "Забронирован") return "admin-badge--busy";
    return "admin-badge--off";
  }

  function renderStats(tools) {
    const inStock = tools.filter((t) => t.статус === "В наличии").length;
    statsRoot.innerHTML = `
      <div class="admin-stat">
        <span class="admin-stat__value">${tools.length}</span>
        <span class="admin-stat__label">Всего</span>
      </div>
      <div class="admin-stat">
        <span class="admin-stat__value">${inStock}</span>
        <span class="admin-stat__label">В наличии</span>
      </div>
      <div class="admin-stat">
        <span class="admin-stat__value">${tools.length - inStock}</span>
        <span class="admin-stat__label">Недоступно</span>
      </div>`;
  }

  function renderTable(tools) {
    renderStats(tools);
    if (!tools.length) {
      tableBody.innerHTML = "";
      toolsEmpty.hidden = false;
      return;
    }
    toolsEmpty.hidden = true;
    tableBody.innerHTML = tools
      .map((tool) => {
        const img = tool.изображение
          ? `<img class="admin-table__thumb" src="${escapeHtml(tool.изображение)}" alt="">`
          : `<span class="admin-table__thumb-fallback">${escapeHtml(tool.плейсхолдер)}</span>`;
        return `
          <tr data-id="${escapeHtml(tool.id)}">
            <td>${img}</td>
            <td class="admin-table__name">${escapeHtml(tool.название)}</td>
            <td>${formatMoney(tool.ценаЗаСутки)}</td>
            <td>${formatMoney(tool.залог)}</td>
            <td><span class="admin-badge ${statusBadgeClass(tool.статус)}">${escapeHtml(tool.статус)}</span></td>
            <td>
              <div class="admin-table__actions">
                <button type="button" class="btn btn--outline btn--sm js-edit" data-id="${escapeHtml(tool.id)}">Изменить</button>
                <button type="button" class="btn btn--outline btn--sm js-delete" data-id="${escapeHtml(tool.id)}">Удалить</button>
              </div>
            </td>
          </tr>`;
      })
      .join("");
  }

  function fillStatusOptions(selected) {
    statusSelect.innerHTML = CatalogStore.STATUSES.map(
      (s) => `<option value="${escapeHtml(s)}"${s === selected ? " selected" : ""}>${escapeHtml(s)}</option>`
    ).join("");
  }

  function updateImagePreview(src, fallback) {
    pendingImage = src || null;
    if (src) {
      imagePreview.src = src;
      imagePreview.hidden = false;
      imageFallback.hidden = true;
    } else {
      imagePreview.hidden = true;
      imagePreview.removeAttribute("src");
      imageFallback.hidden = false;
      imageFallback.textContent = fallback || "🔧";
    }
  }

  function addSpecRow(name = "", value = "") {
    const row = document.createElement("div");
    row.className = "admin-spec-row";
    row.innerHTML = `
      <input class="form__control js-spec-name" type="text" placeholder="Название" value="${escapeHtml(name)}">
      <input class="form__control js-spec-value" type="text" placeholder="Значение" value="${escapeHtml(value)}">
      <button type="button" class="btn btn--outline btn--sm js-remove-spec" aria-label="Удалить">×</button>`;
    specsList.appendChild(row);
  }

  function collectSpecs() {
    return Array.from(specsList.querySelectorAll(".admin-spec-row"))
      .map((row) => ({
        название: row.querySelector(".js-spec-name")?.value.trim() || "",
        значение: row.querySelector(".js-spec-value")?.value.trim() || "",
      }))
      .filter((s) => s.название && s.значение);
  }

  function openToolModal(mode, tool) {
    showError(toolFormError, "");
    document.getElementById("tool-edit-id").value = mode === "edit" ? tool.id : "";
    toolModalTitle.textContent = mode === "edit" ? "Редактировать инструмент" : "Новый инструмент";
    document.getElementById("tool-name").value = tool?.название || "";
    document.getElementById("tool-desc").value = tool?.описание || "";
    document.getElementById("tool-desc-full").value = tool?.описаниеПодробное || "";
    document.getElementById("tool-use").value = tool?.областьПрименения || "";
    document.getElementById("tool-price-day").value = tool?.ценаЗаСутки ?? "";
    document.getElementById("tool-price-week").value = tool?.ценаЗаНеделю ?? "";
    document.getElementById("tool-deposit").value = tool?.залог ?? "";
    document.getElementById("tool-placeholder").value = tool?.плейсхолдер || "🔧";
    fillStatusOptions(tool?.статус || "В наличии");
    imageUrlInput.value =
      tool?.изображение && !String(tool.изображение).startsWith("data:") ? tool.изображение : "";
    imageFileInput.value = "";
    updateImagePreview(
      tool?.изображение || null,
      tool?.плейсхолдер || "🔧"
    );
    specsList.innerHTML = "";
    (tool?.характеристики?.length ? tool.характеристики : [{ название: "", значение: "" }]).forEach((s) =>
      addSpecRow(s.название, s.значение)
    );
    toolModal.classList.add("is-open");
    toolModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.getElementById("tool-name").focus();
  }

  function closeToolModal() {
    toolModal.classList.remove("is-open");
    toolModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function collectFormData() {
    const imageFromUrl = imageUrlInput.value.trim();
    const image = pendingImage || imageFromUrl || "";
    return {
      название: document.getElementById("tool-name").value.trim(),
      описание: document.getElementById("tool-desc").value.trim(),
      описаниеПодробное: document.getElementById("tool-desc-full").value.trim(),
      областьПрименения: document.getElementById("tool-use").value.trim(),
      ценаЗаСутки: Number(document.getElementById("tool-price-day").value),
      ценаЗаНеделю: Number(document.getElementById("tool-price-week").value) || 0,
      залог: Number(document.getElementById("tool-deposit").value),
      статус: statusSelect.value,
      плейсхолдер: document.getElementById("tool-placeholder").value.trim() || "🔧",
      изображение: image,
      характеристики: collectSpecs(),
    };
  }

  function switchView(view) {
    activeView = view;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.adminView === view);
    });
    catalogView.hidden = view !== "catalog";
    applicationsView.hidden = view !== "applications";
    if (view === "applications") {
      AdminApplications.show();
    }
  }

  function showApp() {
    loginSection.hidden = true;
    appSection.hidden = false;
    switchView(activeView);
    renderTable(CatalogStore.getTools());
  }

  function showLogin() {
    CatalogStore.logout();
    appSection.hidden = true;
    loginSection.hidden = false;
  }

  async function bootstrap() {
    await CatalogStore.init();
    fillStatusOptions("В наличии");
    AdminApplications.init();
    navLinks.forEach((link) => {
      link.addEventListener("click", () => switchView(link.dataset.adminView));
    });
    if (CatalogStore.isAuthenticated()) {
      showApp();
    }
    CatalogStore.onChange((tools) => renderTable(tools));
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError(loginError, "");
    const pwd = document.getElementById("login-password").value;
    const ok = await CatalogStore.login(pwd);
    if (!ok) {
      showError(loginError, "Неверный пароль.");
      return;
    }
    loginForm.reset();
    showApp();
  });

  document.getElementById("btn-logout").addEventListener("click", showLogin);

  document.getElementById("btn-add-tool").addEventListener("click", () => openToolModal("create", null));

  document.getElementById("btn-reset-defaults").addEventListener("click", async () => {
    if (!confirm("Сбросить каталог к исходным данным из data/tools.json? Текущие изменения будут потеряны.")) return;
    await CatalogStore.resetToDefaults();
    renderTable(CatalogStore.getTools());
  });

  tableBody.addEventListener("click", async (e) => {
    const editBtn = e.target.closest(".js-edit");
    const delBtn = e.target.closest(".js-delete");
    if (editBtn) {
      const tool = CatalogStore.getToolById(editBtn.dataset.id);
      if (tool) openToolModal("edit", tool);
      return;
    }
    if (delBtn) {
      const id = delBtn.dataset.id;
      const tool = CatalogStore.getToolById(id);
      if (!tool) return;
      if (!confirm(`Удалить «${tool.название}»?`)) return;
      await CatalogStore.deleteTool(id);
      renderTable(CatalogStore.getTools());
    }
  });

  document.getElementById("btn-add-spec").addEventListener("click", () => addSpecRow());

  specsList.addEventListener("click", (e) => {
    if (e.target.closest(".js-remove-spec")) {
      const row = e.target.closest(".admin-spec-row");
      if (specsList.children.length > 1) row.remove();
    }
  });

  imageFileInput.addEventListener("change", async () => {
    const file = imageFileInput.files?.[0];
    if (!file) return;
    showError(toolFormError, "");
    try {
      const dataUrl = await CatalogStore.uploadImage(file);
      imageUrlInput.value = "";
      updateImagePreview(dataUrl, document.getElementById("tool-placeholder").value || "🔧");
    } catch (err) {
      showError(toolFormError, err.message);
      imageFileInput.value = "";
    }
  });

  imageUrlInput.addEventListener("input", () => {
    const url = imageUrlInput.value.trim();
    if (url) updateImagePreview(url, document.getElementById("tool-placeholder").value || "🔧");
  });

  toolForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showError(toolFormError, "");
    const data = collectFormData();
    const editId = document.getElementById("tool-edit-id").value;
    try {
      if (editId) {
        await CatalogStore.updateTool(editId, data);
      } else {
        await CatalogStore.createTool(data);
      }
      closeToolModal();
      renderTable(CatalogStore.getTools());
    } catch (err) {
      showError(toolFormError, err.message);
    }
  });

  document.getElementById("tool-form-cancel").addEventListener("click", closeToolModal);
  document.getElementById("tool-modal-close").addEventListener("click", closeToolModal);
  document.getElementById("tool-modal-backdrop").addEventListener("click", closeToolModal);

  document.getElementById("password-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errEl = document.getElementById("password-error");
    const okEl = document.getElementById("password-success");
    showError(errEl, "");
    okEl.hidden = true;
    try {
      await CatalogStore.changePassword(
        document.getElementById("pwd-current").value,
        document.getElementById("pwd-new").value
      );
      e.target.reset();
      okEl.hidden = false;
    } catch (err) {
      showError(errEl, err.message);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toolModal.classList.contains("is-open")) closeToolModal();
  });

  // Показать раздел «Заявки» при переходе по hash
  if (window.location.hash === "#applications") {
    activeView = "applications";
  }

  bootstrap();
})();
