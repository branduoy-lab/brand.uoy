// 헤더: 스크롤 시 상태 변경
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 모바일 네비 토글
const toggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  });
});

// 섹션 fade-in
const revealTargets = document.querySelectorAll(
  '.section-title, .section-sub, .problem-card, .tech-item, .spec, ' +
  '.adv-card, .use-card, .about-copy, .about-pillars li, ' +
  '.contact-info, .contact-form, .hero-viz'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
);
revealTargets.forEach((el) => io.observe(el));

// Hero waveform — noisy 파형을 계속 재생성해 "지글거리는" 느낌 연출
const noisy = document.querySelector('.wave-noisy svg path:last-child');
if (noisy) {
  const N = 20;
  const W = 600;
  const midY = 40;
  const amp = 22;
  const step = W / N;
  let t = 0;
  const draw = () => {
    t += 0.12;
    let d = `M0 ${midY}`;
    for (let i = 1; i <= N; i++) {
      const x = i * step;
      const y = midY + (Math.sin(i * 1.7 + t) * amp * Math.random() * 0.9);
      d += ` L${x.toFixed(0)} ${y.toFixed(1)}`;
    }
    noisy.setAttribute('d', d);
    raf = requestAnimationFrame(draw);
  };
  let raf = requestAnimationFrame(draw);

  // reduce motion 존중
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    cancelAnimationFrame(raf);
  }
}

// 문의 폼 간단한 피드백
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Sent. We will get back to you.';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2400);
  }, 700);
});
