/**
 * dashboard.js — renders the dashboard's dynamic content:
 * greeting, level/XP, streak, featured challenge, weekly goal,
 * and recent badges. Depends on storage.js + app.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = SC.load();
  render(state);
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function render(state) {
  document.querySelector('[data-greeting]').textContent = `${greeting()}, ${state.name} 👋`;

  const progress = SC.xpProgress(state);
  document.querySelector('[data-level-name]').textContent = `Nivel ${state.level} — ${progress.levelName}`;
  document.querySelector('[data-xp-label]').textContent = `${progress.xpIntoLevel} / ${progress.xpNeeded === Infinity ? '∞' : progress.xpNeeded} XP`;
  requestAnimationFrame(() => {
    document.querySelector('[data-xp-fill]').style.width = `${progress.percent}%`;
  });

  document.querySelector('[data-total-xp]').textContent = state.xp;
  document.querySelector('[data-streak]').textContent = state.streak;
  document.querySelector('[data-completed]').textContent = state.totalCompleted;
  document.querySelector('[data-badges-count]').textContent = state.badges.length;

  // Featured challenge: first not completed today, otherwise a random one.
  const notDoneToday = SC.CHALLENGE_CATALOG.filter((c) => !state.completedToday.includes(c.id));
  const featured = notDoneToday[Math.floor(Math.random() * notDoneToday.length)] || SC.CHALLENGE_CATALOG[0];
  const featEl = document.querySelector('[data-featured]');
  featEl.innerHTML = `
    <span class="eyebrow" style="color:rgba(255,255,255,0.85);">Reto destacado de hoy</span>
    <h3>${featured.icon} ${featured.title}</h3>
    <p>${featured.description}</p>
    <div style="display:flex; align-items:center; gap:12px; margin-top:16px;">
      <span class="pill" style="background:rgba(255,255,255,0.2); color:#fff;">+${featured.xp} XP</span>
      <button class="btn" style="background:#fff; color: var(--color-primary); font-weight:700;" data-complete="${featured.id}">Completar reto</button>
    </div>
    <span class="icon-badge">${featured.icon}</span>
  `;
  featEl.querySelector('[data-complete]').addEventListener('click', (e) => {
    handleComplete(state, featured.id, e.target);
  });

  // Weekly goal dots (last 7 days)
  const track = document.querySelector('[data-week-track]');
  track.innerHTML = '';
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const done = (state.completedHistory[key] || []).length > 0;
    const dot = document.createElement('div');
    dot.className = 'day-dot' + (done ? ' done' : '');
    track.appendChild(dot);
  }
  const weekCount = Object.keys(state.completedHistory).filter((k) => {
    const diff = SCdaysAgo(k);
    return diff >= 0 && diff < 7;
  }).length;
  document.querySelector('[data-week-count]').textContent = `${weekCount} / 7 días activos`;

  // Recent badges
  const badgesWrap = document.querySelector('[data-recent-badges]');
  badgesWrap.innerHTML = '';
  const recent = state.badges.slice(-4).reverse();
  if (recent.length === 0) {
    badgesWrap.innerHTML = '<p style="font-size:0.85rem;">Completa retos para desbloquear tus primeras insignias.</p>';
  } else {
    recent.forEach((id) => {
      const b = SC.BADGE_CATALOG.find((x) => x.id === id);
      if (!b) return;
      const el = document.createElement('div');
      el.style.cssText = 'text-align:center; flex:1;';
      el.innerHTML = `<div style="font-size:1.8rem;">${b.icon}</div><div style="font-size:0.75rem; font-weight:600;">${b.name}</div>`;
      badgesWrap.appendChild(el);
    });
  }
}

function SCdaysAgo(dateStr) {
  const today = new Date(SC.todayStr());
  const d = new Date(dateStr);
  return Math.round((today - d) / 86400000);
}

function handleComplete(state, challengeId, buttonEl) {
  const result = SC.completeChallenge(state, challengeId);
  if (!result) return;
  if (result.alreadyDone) {
    scToast('Ya completaste este reto hoy', '', 'info');
    return;
  }
  buttonEl.textContent = '¡Completado! ✔';
  buttonEl.setAttribute('disabled', 'true');
  scConfetti();
  scToast('Reto completado', result.message, 'success');
  if (result.leveledUp) {
    setTimeout(() => scToast(`¡Subiste a nivel ${state.level}!`, SC.levelInfo(state.level).name, 'level'), 500);
  }
  result.newBadges.forEach((b, i) => {
    setTimeout(() => scToast(`Nueva insignia: ${b.name}`, b.description, 'badge'), 900 + i * 500);
  });
  setTimeout(() => render(state), 700);
}
