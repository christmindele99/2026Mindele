/* ============================================================
   PORTFOLIO — script.js
   Toute la logique JavaScript du site (thème, config Tailwind,
   détection de section active dans la navigation).
   ============================================================ */

/* ---- 1. Anti-flash du thème (exécuté avant le rendu de la page) ---- */
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
  }
})();

/* ---- 2. Configuration Tailwind (couleurs, polices personnalisées) ---- */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#1B1D22',
        cream: '#F7F5F0',
        night: '#14161B',
        fog: '#F2F0EA',
        amber: '#E8A33D',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
};

/* ---- 3. Logique déclenchée une fois le DOM prêt ---- */
document.addEventListener('DOMContentLoaded', () => {
  /* --- Toggle thème clair / sombre --- */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const iconSun = document.getElementById('icon-sun');
  const iconMoon = document.getElementById('icon-moon');

  function updateThemeIcon() {
    const isDark = html.classList.contains('dark');
    iconSun.classList.toggle('hidden', isDark);
    iconMoon.classList.toggle('hidden', !isDark);
  }
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });

  /* --- Mise en surbrillance du lien actif selon la section visible --- */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach((item) => {
            item.classList.toggle('active', item.dataset.target === id);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));

  /* --- Animation des barres de compétences au scroll --- */
  const skillFills = document.querySelectorAll('.skill-fill');
  skillFills.forEach((fill) => {
    fill.dataset.targetWidth = fill.style.width;
    fill.style.width = '0%';
  });

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.transition = 'width 1s ease';
          fill.style.width = fill.dataset.targetWidth;
          skillObserver.unobserve(fill);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillFills.forEach((fill) => skillObserver.observe(fill));

  /* --- Filtre des projets (Tous / Design graphique / Développement web) --- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach((item) => {
        const matches = filter === 'all' || item.dataset.category === filter;
        if (matches) {
          item.classList.remove('is-hidden');
          requestAnimationFrame(() => item.classList.remove('is-fading'));
        } else {
          item.classList.add('is-fading');
          setTimeout(() => item.classList.add('is-hidden'), 250);
        }
      });
    });
  });

  /* --- Apparition en fondu des cartes projet au scroll (effet décalé) --- */
  const projectObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          projectObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  projectItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 3) * 90}ms`;
    projectObserver.observe(item);
  });
});
