const page = document.querySelector('.page');
const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

toggle.hidden = false;
toggle.addEventListener('click', () => {
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
});
menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
menu.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  menu.close();
  if (link.hash) document.getElementById(link.hash.slice(1))?.focus({ preventScroll: true });
});
matchMedia('(min-width: 768px)').addEventListener('change', event => {
  if (event.matches && menu.open) menu.close();
});

function updateHeader() {
  header.classList.toggle('is-floating', Math.max(window.scrollY, page.scrollTop) > 48);
}
window.addEventListener('scroll', updateHeader, { passive: true });
page.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window) {
  const entries = new IntersectionObserver(changes => {
    for (const change of changes) {
      if (!change.isIntersecting) continue;
      change.target.classList.add('is-entering');
      entries.unobserve(change.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach(element => entries.observe(element));
}
