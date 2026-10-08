const recommendations = [
  { title: '先补齐一份可验证的项目案例', text: '因为目标岗位重视实际产出，而你目前的经历描述还停留在任务层。', why: '它会直接影响你下一次投递的可信度，并且今天就能完成第一步。', action: '整理项目案例' },
  { title: '用 30 分钟建立技能缺口清单', text: '根据你填写的岗位方向与经历，缺口集中在“能否独立交付”，而不是知识点数量。', why: '先确认真实熟练度，能避免把有限时间花在已经掌握的内容上。', action: '开始技能自测' },
  { title: '准备一次低压力的模拟沟通', text: '清晰表达会影响面试官对你解决问题能力的判断。', why: '项目内容已经具备基础，当前更需要验证你能否让别人快速理解。', action: '查看沟通提纲' }
];
const state = { activeRecommendation: 0, selectedAction: '', progress: 42 };
const views = ['homeView', 'loadingView', 'errorView', 'resultView', 'historyView'];
const titles = { homeView: '把下一步想清楚，再开始准备。', loadingView: '正在生成你的准备建议', errorView: '生成遇到了一点问题', resultView: '你的准备建议', historyView: '你的准备记录' };
function $(selector) { return document.querySelector(selector); }
function $$(selector) { return [...document.querySelectorAll(selector)]; }
function showView(id) { views.forEach(viewId => $('#' + viewId).classList.toggle('active', viewId === id)); $('#pageTitle').textContent = titles[id]; const navMap = { homeView: 'home', loadingView: 'home', errorView: 'home', resultView: 'result', historyView: 'history' }; $$('nav button').forEach(button => button.classList.toggle('active', button.dataset.nav === navMap[id])); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function navigate(target) { if (target === 'home') showView('homeView'); if (target === 'result') { syncResultContext(); showView('resultView'); } if (target === 'history') showView('historyView'); }
function syncResultContext() { const goal = $('#goal').value.trim() || '尚未填写'; const stage = $('#stage').value; $('#resultGoal').textContent = goal; $('#resultStage').textContent = stage.includes('还没开始') ? '尚未开始准备' : stage.includes('面试机会') ? '集中准备面试' : '投递后等待反馈'; }
function generateSuggestions(forceError = false) { const goal = $('#goal').value.trim(); const stage = $('#stage').value.trim(); if (!goal || !stage) { $('#formError').classList.remove('hidden'); return; } $('#formError').classList.add('hidden'); syncResultContext(); showView('loadingView'); window.setTimeout(() => showView(forceError ? 'errorView' : 'resultView'), 850); }
function renderRecommendation(index) { state.activeRecommendation = index; const item = recommendations[index]; $$('.recommend').forEach((button, i) => button.classList.toggle('selected', i === index)); $('#detailCount').textContent = `建议 ${index + 1} / 3`; $('#detailTitle').textContent = item.title; $('#detailText').textContent = item.text; $('#detailWhy').textContent = item.why; $('#detailAction').textContent = item.action; }
function showToast(message) { const toast = $('#toast'); toast.querySelector('span').textContent = message; toast.classList.remove('hidden'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.add('hidden'), 2300); }
function openProfile() { $('#modalName').value = $('#name').value; $('#modalMajor').value = $('#major').value; $('#profileModal').classList.remove('hidden'); }
function confirmAction() { const action = recommendations[state.activeRecommendation].action; state.selectedAction = action; state.progress = 57; $('#progressText').textContent = '57%'; $('#progressBar').style.width = '57%'; $('#progressNote').textContent = '完成 4 / 7 项'; $('#actionHistory').innerHTML = `<div class="history-icon orange">→</div><div><b>${action}</b><p>10月8日 · 已加入下一步行动</p></div><span>进行中</span>`; $('#actionModal').classList.add('hidden'); showToast(`已加入准备记录：${action}`); }
$$('[data-nav]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.nav)));
$('#profileForm').addEventListener('submit', event => { event.preventDefault(); generateSuggestions(false); });
$('#simulateError').addEventListener('click', () => generateSuggestions(true));
$('#retryBtn').addEventListener('click', () => generateSuggestions(false));
$$('.recommend').forEach(button => button.addEventListener('click', () => renderRecommendation(Number(button.dataset.rec))));
$$('[data-feedback]').forEach(button => button.addEventListener('click', () => { $$('[data-feedback]').forEach(item => item.classList.remove('chosen')); button.classList.add('chosen'); showToast(`反馈已记录：${button.dataset.feedback}`); }));
$('#actionBtn').addEventListener('click', () => $('#actionModal').classList.remove('hidden'));
$('#confirmAction').addEventListener('click', confirmAction);
$$('.close-action').forEach(button => button.addEventListener('click', () => $('#actionModal').classList.add('hidden')));
$('#profileBtn').addEventListener('click', openProfile); $('#topProfile').addEventListener('click', openProfile);
$('.close-modal').addEventListener('click', () => $('#profileModal').classList.add('hidden'));
$('#saveProfile').addEventListener('click', () => { const name = $('#modalName').value.trim() || '同学'; const major = $('#modalMajor').value.trim() || '专业未填写'; $('#name').value = name; $('#major').value = major; $('#sideName').textContent = name; $('#sideMajor').textContent = major; $('#profileModal').classList.add('hidden'); showToast('个人信息已保存'); });
$$('.overlay').forEach(overlay => overlay.addEventListener('click', event => { if (event.target === overlay) overlay.classList.add('hidden'); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') $$('.overlay').forEach(overlay => overlay.classList.add('hidden')); });
renderRecommendation(0);
