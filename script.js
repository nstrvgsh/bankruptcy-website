// FAQ accordion functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        answer.classList.toggle('active');
        
        const icon = question.querySelector('i');
        if (answer.classList.contains('active')) {
            icon.className = 'fas fa-chevron-up';
        } else {
            icon.className = 'fas fa-chevron-down';
        }
    });
});
(function () {
const root = document.getElementById('lead-quiz');
if (!root) return; // нет блока — выходим


const body = root.querySelector('#lead-quiz-body');
const progress = root.querySelector('.lead-quiz__progress');
const progressBar = root.querySelector('.lead-quiz__progress-bar');
const progressText = root.querySelector('.lead-quiz__progress-text');
const note = root.querySelector('#lead-quiz-note');


// 5 вопросов — максимально близко к тому, что нужно для первичной оценки, без гарантий
const questions = [
{ key: 'debt_over_500k', text: 'Сумма ваших долгов превышает 500 000 ₽?' },
{ key: 'overdue_over_3m', text: 'Просрочка платежей по обязательствам более 3 месяцев?' },
{ key: 'has_official_income', text: 'Есть официальные доходы (зарплата, пенсия и т.п.)?' },
{ key: 'extra_property', text: 'Есть имущество, кроме единственного жилья и обычных предметов быта?' },
{ key: 'prev_bankruptcy', text: 'Вы проходили процедуру банкротства за последние 5 лет?' }
];


let step = 0; // текущий шаг (вопрос)
const answers = {}; // сюда собираем ответы


function setProgress(percent) {
progressBar.style.width = percent + '%';
progress.setAttribute('aria-valuenow', String(percent));
progressText.textContent = percent + '%';
}


function calcPercent() {
// 100% показываем сразу после прохождения 5-го вопроса (перед формой)
const total = questions.length; // 5
const current = Math.min(step, total); // от 0 до 5
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
<button class="btn-quiz btn-no" data-answer="no" aria-label="Нет">Нет</button>
</div>
`;
setProgress(calcPercent());
} else {
renderForm();
setProgress(100);
})();
