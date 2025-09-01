// FAQ accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const ans = q.nextElementSibling;
    ans.classList.toggle('active');
    const icon = q.querySelector('i');
    icon.className = ans.classList.contains('active') ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
  });
});

// ===== Lead Quiz =====
(function () {
  const root = document.getElementById('lead-quiz');
  if (!root) return;

  const body = root.querySelector('#lead-quiz-body');
  const progress = root.querySelector('.lead-quiz__progress');
  const progressBar = root.querySelector('.lead-quiz__progress-bar');
  const progressText = root.querySelector('.lead-quiz__progress-text');
  const note = root.querySelector('#lead-quiz-note');

  const questions = [
    { key: 'debt_over_500k', text: 'Сумма ваших долгов превышает 500 000 ₽?' },
    { key: 'overdue_over_3m', text: 'Просрочка платежей по обязательствам более 3 месяцев?' },
    { key: 'has_official_income', text: 'Есть официальные доходы (зарплата, пенсия и т.п.)?' },
    { key: 'extra_property', text: 'Есть имущество, кроме единственного жилья и обычных предметов быта?' },
    { key: 'prev_bankruptcy', text: 'Вы проходили процедуру банкротства за последние 5 лет?' }
  ];

  let step = 0;
  const answers = {};

  function setProgress(percent) {
    progressBar.style.width = percent + '%';
    progress.setAttribute('aria-valuenow', String(percent));
    progressText.textContent = percent + '%';
  }

  function calcPercent() {
    const total = questions.length;
    const current = Math.min(step, total);
    return Math.round((current / total) * 100);
  }

  function renderQuestion() {
    note.hidden = true; note.textContent = ''; note.className = 'lead-quiz__note';
    if (step < questions.length) {
      const q = questions[step];
      body.innerHTML = `
        <div class="lead-quiz__question">${q.text}</div>
        <div class="lead-quiz__controls">
          <button class="btn-quiz btn-yes" data-answer="yes" aria-label="Да">Да</button>
          <button class="btn-quiz btn-no"  data-answer="no" aria-label="Нет">Нет</button>
        </div>
      `;
      setProgress(calcPercent());
    } else {
      renderForm();
      setProgress(100);
    }
  }

  function renderForm() {
    const preliminary = buildPreliminaryResult(answers);
    body.innerHTML = `
      <div class="lead-quiz__question">Предварительный результат</div>
      <p>${preliminary}</p>
      <div class="lead-quiz__badge"><i class="fa-solid fa-stopwatch"></i> Засекайте 15 минут</div>

      <form id="lead-quiz-form" class="lead-quiz__form" novalidate>
        <input type="text" name="name" class="input" placeholder="Ваше имя" autocomplete="name" required>
        <input type="tel"  name="phone" class="input" placeholder="Телефон" inputmode="tel" autocomplete="tel" required>
        <input type="hidden" name="answers" value='${JSON.stringify(answers)}'>
        <button type="submit" class="btn-submit full">Узнать, подхожу ли я под программу списания долгов</button>
      </form>
    `;

    const phoneInput = body.querySelector('input[name="phone"]');
    initPhoneMask(phoneInput);

    const form = body.querySelector('#lead-quiz-form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();

      if (!name) return showError('Пожалуйста, укажите имя.');
      if (!isValidPhone(phone)) return showError('Проверьте номер телефона. Формат: +7 (XXX) XXX-XX-XX');

      // Замените fakeSend на реальную отправку при необходимости
      fakeSend({ name, phone, answers })
        .then(() => showSuccess('Спасибо! Мы свяжемся с вами в ближайшее время.'))
        .catch(() => showError('Не удалось отправить данные. Попробуйте ещё раз.'));
    });
  }

  function showError(msg) {
    note.hidden = false; note.textContent = msg; note.className = 'lead-quiz__note error';
  }
  function showSuccess(msg) {
    note.hidden = false; note.textContent = msg; note.className = 'lead-quiz__note success';
    const btn = root.querySelector('.btn-submit');
    if (btn) { btn.disabled = true; btn.style.opacity = .7; }
  }

  function fakeSend(payload) {
    return new Promise((resolve) => {
      console.log('[LeadQuiz] payload', payload);
      setTimeout(resolve, 600);
    });
  }

  function isValidPhone(v) {
    return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v);
  }

  function initPhoneMask(input) {
    const template = '+7 (___) ___-__-__';
    input.placeholder = template;

    function digits(s){ return s.replace(/\D/g,''); }

    function onInput() {
      let val = digits(input.value);
      if (val.startsWith('7')) val = val.slice(1);
      if (val.startsWith('8')) val = val.slice(1);

      const chars = template.split('');
      let i = 0;
      for (let k = 0; k < chars.length; k++) {
        if (chars[k] === '_') chars[k] = (i < val.length) ? val[i++] : '_';
      }
      input.value = chars.join('');
      setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
    }

    input.addEventListener('input', onInput);
    input.addEventListener('focus', () => { if (!input.value) input.value = template; });
    input.addEventListener('blur', () => { if (digits(input.value).length < 10) input.value = ''; });
  }

  function buildPreliminaryResult(a) {
    const likely = a.debt_over_500k === 'yes' && a.overdue_over_3m === 'yes';
    if (likely) {
      return 'По предварительной оценке процедура банкротства вам может подходить. Точный вывод сделаем после быстрой консультации.';
    }
    return 'Даже если вы не прошли предварительные критерии, у нас могут быть альтернативные решения. Получите бесплатную консультацию — это займет 10–15 минут.';
  }

  body.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-answer]');
    if (!btn) return;
    const val = btn.getAttribute('data-answer');
    const q = questions[step];
    if (q) {
      answers[q.key] = val; // yes | no
      step += 1;
      renderQuestion();
    }
  });

  // Первый рендер
  renderQuestion();
})();
