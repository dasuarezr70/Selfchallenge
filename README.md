# Self Challenge 🎯

**Challenge Yourself. Build Better Habits.**

Self Challenge es una aplicación web de gamificación para el desarrollo personal. Construida en **HTML5, CSS3 y JavaScript ES6 puro** (sin frameworks), 100% estática y lista para **GitHub Pages**.

## ✨ Características

- Sistema de **XP, niveles (Beginner → Legend) y rachas diarias**.
- **19 retos** repartidos en 7 categorías: Salud, Ejercicio, Productividad, Lectura, Bienestar, Finanzas y Medio ambiente.
- **10 insignias** desbloqueables por hitos de constancia, rachas y nivel.
- Ranking (ficticio) para comparar tu progreso.
- Perfil con estadísticas por categoría.
- Ajustes: nombre, avatar, modo oscuro y reseteo de progreso.
- Animaciones y microinteracciones (confeti, toasts, barras animadas).
- Diseño responsive (móvil, tablet, escritorio).
- Persistencia 100% local vía `localStorage` — no requiere backend ni cuentas.

## 📁 Estructura del proyecto

```
SelfChallenge/
├── index.html          Landing page
├── dashboard.html       Panel principal del usuario
├── challenges.html      Catálogo de retos
├── rewards.html         Colección de insignias
├── ranking.html         Ranking global
├── profile.html         Perfil y estadísticas
├── settings.html        Ajustes de la cuenta
├── css/
│   ├── style.css         Design system: tokens, nav, botones, tarjetas
│   ├── dashboard.css      Layouts específicos de cada pantalla
│   ├── animations.css     Animaciones y microinteracciones
│   └── responsive.css     Breakpoints móvil / tablet
├── js/
│   ├── storage.js         Motor de datos: localStorage, XP, niveles, insignias
│   ├── app.js              Navegación, modo oscuro, toasts, confeti
│   ├── dashboard.js        Lógica del dashboard
│   ├── challenges.js       Lógica del catálogo de retos
│   └── profile.js          Lógica del perfil
└── assets/
    ├── icons/
    ├── images/
    ├── avatars/
    └── badges/
```

## 🚀 Cómo publicarlo en GitHub Pages

1. Sube todo el contenido de la carpeta `SelfChallenge/` a un repositorio de GitHub.
2. Ve a **Settings → Pages**.
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. Tu sitio quedará disponible en `https://tu-usuario.github.io/tu-repositorio/`.

No requiere build, ni instalación de dependencias, ni servidor: es HTML/CSS/JS estático.

## 🎨 Sistema de diseño

| Token | Valor |
|---|---|
| Primario | `#4CAF50` |
| Secundario | `#2196F3` |
| Éxito | `#00C853` |
| Advertencia | `#FFC107` |
| Fondo | `#F8FAFC` |
| Texto | `#1F2937` |
| Tipografía | Poppins (Google Fonts) |

## 🧠 Cómo funciona la gamificación

- Cada reto otorga una cantidad fija de XP al completarlo.
- Al acumular suficiente XP se sube de nivel automáticamente (Beginner → Explorer → Challenger → Achiever → Master → Legend).
- Completar un reto en días consecutivos aumenta la racha; un día sin completar ningún reto la reinicia.
- Las insignias se desbloquean automáticamente al cumplir condiciones (primer reto, rachas, niveles, número de retos completados, categorías tocadas).
- Todo el estado se guarda en `localStorage` bajo la clave `selfchallenge_state_v1` y persiste entre sesiones.

## 🛠️ Próximas ampliaciones sugeridas

- Retos personalizados creados por el usuario.
- Exportar/importar progreso en JSON.
- Recordatorios locales (Notification API).
- PWA con soporte offline.
