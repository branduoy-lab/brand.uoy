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
  '.section-title, .section-sub, .lead, .kpi, .director-card, ' +
  '.media-card, .program-card, .gallery-item, .news-item, ' +
  '.visit-info, .visit-form'
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
  { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
);
revealTargets.forEach((el) => io.observe(el));

// 문의 폼 간단한 피드백 (백엔드 연결 전 UX)
document.querySelector('.visit-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = '보내는 중…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '문의가 전달되었습니다. 감사합니다.';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 2400);
  }, 700);
});
