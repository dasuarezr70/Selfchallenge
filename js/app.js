/**
 * app.js
 * ------------------------------------------------------------------
 * Shared behaviour used on every page: navbar state, mobile menu,
 * dark mode toggle, and reusable toast / confetti helpers.
 * Depends on storage.js being loaded first.
 * ------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  const state = SC.load();
  SC.refreshStreak(state);
  SC.applyDarkMode(state);
  SC.save(state);

  // Highlight the active nav link based on current file name.
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });

  // Populate the shared user chip in the navbar, if present.
  const navAvatar = document.querySelector('[data-nav-avatar]');
  const navName = document.querySelector('[data-nav-name]');
  if (navAvatar) navAvatar.textContent = state.avatar;
  if (navName) navName.textContent = state.name;

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('mobile-open'));
  }
});

/** Show a toast notification. type: 'success' | 'level' | 'badge' | 'info' */
function scToast(message, subtitle = '', type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', level: '⬆️', badge: '🏅', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <div class="toast-text"><strong>${message}</strong>${subtitle ? `<span>${subtitle}</span>` : ''}</div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('closing');
    setTimeout(() => toast.remove(), 320);
  }, 3200);
}

/** Small celebratory confetti burst from the center-top of the viewport. */
function scConfetti() {
  const colors = ['#4CAF50', '#2196F3', '#00C853', '#FFC107'];
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${45 + Math.random() * 10}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    piece.style.transform = `translateX(${(Math.random() - 0.5) * 300}px)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1800);
  }
}
