const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('.menu-toggle');

if (typeof menu.showModal === 'function') {
  menuToggle.hidden = false;
  document.querySelector('.site-header').classList.add('has-menu');
  menuToggle.addEventListener('click', () => {
    menu.showModal();
    menuToggle.setAttribute('aria-expanded', 'true');
  });

  menu.addEventListener('close', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.focus({ preventScroll: true });
  });

  menu.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => menu.close());
  });
  matchMedia('(min-width: 920px)').addEventListener('change', event => {
    if (event.matches && menu.open) menu.close();
  });
}

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveal = new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.classList.add('revealed');
      reveal.unobserve(target);
    }
  }, { threshold: 0.08 });

  document.querySelectorAll('[data-reveal]').forEach(element => {
    element.classList.add('will-reveal');
    reveal.observe(element);
  });
}
