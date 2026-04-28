(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');

  // ---- Mobile nav ----
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
    '.hero-title, .hero-sub, .stat-card, .manifesto-title, .lead, .bio-list li, .program-row, .media-card, .partner-card, .quote-line, .contact-row, .section-title'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const idx = Array.from(entry.target.parentElement?.children || []).indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.max(0, idx) * 40}ms`;
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

  // ---- Coupon copy ----
  document.querySelectorAll('.coupon code').forEach((code) => {
    code.style.cursor = 'pointer';
    code.title = '클릭하여 코드 복사';
    code.addEventListener('click', async () => {
      const text = code.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        const original = code.textContent;
        code.textContent = 'COPIED';
        setTimeout(() => { code.textContent = original; }, 1200);
      } catch (e) {}
    });
  });

  // ---- Slot counter (live ticker) ----
  const tag = document.querySelector('.meta-tag');
  if (tag) {
    let n = 24;
    setInterval(() => {
      n = Math.max(18, Math.min(34, n + (Math.random() > 0.5 ? 1 : -1)));
      tag.innerHTML = `<span class="dot"></span> NOW TRAINING — ${n} / 47 SLOTS LIVE`;
    }, 4200);
  }
})();
