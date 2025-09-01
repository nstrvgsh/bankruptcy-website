// ЭЛиЮС — Lead Quiz (5 вопросов, обязательный выбор)
(function initLeadQuiz() {
  // Ждём DOM на всякий
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  function start() {
    try {
      const root = document.getElementById("lead-quiz");
      if (!root) return; // секции нет — тихо выходим

      const body = root.querySelector("#lead-quiz-body");
      const prevBtn = root.querySelector("#quiz-prev");
      const nextBtn = root.querySelector("#quiz-next");
      const progress = root.querySelector(".lead-quiz__progress");
      const progressBar = root.querySelector(".lead-quiz__progress-bar");
      const progressText = root.querySelector(".lead-quiz__progress-text");
      const note = root.querySelector("#lead-quiz-note");

      if (!body) throw new Error('Не найден контейнер #lead-quiz-body');
      if (!prevBtn || !nextBtn) throw new Error('Не найдены кнопки навигации опроса');

      // === ВОПРОСЫ ===
      const questions = [
        {
          key: "debt_amount", type: "single",
          text: "Какая у вас общая сумма долга?",
          options: [
            { value: "lt_100k", label: "до 100 000 руб." },
            { value: "gte_100k", label: "более 100 000 руб." }
          ]
        },
        {
          key: "assets", type: "multi",
          text: "Есть ли имущество, оформленное на вас?",
          options: [
            { value: "none",  label: "нет" },
            { value: "apt",   label: "квартира" },
            { value: "car",   label: "машина" },
            { value: "house", label: "дача/частный дом" },
            { value: "land",  label: "земельный участок" },
            { value: "other", label: "другое" }
          ]
        },
        {
          key: "debts_types", type: "multi",
          text: "Какие задолженности у вас есть?",
          options: [
            { value: "bank_loans", label: "Кредиты перед банками" },
            { value: "microloans", label: "Микрокредиты" },
            { value: "tax_fines",  label: "Налоги и штрафы" },
            { value: "utilities",  label: "Задолженности по коммунальным платежам" },
            { value: "other",      label: "другое" }
          ]
        },
        {
          key: "overdue", type: "single",
          text: "Есть ли у вас просрочки по кредитам?",
          options: [
            { value: "yes", label: "Да" },
            { value: "no",  label: "Нет" }
          ]
        },
        {
          key: "collectors", type: "single",
          text: "Беспокоят ли вас коллекторы?",
          options: [
            { value: "yes", label: "Да" },
            { value: "no",  label: "Нет" }
          ]
        }
      ];

      let step = 0;               // текущий экран
      const answers = {};         // ответы

      // ===== утилиты =====
      function setProgress(percent) {
        progressBar.style.width = percent + "%";
        progress.setAttribute("aria-valuenow", String(percent));
        progressText.textContent = percent + "%";
      }
      function calcPercent() {
        const total = questions.length;
        return Math.round((Math.min(step, total) / total) * 100);
      }
      function showError(msg) {
        note.hidden = false;
        note.textContent = msg;
        note.className = "lead-quiz__note error";
      }
      function showSuccess(msg) {
        note.hidden = false;
        note.textContent = msg;
        note.className = "lead-quiz__note success";
      }

      // ===== рендер =====
      function render() {
        note.hidden = true;
        note.textContent = "";
        note.className = "lead-quiz__note";

        prevBtn.disabled = step === 0;
        nextBtn.textContent = step < questions.length ? "Далее" : "Готово";

        if (step < questions.length) {
          const q = questions[step];
          const saved = answers[q.key] || (q.type === "multi" ? [] : null);

          const optionsHTML = q.options.map(opt => {
            const checked = q.type === "multi"
              ? (Array.isArray(saved) && saved.includes(opt.value))
              : (saved === opt.value);
            const type = q.type === "multi" ? "checkbox" : "radio";
            return `
              <label class="option">
                <input type="${type}" name="${q.key}" value="${opt.value}" ${checked ? "checked" : ""}>
                <span class="option__bullet"></span>
                <span>${opt.label}</span>
              </label>`;
          }).join("");

          body.innerHTML = `
            <div class="lead-quiz__question">${q.text}</div>
            <div class="lead-quiz__options" role="group">${optionsHTML}</div>
          `;
          setProgress(calcPercent());
        } else {
          renderForm();
          setProgress(100);
          prevBtn.disabled = false;
          nextBtn.disabled = true; // отправка через кнопку формы
        }
      }

      function readSelection() {
        if (step >= questions.length) return true;
        const q = questions[step];
        const inputs = Array.from(body.querySelectorAll("input"));
        if (q.type === "single") {
          const picked = inputs.find(i => i.checked);
          if (!picked) return markInvalid(), false;
          answers[q.key] = picked.value;
          return true;
        } else {
          const picked = inputs.filter(i => i.checked).map(i => i.value);
          if (!picked.length) return markInvalid(), false;
          answers[q.key] = picked;
          return true;
        }
      }

      function markInvalid() {
        showError("Пожалуйста, выберите вариант(ы) ответа.");
        body.querySelectorAll(".option").forEach(el => el.classList.add("invalid"));
        setTimeout(() => body.querySelectorAll(".option").forEach(el => el.classList.remove("invalid")), 1200);
      }

      function renderForm() {
        body.innerHTML = `
          <div class="lead-quiz__question">По какому номеру позвонить и сообщить заключение юриста?</div>
          <form id="lead-quiz-form" class="lead-quiz__form" novalidate>
            <input type="text"  name="name"  class="input" placeholder="Ваше имя" required>
            <input type="tel"   name="phone" class="input" placeholder="+7 (XXX) XXX-XX-XX" required>
            <input type="hidden" name="answers" value='${JSON.stringify(answers)}'>
            <button type="submit" class="btn-submit full">Узнать, подхожу ли я под программу списания долгов</button>
          </form>
        `;

        const form = body.querySelector("#lead-quiz-form");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = form.name.value.trim();
          const phone = form.phone.value.trim();
          if (!name) return showError("Пожалуйста, укажите имя.");
          if (!/^\+?[\d()\-\s]{10,}$/.test(phone)) return showError("Проверьте номер телефона.");
          console.log("[LeadQuiz] payload:", { name, phone, answers });
          showSuccess("Спасибо! Мы свяжемся с вами в ближайшее время.");
        });
      }

      // навигация
      prevBtn.addEventListener("click", () => { if (step > 0) { step--; render(); } });
      nextBtn.addEventListener("click", () => {
        if (step < questions.length) {
          if (!readSelection()) return;
          step++;
          render();
        }
      });

      // первый рендер
      render();
    } catch (err) {
      console.error("[LeadQuiz] Ошибка инициализации:", err);
    }
  }
})();
