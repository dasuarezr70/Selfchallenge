/**
 * challenges.js — renders the challenge catalog grouped by category,
 * with filtering tabs and complete-challenge interactions.
 */

let SC_STATE = null;
let SC_FILTER = 'Todos';

document.addEventListener('DOMContentLoaded', () => {
  SC_STATE = SC.load();
  buildTabs();
  renderChallenges();
});

function buildTabs() {
  const categories = ['Todos', ...new Set(SC.CHALLENGE_CATALOG.map((c) => c.category))];
  const wrap = document.querySelector('[data-category-tabs]');
  wrap.innerHTML = '';
  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab' + (cat === SC_FILTER ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      SC_FILTER = cat;
      document.querySelectorAll('.category-tab').forEach((t) => t.classList.remove('active'));
      btn.classList.add('active');
      renderChallenges();
    });
    wrap.appendChild(btn);
  });
}

function renderChallenges() {
  const grid = document.querySelector('[data-challenges-grid]');
  grid.innerHTML = '';
  const list = SC.CHALLENGE_CATALOG.filter((c) => SC_FILTER === 'Todos' || c.category === SC_FILTER);

  list.forEach((c, i) => {
    const done = SC_STATE.completedToday.includes(c.id);
    const card = document.createElement('div');
    card.className = `card card-hover challenge-card reveal reveal-${(i % 5) + 1}` + (done ? ' done' : '');
    card.innerHTML = `
      <div class="ch-top">
        <span class="ch-icon">${c.icon}</span>
        <span class="pill">${c.category}</span>
      </div>
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <div class="ch-meta">
        <span class="pill ${difficultyClass(c.difficulty)}">${c.difficulty}</span>
        <span class="pill pill-success">+${c.xp} XP</span>
      </div>
      <button class="btn btn-primary btn-block" data-complete="${c.id}" ${done ? 'disabled' : ''}>
        ${done ? 'Completado ✔' : 'Completar reto'}
      </button>
    `;
    card.querySelector('[data-complete]').addEventListener('click', (e) => handleComplete(c.id, card, e.target));
    grid.appendChild(card);
  });

  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="icon">🗂️</div><p>No hay retos en esta categoría todavía.</p></div>';
  }
}

function difficultyClass(d) {
  if (d === 'Fácil') return 'pill-success';
  if (d === 'Media') return 'pill-warning';
  return 'pill-secondary';
}

function handleComplete(id, cardEl, buttonEl) {
  const result = SC.completeChallenge(SC_STATE, id);
  if (!result) return;
  if (result.alreadyDone) {
    scToast('Ya completaste este reto hoy', '', 'info');
    return;
  }
  cardEl.classList.add('completing', 'done');
  buttonEl.textContent = 'Completado ✔';
  buttonEl.setAttribute('disabled', 'true');
  scConfetti();
  scToast('Reto completado', result.message, 'success');
  if (result.leveledUp) {
    setTimeout(() => scToast(`¡Subiste a nivel ${SC_STATE.level}!`, SC.levelInfo(SC_STATE.level).name, 'level'), 500);
  }
  result.newBadges.forEach((b, i) => {
    setTimeout(() => scToast(`Nueva insignia: ${b.name}`, b.description, 'badge'), 900 + i * 500);
  });
}
