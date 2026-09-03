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

  /* --- Apparition en fondu générique (toutes les sections) --- */
  const revealItems = document.querySelectorAll('.reveal, .reveal-photo');

  // Décalage progressif entre éléments d'une même section
  const perSectionCount = {};
  revealItems.forEach((el) => {
    const section = el.closest('section[id]');
    const key = section ? section.id : 'default';
    perSectionCount[key] = (perSectionCount[key] || 0);
    el.style.transitionDelay = `${Math.min(perSectionCount[key], 5) * 90}ms`;
    perSectionCount[key]++;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealItems.forEach((el) => revealObserver.observe(el));

  /* --- Formulaire de contact : envoi du message vers WhatsApp --- */
  // Remplace ce numéro par le tien, au format international sans "+", "espaces" ni "00"
  // Exemple : pour +243 812 345 678 -> "243812345678"
  const WHATSAPP_NUMBER = '243825564807';

  const contactForm = document.getElementById('contact-form');
  const cfFeedback = document.getElementById('cf-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const message = document.getElementById('cf-message').value.trim();

      if (!name || !email || !message) {
        cfFeedback.textContent = 'Merci de remplir tous les champs avant d\'envoyer.';
        cfFeedback.classList.remove('hidden');
        return;
      }

      const text = `Bonjour, je m'appelle ${name} (${email}).\n\n${message}`;
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

      cfFeedback.textContent = 'Ouverture de WhatsApp…';
      cfFeedback.classList.remove('hidden');

      window.open(waUrl, '_blank', 'noopener,noreferrer');
      contactForm.reset();
    });
  }

  /* --- Section Avis : notation par étoiles, publication, affichage --- */
  const REVIEWS_KEY = 'portfolio_reviews';

  const seedReviews = [
    { name: 'Sarah K.', rating: 5, message: "Travail soigné et livré dans les temps. Christ a parfaitement compris ce qu'on voulait pour notre identité visuelle." },
    { name: 'Emmanuel T.', rating: 5, message: "Super collaboration sur notre site vitrine, très réactif et de bons conseils techniques." },
    { name: 'Grace M.', rating: 4, message: "Bon relationnel et de belles maquettes. Je recommande pour tout projet de design." },
  ];

  function getReviews() {
    try {
      const stored = JSON.parse(localStorage.getItem(REVIEWS_KEY));
      return Array.isArray(stored) && stored.length ? stored : seedReviews;
    } catch {
      return seedReviews;
    }
  }

  function saveReviews(reviews) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }

  function renderStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  function renderReviews() {
    const list = document.getElementById('reviews-list');
    if (!list) return;
    const reviews = getReviews();

    list.innerHTML = reviews
      .map((r) => {
        const initial = r.name.trim().charAt(0).toUpperCase() || '?';
        return `
          <div class="p-5 rounded-2xl bg-ink/5 dark:bg-fog/5 border border-ink/10 dark:border-fog/15">
            <div class="flex items-center gap-3 mb-3">
              <span class="avatar-initial w-10 h-10 rounded-full bg-amber/20 text-amber">${initial}</span>
              <div>
                <p class="font-medium text-sm">${r.name}</p>
                <p class="text-amber text-xs leading-none">${renderStars(r.rating)}</p>
              </div>
            </div>
            <p class="text-sm text-ink/70 dark:text-fog/70 leading-relaxed">${r.message}</p>
          </div>
        `;
      })
      .join('');
  }

  renderReviews();

  // Sélecteur d'étoiles interactif
  const starButtons = document.querySelectorAll('.star-btn');
  const starsWrap = document.getElementById('rf-stars');

  function paintStars(value) {
    starButtons.forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.value) <= value);
    });
  }
  if (starsWrap) {
    starsWrap.dataset.rating = '5';
    paintStars(5);
  }
  starButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = Number(btn.dataset.value);
      starsWrap.dataset.rating = String(value);
      paintStars(value);
    });
  });

  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rf-name').value.trim();
      const message = document.getElementById('rf-message').value.trim();
      const rating = Number(starsWrap.dataset.rating || 5);

      if (!name || !message) return;

      const reviews = getReviews();
      reviews.unshift({ name, rating, message });
      saveReviews(reviews);
      renderReviews();

      reviewForm.reset();
      starsWrap.dataset.rating = '5';
      paintStars(5);
    });
  }

  /* --- Bouton retour en haut --- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 500;
      backToTop.classList.toggle('opacity-0', !show);
      backToTop.classList.toggle('pointer-events-none', !show);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Année courante dans le footer --- */
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
