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
function(){
const phone = String(formData.get('phone')||'').trim();
if(!name){showFormError('Пожалуйста, укажите имя.');return;}
if(!isValidPhone(phone)){showFormError('Проверьте номер телефона. Формат: +7 (XXX) XXX-XX-XX');return;}


fakeSend({name, phone, answers})
.then(()=> showSuccess('Спасибо! Мы свяжемся с вами в ближайшее время.'))
.catch(()=> showFormError('Не удалось отправить данные. Попробуйте ещё раз.'));
});
}


function showFormError(msg){ note.hidden=false; note.textContent=msg; note.className='lead-quiz__note error'; }
function showSuccess(msg){ note.hidden=false; note.textContent=msg; note.className='lead-quiz__note success'; }


function initPhoneMask(input){
const template = '+7 (___) ___-__-__';
input.placeholder = template;
const digits = s => s.replace(/\D/g,'');
function onInput(){
let val = digits(input.value);
if(val.startsWith('7')) val = val.slice(1);
if(val.startsWith('8')) val = val.slice(1);
const chars = template.split('');
let i=0; for(let k=0;k<chars.length;k++){ if(chars[k]==='_'){ chars[k]=(i<val.length)?val[i++]:'_'; } }
input.value = chars.join('');
setTimeout(()=> input.setSelectionRange(input.value.length,input.value.length),0);
}
input.addEventListener('input', onInput);
input.addEventListener('focus', ()=>{ if(!input.value) input.value = template; });
input.addEventListener('blur', ()=>{ if(digits(input.value).length < 10) input.value=''; });
}


function isValidPhone(v){ return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v); }


function buildPreliminaryResult(a){
const heavyDebt = a.debt_amount === 'gte_100k';
const hasOverdue = a.overdue === 'yes';
if(heavyDebt && hasOverdue){
return 'По предварительной оценке процедура банкротства вам может подходить. Точный вывод сделаем после консультации.';
}
return 'Даже если вы не прошли предварительные критерии, есть альтернативные решения. Получите бесплатную консультацию — это займет 10–15 минут.';
}


// Навигация
prevBtn.addEventListener('click', ()=>{ if(step>0){ step--; render(); }});
nextBtn.addEventListener('click', ()=>{
if(step < questions.length){
if(!readSelection()) return; // обязательный выбор
step++;
render();
}
});


// Первый рендер
render();


// Заглушка отправки
function fakeSend(payload){ return new Promise(res=>{ console.log('[LeadQuiz] payload', payload); setTimeout(res, 600); }); }
})();
