/**
 * Palestinian Archive — main.js
 */
(function() {
'use strict';

const PA = window.PA = {};

/* ============================================================
   LANGUAGE / DIRECTION TOGGLE
   ============================================================ */
PA.setLang = function(lang) {
  const isAr = lang === 'ar';
  document.documentElement.dir = isAr ? 'rtl' : 'ltr';
  document.body.classList.toggle('lang-en', !isAr);
  document.body.classList.toggle('rtl', isAr);

  document.getElementById('btn-ar')?.setAttribute('aria-pressed', isAr ? 'true' : 'false');
  document.getElementById('btn-en')?.setAttribute('aria-pressed', isAr ? 'false' : 'true');
  document.getElementById('btn-ar')?.classList.toggle('active', isAr);
  document.getElementById('btn-en')?.classList.toggle('active', !isAr);

  try { localStorage.setItem('pa_lang', lang); } catch(e) {}
};

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.getElementById('primary-navigation');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function() {
    const open = nav.classList.toggle('mobile-open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Sub-menu toggle on mobile
  nav.querySelectorAll('.primary-menu > li > a').forEach(link => {
    if (link.nextElementSibling?.classList.contains('sub-menu')) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
        }
      });
    }
  });
}

/* ============================================================
   HEADER SCROLL EFFECT
   ============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightboxImages = [];
let currentLightboxIdx = 0;

function openLightbox(src, caption, idx) {
  const overlay = document.getElementById('pa-lightbox');
  const img     = document.getElementById('pa-lightbox-img');
  const cap     = document.getElementById('pa-lightbox-caption');
  if (!overlay || !img) return;

  img.src = src;
  img.alt = caption || '';
  if (cap) cap.textContent = caption || '';
  currentLightboxIdx = idx !== undefined ? idx : 0;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

PA.closeLightbox = function() {
  const overlay = document.getElementById('pa-lightbox');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
};

PA.lightboxNav = function(dir) {
  if (!lightboxImages.length) return;
  currentLightboxIdx = (currentLightboxIdx + dir + lightboxImages.length) % lightboxImages.length;
  const item = lightboxImages[currentLightboxIdx];
  openLightbox(item.src, item.caption, currentLightboxIdx);
};

function initLightbox() {
  document.querySelectorAll('.pa-lightbox-trigger').forEach((el, idx) => {
    lightboxImages.push({
      src:     el.href,
      caption: el.dataset.caption || '',
    });
    el.addEventListener('click', function(e) {
      e.preventDefault();
      openLightbox(el.href, el.dataset.caption || '', idx);
    });
  });

  // Close on overlay click / Escape
  const overlay = document.getElementById('pa-lightbox');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) PA.closeLightbox();
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') PA.closeLightbox();
    if (e.key === 'ArrowLeft')  PA.lightboxNav(1);
    if (e.key === 'ArrowRight') PA.lightboxNav(-1);
  });
}

/* ============================================================
   ARCHIVE AJAX FILTER
   ============================================================ */
function initArchiveFilter() {
  const periodEl  = document.getElementById('filter-period');
  const locationEl= document.getElementById('filter-location');
  const doctypeEl = document.getElementById('filter-doctype');
  const resetBtn  = document.getElementById('filter-reset');
  const results   = document.getElementById('archive-results');
  const countEl   = document.getElementById('filter-count');

  if (!periodEl || !results) return;

  const postType = document.querySelector('[data-post-type]')?.dataset.postType
    || document.body.className.match(/post-type-([^\s]+)/)?.[1]
    || 'pa_document';

  let debounceTimer;

  function runFilter() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doFilter, 300);
  }

  function doFilter() {
    if (!window.PA_DATA) return;
    results.style.opacity = '0.4';

    const params = new URLSearchParams({
      action:       'pa_filter',
      nonce:        PA_DATA.nonce,
      post_type:    postType,
      pa_period:    periodEl?.value || '',
      pa_location_tax: locationEl?.value || '',
      pa_doc_type:  doctypeEl?.value || '',
    });

    fetch(PA_DATA.ajaxurl, { method: 'POST', body: params })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          results.innerHTML = data.data.html;
          results.style.opacity = '1';
          if (countEl) countEl.textContent = data.data.total + ' نتيجة';
          initLightbox(); // re-init for new items
        }
      })
      .catch(() => { results.style.opacity = '1'; });
  }

  [periodEl, locationEl, doctypeEl].forEach(el => el?.addEventListener('change', runFilter));

  resetBtn?.addEventListener('click', function() {
    if (periodEl)   periodEl.value   = '';
    if (locationEl) locationEl.value = '';
    if (doctypeEl)  doctypeEl.value  = '';
    doFilter();
  });
}

/* ============================================================
   CARD HOVER — load-as-you-scroll (Intersection Observer)
   ============================================================ */
function initLazyCards() {
  const cards = document.querySelectorAll('.document-card, .category-card');
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity .4s ease ${i * 0.05}s, transform .4s ease ${i * 0.05}s`;
    observer.observe(card);
  });
}

/* ============================================================
   STICKY FILTER BAR
   ============================================================ */
function initStickyFilter() {
  const bar = document.querySelector('.archive-filter-bar');
  if (!bar) return;
  const header = document.getElementById('site-header');
  const headerH = header ? header.offsetHeight : 0;
  bar.style.setProperty('--header-height', headerH + 'px');
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.textContent.replace(/[^\d]/g, ''), 10);
  if (!target) return;
  let current = 0;
  const increment = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = current.toLocaleString('ar-EG');
    if (current >= target) clearInterval(timer);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.hero-stat-number, .stat-num');
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); observer.unobserve(e.target); }
    });
  });
  counters.forEach(c => observer.observe(c));
}

/* ============================================================
   RESTORE LANGUAGE PREFERENCE
   ============================================================ */
function restoreLang() {
  try {
    const saved = localStorage.getItem('pa_lang');
    if (saved && saved !== (document.documentElement.dir === 'rtl' ? 'ar' : 'en')) {
      PA.setLang(saved);
    }
  } catch(e) {}
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
  restoreLang();
  initMobileMenu();
  initHeaderScroll();
  initLightbox();
  initArchiveFilter();
  initLazyCards();
  initStickyFilter();
  initCounters();
});

})();
