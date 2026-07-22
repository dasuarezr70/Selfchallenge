/**
 * storage.js
 * ------------------------------------------------------------------
 * Self Challenge — Data layer & gamification engine.
 * Everything that touches localStorage or game rules (XP, levels,
 * streaks, badges, challenge catalog) lives here so every page can
 * share a single source of truth.
 * ------------------------------------------------------------------
 */

const SC = (() => {
  const STORAGE_KEY = 'selfchallenge_state_v1';

  /** XP required to reach the NEXT level, indexed by current level (1-based). */
  const LEVELS = [
    { level: 1, name: 'Beginner',   xpToNext: 100 },
    { level: 2, name: 'Explorer',   xpToNext: 250 },
    { level: 3, name: 'Challenger', xpToNext: 450 },
    { level: 4, name: 'Achiever',   xpToNext: 700 },
    { level: 5, name: 'Master',     xpToNext: 1000 },
    { level: 6, name: 'Legend',     xpToNext: Infinity },
  ];

  /** Static challenge catalog, grouped by category. */
  const CHALLENGE_CATALOG = [
    { id: 'h1', category: 'Salud', icon: '💧', title: 'Bebe 2 litros de agua', description: 'Mantente hidratado durante todo el día.', difficulty: 'Fácil', xp: 15 },
    { id: 'h2', category: 'Salud', icon: '😴', title: 'Duerme 8 horas', description: 'Descansa lo suficiente para rendir al máximo.', difficulty: 'Media', xp: 20 },
    { id: 'h3', category: 'Salud', icon: '🥗', title: 'Come 3 porciones de vegetales', description: 'Incluye vegetales en al menos dos comidas.', difficulty: 'Fácil', xp: 15 },

    { id: 'e1', category: 'Ejercicio', icon: '🏃', title: 'Corre 3 km', description: 'Sal a correr o trotar sin parar.', difficulty: 'Media', xp: 25 },
    { id: 'e2', category: 'Ejercicio', icon: '🏋️', title: 'Entrena 30 minutos', description: 'Realiza una rutina de fuerza o cardio.', difficulty: 'Media', xp: 25 },
    { id: 'e3', category: 'Ejercicio', icon: '🧘', title: 'Haz 10 minutos de estiramiento', description: 'Mejora tu movilidad y evita lesiones.', difficulty: 'Fácil', xp: 10 },

    { id: 'p1', category: 'Productividad', icon: '✅', title: 'Completa tu lista de tareas', description: 'Termina las 3 tareas más importantes del día.', difficulty: 'Media', xp: 20 },
    { id: 'p2', category: 'Productividad', icon: '📵', title: '1 hora sin redes sociales', description: 'Desconéctate y enfócate en algo importante.', difficulty: 'Difícil', xp: 30 },
    { id: 'p3', category: 'Productividad', icon: '🗂️', title: 'Organiza tu espacio de trabajo', description: 'Ordena tu escritorio físico o digital.', difficulty: 'Fácil', xp: 10 },

    { id: 'l1', category: 'Lectura', icon: '📖', title: 'Lee 20 páginas', description: 'Avanza en el libro que estás leyendo.', difficulty: 'Fácil', xp: 15 },
    { id: 'l2', category: 'Lectura', icon: '🎧', title: 'Escucha un audiolibro', description: 'Dedica 30 minutos a un audiolibro o podcast educativo.', difficulty: 'Fácil', xp: 15 },

    { id: 'b1', category: 'Bienestar', icon: '🧠', title: 'Medita 10 minutos', description: 'Practica mindfulness o respiración consciente.', difficulty: 'Fácil', xp: 15 },
    { id: 'b2', category: 'Bienestar', icon: '📓', title: 'Escribe en tu diario', description: 'Anota 3 cosas por las que estás agradecido.', difficulty: 'Fácil', xp: 10 },
    { id: 'b3', category: 'Bienestar', icon: '🌞', title: 'Toma sol 15 minutos', description: 'Sal al aire libre y recibe luz natural.', difficulty: 'Fácil', xp: 10 },

    { id: 'f1', category: 'Finanzas', icon: '💰', title: 'Registra tus gastos del día', description: 'Anota todo lo que gastaste hoy.', difficulty: 'Fácil', xp: 15 },
    { id: 'f2', category: 'Finanzas', icon: '🏦', title: 'Ahorra un monto fijo', description: 'Aparta dinero para tu fondo de ahorro.', difficulty: 'Media', xp: 20 },
    { id: 'f3', category: 'Finanzas', icon: '🚫', title: 'Día sin gastos innecesarios', description: 'Evita compras impulsivas durante 24 horas.', difficulty: 'Difícil', xp: 30 },

    { id: 'm1', category: 'Medio ambiente', icon: '♻️', title: 'Recicla en casa', description: 'Separa correctamente tus residuos.', difficulty: 'Fácil', xp: 10 },
    { id: 'm2', category: 'Medio ambiente', icon: '🚲', title: 'Muévete sin auto', description: 'Camina, usa bici o transporte público.', difficulty: 'Media', xp: 20 },
    { id: 'm3', category: 'Medio ambiente', icon: '🌱', title: 'Reduce el plástico de un solo uso', description: 'Evita bolsas, pitillos o envases desechables.', difficulty: 'Media', xp: 20 },
  ];

  /** Badge definitions unlocked by milestones. */
  const BADGE_CATALOG = [
    { id: 'first_step',   icon: '🥉', name: 'Primer Paso',     description: 'Completa tu primer reto.',              check: (s) => s.totalCompleted >= 1 },
    { id: 'ten_challenges', icon: '🥈', name: 'Constante',       description: 'Completa 10 retos.',                    check: (s) => s.totalCompleted >= 10 },
    { id: 'fifty_challenges', icon: '🥇', name: 'Imparable',      description: 'Completa 50 retos.',                    check: (s) => s.totalCompleted >= 50 },
    { id: 'streak_3',     icon: '🔥', name: 'Racha x3',         description: 'Mantén una racha de 3 días.',           check: (s) => s.maxStreak >= 3 },
    { id: 'streak_7',     icon: '🔥', name: 'Racha x7',         description: 'Mantén una racha de 7 días.',           check: (s) => s.maxStreak >= 7 },
    { id: 'streak_30',    icon: '🔥', name: 'Racha x30',        description: 'Mantén una racha de 30 días.',          check: (s) => s.maxStreak >= 30 },
    { id: 'level_up',     icon: '⭐', name: 'Explorador',        description: 'Alcanza el nivel Explorer.',            check: (s) => s.level >= 2 },
    { id: 'master',       icon: '👑', name: 'Maestro',          description: 'Alcanza el nivel Master.',              check: (s) => s.level >= 5 },
    { id: 'legend',       icon: '🏆', name: 'Leyenda',          description: 'Alcanza el nivel Legend.',              check: (s) => s.level >= 6 },
    { id: 'all_categories', icon: '🌈', name: 'Todoterreno',     description: 'Completa un reto de cada categoría.',   check: (s) => s.categoriesTouched && s.categoriesTouched.length >= 7 },
  ];

  const MOTIVATIONAL_MESSAGES = [
    '¡Increíble! Un paso más cerca de tu mejor versión.',
    '¡Sigue así! La constancia es tu superpoder.',
    '¡Reto superado! Tu disciplina está dando frutos.',
    '¡Excelente! Cada pequeño logro suma en grande.',
    '¡Vas con todo! No hay quien te detenga hoy.',
  ];

  function defaultState() {
    return {
      name: 'Jugador',
      avatar: '🧑',
      xp: 0,
      level: 1,
      totalCompleted: 0,
      completedToday: [],
      completedHistory: {},   // { 'YYYY-MM-DD': [challengeId, ...] }
      streak: 0,
      maxStreak: 0,
      lastActiveDate: null,
      badges: [],
      categoriesTouched: [],
      darkMode: false,
      weeklyGoal: 5,
    };
  }

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysBetween(a, b) {
    const d1 = new Date(a);
    const d2 = new Date(b);
    return Math.round((d2 - d1) / 86400000);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return { ...defaultState(), ...parsed };
    } catch (e) {
      console.warn('SelfChallenge: could not read saved state, starting fresh.', e);
      return defaultState();
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  /** Refresh streak based on the gap since last activity. Call once per page load. */
  function refreshStreak(state) {
    const today = todayStr();
    if (state.lastActiveDate) {
      const gap = daysBetween(state.lastActiveDate, today);
      if (gap === 1) {
        // Consecutive day — streak continues once they complete something today (handled on completion).
      } else if (gap > 1) {
        state.streak = 0;
        state.completedToday = [];
      } else if (gap === 0) {
        // Same day, nothing to do.
      }
    }
    if (state.lastActiveDate !== today && daysBetween(state.lastActiveDate || today, today) !== 0) {
      state.completedToday = state.completedToday || [];
    }
    return state;
  }

  function levelInfo(level) {
    return LEVELS.find((l) => l.level === level) || LEVELS[LEVELS.length - 1];
  }

  function xpProgress(state) {
    const info = levelInfo(state.level);
    const xpForCurrent = state.level > 1
      ? LEVELS.slice(0, state.level - 1).reduce((sum, l) => sum + l.xpToNext, 0)
      : 0;
    const xpIntoLevel = state.xp - xpForCurrent;
    const xpNeeded = info.xpToNext;
    const percent = xpNeeded === Infinity ? 100 : Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100));
    return { xpIntoLevel, xpNeeded, percent, levelName: info.name };
  }

  function checkLevelUp(state) {
    let leveledUp = false;
    while (true) {
      const info = levelInfo(state.level);
      const xpForCurrent = state.level > 1
        ? LEVELS.slice(0, state.level - 1).reduce((sum, l) => sum + l.xpToNext, 0)
        : 0;
      const xpIntoLevel = state.xp - xpForCurrent;
      if (info.xpToNext !== Infinity && xpIntoLevel >= info.xpToNext && state.level < LEVELS.length) {
        state.level += 1;
        leveledUp = true;
      } else {
        break;
      }
    }
    return leveledUp;
  }

  function checkNewBadges(state) {
    const newly = [];
    BADGE_CATALOG.forEach((b) => {
      if (!state.badges.includes(b.id) && b.check(state)) {
        state.badges.push(b.id);
        newly.push(b);
      }
    });
    return newly;
  }

  /** Complete a challenge: updates xp, streak, history, badges. Returns a summary of what happened. */
  function completeChallenge(state, challengeId) {
    const challenge = CHALLENGE_CATALOG.find((c) => c.id === challengeId);
    if (!challenge) return null;

    const today = todayStr();
    state.completedToday = state.completedToday || [];
    if (state.completedToday.includes(challengeId)) {
      return { alreadyDone: true };
    }

    // Streak logic
    if (state.lastActiveDate !== today) {
      const gap = state.lastActiveDate ? daysBetween(state.lastActiveDate, today) : 1;
      if (gap === 1) {
        state.streak += 1;
      } else {
        state.streak = 1;
      }
      state.completedToday = [];
      state.lastActiveDate = today;
    } else if (state.streak === 0) {
      state.streak = 1;
    }
    state.maxStreak = Math.max(state.maxStreak, state.streak);

    state.completedToday.push(challengeId);
    state.completedHistory[today] = state.completedHistory[today] || [];
    state.completedHistory[today].push(challengeId);
    state.totalCompleted += 1;
    state.xp += challenge.xp;

    state.categoriesTouched = state.categoriesTouched || [];
    if (!state.categoriesTouched.includes(challenge.category)) {
      state.categoriesTouched.push(challenge.category);
    }

    const leveledUp = checkLevelUp(state);
    const newBadges = checkNewBadges(state);

    save(state);
    return {
      challenge,
      leveledUp,
      newBadges,
      message: MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
    };
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function applyDarkMode(state) {
    document.documentElement.classList.toggle('dark', !!state.darkMode);
  }

  const FICTIONAL_RANKING = [
    { name: 'Valentina R.', avatar: '🦊', level: 6, xp: 3120 },
    { name: 'Mateo S.',     avatar: '🐺', level: 6, xp: 2890 },
    { name: 'Sofía L.',     avatar: '🐼', level: 5, xp: 2210 },
    { name: 'Diego M.',     avatar: '🐯', level: 5, xp: 1980 },
    { name: 'Camila G.',    avatar: '🐨', level: 4, xp: 1420 },
    { name: 'Andrés P.',    avatar: '🦁', level: 4, xp: 1230 },
    { name: 'Lucía F.',     avatar: '🐰', level: 3, xp: 780 },
    { name: 'Samuel T.',    avatar: '🐸', level: 3, xp: 640 },
  ];

  return {
    STORAGE_KEY,
    LEVELS,
    CHALLENGE_CATALOG,
    BADGE_CATALOG,
    FICTIONAL_RANKING,
    load,
    save,
    refreshStreak,
    levelInfo,
    xpProgress,
    completeChallenge,
    resetProgress,
    applyDarkMode,
    todayStr,
  };
})();
