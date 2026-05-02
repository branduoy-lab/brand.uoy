(() => {
  // ---- Site Notice (알림창 닫기) ----
  const noticeClose = document.getElementById('noticeClose');
  if (noticeClose) {
    noticeClose.addEventListener('click', () => {
      document.body.classList.add('notice-hidden');
      try { sessionStorage.setItem('branew-notice-dismissed', '1'); } catch (e) {}
    });
    try {
      if (sessionStorage.getItem('branew-notice-dismissed') === '1') {
        document.body.classList.add('notice-hidden');
      }
    } catch (e) {}
  }

  const wrap = document.getElementById('snapWrap');
  const header = document.getElementById('siteHeader');
  const nav = document.querySelector('.nav');
  const toggle = document.getElementById('navToggle');
  const dotItems = Array.from(document.querySelectorAll('#dotNav li'));
  const dotLinks = Array.from(document.querySelectorAll('#dotNav a'));
  const sections = Array.from(document.querySelectorAll('.snap'));
  const counterNow = document.getElementById('ccNow');
  const counterDivider = document.querySelector('.cc-divider');
  const progressInner = document.getElementById('progressInner');
  const isDesktop = () => window.matchMedia('(min-width: 1081px)').matches;

  // ---- Set --i for stagger ----
  document.querySelectorAll('.brand-pillars li').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.premium-strip li').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.arch-features li').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.location-list > li').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.community-grid .comm-card').forEach((el, i) => el.style.setProperty('--i', i));
  document.querySelectorAll('.contact-grid .contact-card').forEach((el, i) => el.style.setProperty('--i', i));

  // ---- Smooth jump for desktop snap container ----
  function jumpTo(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (isDesktop()) {
      wrap.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('[data-jump]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      jumpTo(a.dataset.jump);
      // close mobile nav if open
      if (nav?.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
        document.body.style.overflow = '';
      }
    });
  });

  // ---- Mobile nav toggle ----
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // ---- Section visibility / dot / counter / progress ----
  const totalSections = sections.length;

  function setActive(idx) {
    if (idx < 0 || idx >= totalSections) return;
    sections.forEach((s, i) => s.classList.toggle('is-visible', i === idx));
    dotItems.forEach((li, i) => li.classList.toggle('is-active', i === idx));
    if (counterNow) counterNow.textContent = String(idx + 1).padStart(2, '0');
    const progress = ((idx + 1) / totalSections) * 100;
    if (counterDivider) counterDivider.style.setProperty('--progress', `${progress}%`);
    if (progressInner) progressInner.style.width = `${progress}%`;
    header.classList.toggle('compact', idx > 0);
  }

  // Use IntersectionObserver in both modes — root differs
  function setupObserver() {
    const root = isDesktop() ? wrap : null;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const idx = sections.indexOf(entry.target);
            setActive(idx);
          }
        });
      },
      { root, threshold: [0.4, 0.6, 0.8] }
    );
    sections.forEach((s) => io.observe(s));
    return io;
  }

  let observer = setupObserver();

  // Re-bind observer on resize (root changes between modes)
  let lastDesktop = isDesktop();
  window.addEventListener('resize', () => {
    const nowDesktop = isDesktop();
    if (nowDesktop !== lastDesktop) {
      observer.disconnect();
      observer = setupObserver();
      lastDesktop = nowDesktop;
    }
  });

  // Initial activation: first section visible immediately
  setActive(0);

  // ---- Unit tabs ----
  const tabs = document.querySelectorAll('.unit-tab');
  const panels = document.querySelectorAll('.unit-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.unit;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.dataset.panel === target);
      });
    });
  });

  // ---- Wheel-snap helper for desktop (one wheel = one section)
  // Keeps native scroll-snap fluidity but prevents skipping multiple at once on trackpads
  let wheelLock = false;
  const WHEEL_THRESHOLD = 30;
  wrap.addEventListener('wheel', (e) => {
    if (!isDesktop()) return;
    if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
    if (wheelLock) {
      e.preventDefault();
      return;
    }
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 720);
  }, { passive: false });

  // ---- Keyboard navigation ----
  document.addEventListener('keydown', (e) => {
    if (!isDesktop()) return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    const idx = sections.findIndex((s) => s.classList.contains('is-visible'));
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      jumpTo(sections[Math.min(totalSections - 1, idx + 1)]?.id);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      jumpTo(sections[Math.max(0, idx - 1)]?.id);
    } else if (e.key === 'Home') {
      e.preventDefault();
      jumpTo(sections[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      jumpTo(sections[totalSections - 1].id);
    }
  });
})();
