(() => {
  const header = document.getElementById('siteHeader');
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  const hero = document.querySelector('.hero');

  // ---- Header scroll state ----
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);

    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      header.classList.toggle('hero-mode', heroBottom > 80);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Mobile nav toggle ----
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Reveal on scroll ----
  const targets = document.querySelectorAll(
    '.section-title, .lead, .bio-list, .lesson-card, .yt-card, .partner-card, .biz-list li, .biz-card, .contact-card, .section-desc'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Coupon copy on click ----
  document.querySelectorAll('.coupon-code').forEach((code) => {
    code.style.cursor = 'pointer';
    code.title = '클릭하여 코드 복사';
    code.addEventListener('click', async () => {
      const text = code.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const original = code.textContent;
        code.textContent = 'COPIED!';
        setTimeout(() => { code.textContent = original; }, 1200);
      } catch (e) {
        // silently ignore — clipboard may be unavailable
      }
    });
  });
})();
