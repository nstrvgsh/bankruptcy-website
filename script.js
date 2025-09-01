(function () {
  const root = document.getElementById('lead-quiz');
  if (!root) return;

  const body = root.querySelector('#lead-quiz-body');
  const prevBtn = root.querySelector('#quiz-prev');
  const nextBtn = root.querySelector('#quiz-next');
  const progress = root.querySelector('.lead-quiz__progress');
  const progressBar = root.querySelector('.lead-quiz__progress-bar');
  const progressText = root.querySelector('.lead-quiz__progress-text');
  const note = root.querySelector('#lead-quiz-note');

  const questions = [
    {
      key: 'debt_amount', type: 'single', text: 'Какая у вас общая сумма долга?',
      options: [
        { value: 'lt_100k', label: 'до 100 000 руб.' },
        { value: 'gte_100k', label: 'более 100 000 руб.' },
      ]
    },
    {
      key: 'assets', type: 'multi', text: 'Есть ли имущество, оформленное на вас?',
      options: [
        { value: 'none', label: 'нет' },
        { value: 'apt', label: 'квартира' },
        { value: 'car', label: 'машина' },
        { value: 'house', label: 'дача/частный дом' },
        { value: 'land', label: 'земельный участок' },
        { value: 'other', label: 'другое' },
      ]
    },
    {
      key: 'debts_types', type: 'multi', text: 'Какие задолженности у вас есть?',
      options: [
        { value: 'bank_loans', label: 'Кредиты перед банками' },
        { value: 'microloans', label: 'Микрокредиты' },
        { value: 'tax_fines', label: 'Налоги и штрафы' },
        { value: 'utilities', label: 'Задолженности по коммунальным платежам' },
        { value: 'other', label: 'другое' },
      ]
    },
    {
      key: 'overdue', type: 'single', text: 'Есть ли у вас просрочки по кредитам?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' },
      ]
    },
    {
      key: 'collectors', type: 'single', text: 'Беспокоят ли вас коллекторы?',
      options: [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' },
      ]
    },
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
    return Math.round((Math.min(step, total) / total) * 100);
  }

  function render() {
    note.hidden = true; note.textContent = ''; note.className = 'lead-quiz__note';
    prevBtn.disabled = step === 0;
    nextBtn.textContent = step < questions.length ? 'Далее' : 'Готово';

    if (step < questions.length) {
      const q = questions[step];
      const saved = answers[q.key] || (q.type === 'multi' ? [] : null);

      const optionsHTML = q.options.map(opt => {
        const checked = q.type === 'multi'
          ? (saved.includes && saved.includes(opt.value))
          : (saved === opt.value);
        const type = q.type === 'multi' ? 'checkbox' : 'radio';
        return `
          <label class="option">
            <input type="${type}" name="${q.key}" value="${opt.value}" ${checked ? 'checked' : ''}>
            <span class="option__bullet"></span>
