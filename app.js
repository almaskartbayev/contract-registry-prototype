const today = new Date();
today.setHours(0, 0, 0, 0);
const days = n => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const files = names => names.map((name, i) => ({ name, size: [183500, 482100, 92500][i % 3], type: name.split('.').pop().toUpperCase(), uploaded: '02.11.2026', author: 'А. Садыкова' }));
const docs = [
  { name: 'Договор на оказание телекоммуникационных услуг', no: 'ДД-2026-0486', cat: 'Доходный', type: 'Договор доходный', party: 'ТОО «Орбита Телеком»', bin: '120340012345', date: '2026-10-28', sum: '12 450 000 ₸', expiry: days(52), action: days(12), actionLabel: 'Счёт к оплате', status: 'Действует', owner: 'А. Садыкова', src: 'telecom.kz', files: files(['Договор.pdf', 'Приложение 1.xlsx']) },
  { name: 'Договор поставки сетевого оборудования', no: 'ДР-2026-0632', cat: 'Расходный', type: 'Договор расходный', party: 'АО «ТехноСнаб KZ»', bin: '090740004567', date: '2026-10-26', sum: '8 720 000 ₸', expiry: days(12), status: 'Действует', owner: 'М. Ахметов', src: 'SAP', files: files(['Контракт.docx']) },
  { name: 'Соглашение о неразглашении информации', no: '48-NDA', cat: 'Прочий', type: 'NDA', party: 'ТОО «КазИнфоСистемы»', bin: '151140006789', date: '2026-10-25', sum: '—', expiry: days(4), status: 'Действует', owner: 'А. Садыкова', src: 'Ручной ввод', files: files(['NDA.pdf', 'Приложение.pdf']) },
  { name: 'Договор займа сотруднику', no: 'ЗАЙМ-2026-0017', cat: 'Внутренний', type: 'Займ сотруднику', party: 'Иванов А. С.', bin: '—', date: '2026-10-23', sum: '1 200 000 ₸', expiry: days(-8), action: days(6), actionLabel: 'Возврат займа', status: 'Истёк срок', owner: 'Е. Ким', src: 'Ручной ввод', files: files(['Займ.pdf']) },
  { name: 'Меморандум о стратегическом сотрудничестве', no: '12-MEM', cat: 'Прочий', type: 'Меморандум', party: 'АО «Казахстан Транзит»', bin: '030540002468', date: '2026-10-21', sum: '—', action: days(20), actionLabel: 'Продление меморандума', status: 'Действует', owner: 'А. Садыкова', src: 'Ручной ввод', files: files(['Меморандум.docx']) },
  { name: 'Договор на техническое обслуживание сети', no: 'ДД-2026-0485', cat: 'Доходный', type: 'Договор доходный', party: 'ТОО «СвязьПром»', bin: '080640007891', date: '2026-10-20', sum: '4 800 000 ₸', expiry: days(8), status: 'Действует', owner: 'М. Ахметов', src: 'telecom.kz', files: files(['Договор.pdf']) },
  { name: 'Дополнительное соглашение к договору № 18', no: '7-DCD', cat: 'Расходный', type: 'ДСД', party: 'ТОО «Алатау Строй»', bin: '140240009876', date: '2026-10-18', sum: '650 000 ₸', action: days(-3), actionLabel: 'Срок предоставления акта', status: 'Требует внимания', owner: 'Е. Ким', src: 'SAP', files: files(['ДСД.pdf', 'Смета.xlsx']) },
  { name: 'Договор аренды серверного оборудования', no: 'ДР-2026-0630', cat: 'Расходный', type: 'Договор расходный', party: 'ТОО «ДатаЦентр KZ»', bin: '170940001234', date: '2026-10-16', sum: '2 100 000 ₸', expiry: days(110), status: 'Действует', owner: 'М. Ахметов', src: 'SAP', files: files(['Аренда.docx']) }
];
const defaults = { NDA: { code: 'NDA', next: 49 }, 'Меморандум': { code: 'MEM', next: 13 }, 'ДСД': { code: 'DCD', next: 8 }, 'Займ сотруднику': { code: 'LOAN', next: 1 }, 'Прочее': { code: 'DOC', next: 1 } };
let series = JSON.parse(localStorage.getItem('registrySeries') || 'null') || defaults;
let tab = 'Все';
const el = id => document.getElementById(id);
const fmtDate = value => value ? new Date(value + 'T00:00:00').toLocaleDateString('ru-RU') : '—';
const daysLeft = value => value ? Math.ceil((new Date(value + 'T00:00:00') - today) / 86400000) : null;
function render() {
  const q = el('q').value.toLowerCase(), kind = el('kind').value, bin = el('bin').value, source = el('src').value, date = el('date').value;
  const soonCount = docs.filter(x => daysLeft(x.expiry) >= 0 && daysLeft(x.expiry) <= 30).length;
  const overCount = docs.filter(x => daysLeft(x.expiry) < 0).length;
  el('soonCount').textContent = soonCount; el('overCount').textContent = overCount; el('attention').textContent = soonCount + overCount;
  let rows = docs.filter(x => (tab === 'Все' || x.cat === tab || (tab === 'Скоро истекают' && daysLeft(x.expiry) >= 0 && daysLeft(x.expiry) <= 30) || (tab === 'Просрочены' && daysLeft(x.expiry) < 0) || (tab === 'Другие сроки' && x.action)) && (!q || [x.name, x.no, x.party, x.owner].some(v => (v || '').toLowerCase().includes(q))) && (!kind || x.type === kind) && (!bin || x.bin.includes(bin)) && (!source || x.src === source) && (!date || x.date >= date));
  const priority = x => { const n = daysLeft(x.expiry); return n !== null && n < 0 ? n : n !== null && n <= 30 ? n : 9999; };
  rows.sort((a, b) => priority(a) - priority(b));
  el('rows').innerHTML = rows.map(x => {
    const n = daysLeft(x.expiry), overdue = n !== null && n < 0, soon = n !== null && n >= 0 && n <= 30;
    const due = n !== null ? `${fmtDate(x.expiry)} · ${overdue ? `просрочен ${Math.abs(n)} дн.` : `через ${n} дн.`}` : x.action ? `${fmtDate(x.action)} · ${x.actionLabel}` : '—';
    return `<tr class="${overdue || soon ? 'urgent' : ''}"><td><div class="dname">${x.name}</div><div class="dnum">${x.no}　🔒 номер закреплён</div></td><td><span class="pill ${x.cat}">${x.type}</span></td><td>${x.party}</td><td>${x.bin}</td><td>${fmtDate(x.date)}</td><td>${x.sum}</td><td class="status ${overdue ? 'over' : soon ? 'soon' : ''}">${overdue ? 'Просрочен' : soon ? 'Скоро истекает' : x.status}</td><td><span class="due ${overdue ? 'over' : soon ? 'soon' : ''}">${due}</span></td><td>${x.owner}</td><td>${x.src}</td><td><button class="filecount" onclick="showFiles('${x.no}')">▧ ${x.files?.length || 0}</button></td></tr>`;
  }).join('') || '<tr><td colspan="11" class="empty">По этим фильтрам ничего не найдено</td></tr>';
  el('count').textContent = `Найдено документов: ${rows.length}`; el('shown').textContent = `Показано ${rows.length} документов`;
}
document.querySelectorAll('.tab').forEach(button => button.onclick = () => { document.querySelector('.tab.sel').classList.remove('sel'); button.classList.add('sel'); tab = button.dataset.tab; render(); });
['q', 'kind', 'bin', 'src', 'date'].forEach(id => el(id).addEventListener('input', render));
function resetFilters() { ['q', 'bin', 'date'].forEach(id => el(id).value = ''); ['kind', 'src'].forEach(id => el(id).value = ''); render(); }
function notice(message) { el('toast').textContent = message; el('toast').classList.add('show'); setTimeout(() => el('toast').classList.remove('show'), 3500); }
function openModal() { el('overlay').classList.add('open'); }
function closeModal() { el('overlay').classList.remove('open'); }
function openNumberSettings() { Object.entries(series).forEach(([type, value]) => { document.querySelector(`[data-code="${type}"]`).value = value.code; document.querySelector(`[data-next="${type}"]`).value = value.next; }); el('numberOverlay').classList.add('open'); }
function closeNumberSettings() { el('numberOverlay').classList.remove('open'); }
function showFiles(no) { const doc = docs.find(x => x.no === no); notice(doc.files.map(f => `${f.name} · ${f.type} · ${(f.size / 1024).toFixed(0)} КБ`).join(' | ') + ' — только метаданные примера; файлы не хранятся'); }
el('files').onchange = () => { const selected = [...el('files').files]; el('fileList').textContent = selected.length ? selected.map(f => `${f.name} · ${(f.size / 1024).toFixed(0)} КБ`).join(' | ') + ' — только демонстрация' : 'Можно выбрать несколько файлов. В макете сохраняются только их названия и метаданные.'; };
function exportRows() {
  const headers = ['Номер', 'Название', 'Тип', 'Контрагент', 'БИН', 'Дата', 'Сумма', 'Статус', 'Срок', 'Ответственный', 'Источник', 'Файлов'];
  const data = [...el('rows').querySelectorAll('tr')].filter(row => row.cells.length > 1).map(row => { const c = row.cells; return [c[0].querySelector('.dnum').textContent.split('　')[0], c[0].querySelector('.dname').textContent, c[1].textContent, c[2].textContent, c[3].textContent, c[4].textContent, c[5].textContent, c[6].textContent, c[7].textContent, c[8].textContent, c[9].textContent, c[10].textContent]; });
  const csv = '\ufeff' + [headers, ...data].map(row => row.map(v => '"' + String(v).replaceAll('"', '""') + '"').join(';')).join('\r\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })); a.download = 'реестр-документов.csv'; a.click(); notice('Экспорт текущей выборки создан в формате CSV для Excel');
}
el('numberForm').onsubmit = event => { event.preventDefault(); document.querySelectorAll('[data-code]').forEach(input => { const type = input.dataset.code; series[type] = { code: input.value.trim().toUpperCase(), next: Math.max(1, Number(document.querySelector(`[data-next="${type}"]`).value) || 1) }; }); localStorage.setItem('registrySeries', JSON.stringify(series)); closeNumberSettings(); notice('Серии номеров сохранены в этом браузере'); };
el('form').onsubmit = event => {
  event.preventDefault(); const type = el('ntype').value, sequence = series[type] || series['Прочее'], number = `${sequence.next}-${sequence.code}`;
  const attached = [...el('files').files].map(file => ({ name: file.name, size: file.size, type: file.name.split('.').pop().toUpperCase(), uploaded: new Date().toLocaleDateString('ru-RU'), author: 'Вы' }));
  docs.unshift({ name: el('nname').value, no: number, cat: type === 'Займ сотруднику' ? 'Внутренний' : 'Прочий', type, party: el('nparty').value || '—', bin: el('nbin').value || '—', date: el('ndate').value, sum: '—', status: 'Действует', owner: 'Вы', src: 'Ручной ввод', files: attached });
  series[type] = { ...sequence, next: sequence.next + 1 }; localStorage.setItem('registrySeries', JSON.stringify(series)); closeModal(); event.target.reset(); el('fileList').textContent = 'Можно выбрать несколько файлов. В макете сохраняются только их названия и метаданные.'; render(); notice(`Карточка сохранена с номером ${number}. Вложения здесь не загружаются.`);
};
render();
