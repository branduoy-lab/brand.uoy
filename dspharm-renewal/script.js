// ============================================
// DSPHARM Renewal — main page interactions
// ============================================

(() => {
  // ----- Mobile nav toggle -----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open');
    });
  }

  // ----- Header subtle elevate on scroll -----
  const header = document.getElementById('header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Reveal on scroll -----
  const targets = document.querySelectorAll(
    '.hero-copy, .hero-visual, .value, .biz-card, .about-copy, .about-stats, .trust-card, .news-list li, .contact-copy, .contact-card'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    targets.forEach((el) => el.classList.add('reveal-in'));
  }

  // ----- Stat counter -----
  const stats = document.querySelectorAll('.stat-num');
  const animateNumber = (el) => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffixHTML = el.innerHTML.replace(/^\d+/, '');
    const dur = 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(target * eased);
      el.innerHTML = String(val).padStart(String(target).length, '0') + suffixHTML;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && stats.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateNumber(e.target);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach((el) => io2.observe(el));
  }
})();
