/**
 * profile.js — renders the user's profile summary: avatar, level,
 * total XP, completed challenges, max streak, badges and stats.
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = SC.load();
  const progress = SC.xpProgress(state);

  document.querySelector('[data-profile-avatar]').textContent = state.avatar;
  document.querySelector('[data-profile-name]').textContent = state.name;
  document.querySelector('[data-profile-level]').textContent = `Nivel ${state.level} — ${progress.levelName}`;

  document.querySelector('[data-profile-xp]').textContent = state.xp;
  document.querySelector('[data-profile-completed]').textContent = state.totalCompleted;
  document.querySelector('[data-profile-maxstreak]').textContent = state.maxStreak;
  document.querySelector('[data-profile-badges]').textContent = state.badges.length;

  // Category breakdown
  const catCounts = {};
  Object.values(state.completedHistory).flat().forEach((id) => {
    const c = SC.CHALLENGE_CATALOG.find((x) => x.id === id);
    if (!c) return;
    catCounts[c.category] = (catCounts[c.category] || 0) + 1;
  });
  const catWrap = document.querySelector('[data-category-stats]');
  catWrap.innerHTML = '';
  const categories = [...new Set(SC.CHALLENGE_CATALOG.map((c) => c.category))];
  const maxCount = Math.max(1, ...Object.values(catCounts));
  categories.forEach((cat) => {
    const count = catCounts[cat] || 0;
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom:14px;';
    row.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
        <span>${cat}</span><span>${count}</span>
      </div>
      <div class="progress-track" style="height:8px;"><div class="progress-fill" style="width:${(count / maxCount) * 100}%"></div></div>
    `;
    catWrap.appendChild(row);
  });

  // Badge grid
  const badgeGrid = document.querySelector('[data-profile-badge-grid]');
  badgeGrid.innerHTML = '';
  SC.BADGE_CATALOG.forEach((b) => {
    const unlocked = state.badges.includes(b.id);
    const el = document.createElement('div');
    el.className = 'reward-badge card' + (unlocked ? '' : ' locked');
    el.innerHTML = `<div class="badge-icon">${b.icon}</div><h4>${b.name}</h4>`;
    badgeGrid.appendChild(el);
  });
});
