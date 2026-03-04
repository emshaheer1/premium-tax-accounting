(function () {
  'use strict';

  // Theme: apply saved preference (run early to avoid flash)
  var saved = typeof localStorage !== 'undefined' && localStorage.getItem('pta_theme');
  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav');
  const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
  const dropdown = document.querySelector('.nav-dropdown');
  const animateElements = document.querySelectorAll('.animate-in');

  // Logo fallback: if header logo img fails to load, show text
  const logoImg = document.querySelector('.logo .logo-img');
  const logoFallback = document.querySelector('.logo .logo-text-fallback');
  if (logoImg && logoFallback) {
    logoImg.addEventListener('error', function () {
      logoImg.style.display = 'none';
      logoFallback.style.display = 'inline';
    });
  }

  // Header scroll effect
  function onScroll() {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-mobile-open');
      navToggle.setAttribute('aria-label',
        document.body.classList.contains('nav-mobile-open') ? 'Close menu' : 'Open menu');
      navToggle.setAttribute('aria-expanded',
        document.body.classList.contains('nav-mobile-open'));
    });
  }

  // Services dropdown (desktop)
  if (dropdownTrigger && dropdown) {
    dropdownTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      dropdown.classList.toggle('open');
      dropdownTrigger.setAttribute('aria-expanded', dropdown.classList.contains('open'));
    });
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Search toggle: show/hide search form and focus input
  const searchToggle = document.getElementById('searchToggle');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  if (searchToggle && searchForm) {
    searchToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      searchForm.classList.toggle('is-open');
      searchToggle.setAttribute('aria-label', searchForm.classList.contains('is-open') ? 'Close search' : 'Open search');
      if (searchForm.classList.contains('is-open') && searchInput) {
        setTimeout(function () { searchInput.focus(); }, 100);
      }
    });
    document.addEventListener('click', function (e) {
      if (searchForm.classList.contains('is-open') && !searchForm.contains(e.target) && !searchToggle.contains(e.target)) {
        searchForm.classList.remove('is-open');
        searchToggle.setAttribute('aria-label', 'Open search');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && searchForm.classList.contains('is-open')) {
        searchForm.classList.remove('is-open');
        searchToggle.setAttribute('aria-label', 'Open search');
        searchToggle.focus();
      }
    });
  }

  // Header search form submit: prevent empty submit, allow normal navigation to search.html?q=...
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      var input = document.getElementById('searchInput');
      if (input && !input.value.trim()) {
        e.preventDefault();
        if (searchForm.classList.contains('is-open') && input) input.focus();
        return;
      }
    });
  }

  // Theme toggle: dark / light
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var moon = document.querySelector('.theme-icon-moon');
    var sun = document.querySelector('.theme-icon-sun');
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
      if (moon) moon.setAttribute('hidden', '');
      if (sun) sun.removeAttribute('hidden');
    } else {
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      if (sun) sun.setAttribute('hidden', '');
      if (moon) moon.removeAttribute('hidden');
    }
    themeToggle.addEventListener('click', function () {
      var root = document.documentElement;
      var isDark = root.getAttribute('data-theme') === 'dark';
      var moon = document.querySelector('.theme-icon-moon');
      var sun = document.querySelector('.theme-icon-sun');
      if (isDark) {
        root.removeAttribute('data-theme');
        try { localStorage.setItem('pta_theme', 'light'); } catch (e) {}
        if (moon) { moon.removeAttribute('hidden'); }
        if (sun) { sun.setAttribute('hidden', ''); }
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      } else {
        root.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('pta_theme', 'dark'); } catch (e) {}
        if (moon) { moon.setAttribute('hidden', ''); }
        if (sun) { sun.removeAttribute('hidden'); }
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
      }
    });
  }

  // Scroll-triggered animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  animateElements.forEach(function (el) {
    observer.observe(el);
  });

  // Observe contact form wrapper (contact page) and testimonials wrap so they animate in
  var contactFormWrap = document.querySelector('.contact-form-wrap');
  if (contactFormWrap) observer.observe(contactFormWrap);
  var testimonialsWrap = document.querySelector('.testimonials-slider-wrap');
  if (testimonialsWrap) observer.observe(testimonialsWrap);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        document.body.classList.remove('nav-mobile-open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero video – ensure autoplay works (some browsers require play() after load)
  (function () {
    var video = document.getElementById('heroVideo');
    if (!video) return;
    var wrap = video.closest('.hero-video-wrap');
    var fallback = document.querySelector('.hero-bg-fallback');
    function showFallback() {
      if (wrap) wrap.style.display = 'none';
    }
    function tryPlay() {
      var p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(function () { }).catch(showFallback);
      }
    }
    if (video.readyState >= 3) tryPlay();
    else video.addEventListener('canplay', tryPlay, { once: true });
    video.addEventListener('error', showFallback, { once: true });
  })();

  // Auth: show Sign In vs My Account in header
  try {
    if (localStorage.getItem('pta_signed_in') === 'true') {
      var s = document.getElementById('headerSignIn');
      var a = document.getElementById('headerAccount');
      if (s) s.style.display = 'none';
      if (a) { a.style.display = 'inline-flex'; a.href = 'account.html'; }
    }
  } catch (_) {}

  // Testimonials slider
  (function () {
    var track = document.getElementById('testimonialsTrack');
    var prevBtn = document.getElementById('testimonialPrev');
    var nextBtn = document.getElementById('testimonialNext');
    var dotsEl = document.getElementById('testimonialsDots');
    if (!track || !track.parentElement) return;

    var slides = track.querySelectorAll('.testimonial-slide');
    var total = slides.length;
    if (total === 0) return;

    var viewport = track.parentElement;
    var viewportWidth = 0;
    function getViewportWidth() {
      return viewport ? viewport.offsetWidth : 0;
    }

    var current = 0;
    var autoplayTimer = null;
    var AUTOPLAY_MS = 6000;

    function goTo(index) {
      current = (index + total) % total;
      viewportWidth = getViewportWidth();
      track.style.transform = 'translateX(-' + (current * viewportWidth) + 'px)';
      updateDots();
    }

    function updateDots() {
      if (!dotsEl) return;
      var dots = dotsEl.querySelectorAll('.testimonials-dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
        dot.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
    }

    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
        (function (idx) {
          btn.addEventListener('click', function () {
            goTo(idx);
            resetAutoplay();
          });
        })(i);
        dotsEl.appendChild(btn);
      }
    }

    function resetAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(function () {
        goTo(current + 1);
      }, AUTOPLAY_MS);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAutoplay(); });

    buildDots();
    goTo(0);

    window.addEventListener('resize', function () {
      viewportWidth = getViewportWidth();
      track.style.transform = 'translateX(-' + (current * viewportWidth) + 'px)';
    });

    resetAutoplay();
  })();
})();
