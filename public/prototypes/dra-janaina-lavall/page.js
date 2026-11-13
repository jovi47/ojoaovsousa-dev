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
  matchMedia('(min-width: 860px)').addEventListener('change', event => {
    if (event.matches && menu.open) menu.close();
  });
}

const contact = document.querySelector('#contact-dialog');
const contactForm = document.querySelector('#contact-form');

if (typeof contact.showModal === 'function') {
  const nameField = contactForm.elements.namedItem('name');
  const topicField = contactForm.elements.namedItem('topic');
  const messageField = contactForm.elements.namedItem('message');
  let contactTrigger;

  document.querySelectorAll('[data-contact]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-controls', 'contact-dialog');
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      contactTrigger = menu.contains(link) ? menuToggle : link;
      topicField.value = link.dataset.contact || topicField.options[0].value;
      contact.showModal();
    });
  });
  contact.addEventListener('close', () => contactTrigger?.focus({ preventScroll: true }));

  nameField.addEventListener('input', () => nameField.setCustomValidity(''));
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = nameField.value.trim();
    if (!name) {
      nameField.setCustomValidity('Informe seu nome.');
      nameField.reportValidity();
      return;
    }

    const text = ['Olá! Meu nome é ' + name + '.', 'Assunto: ' + topicField.value, messageField.value.trim()]
      .filter(Boolean).join('\n');
    const whatsapp = new URL('https://wa.me/5531984521029');
    whatsapp.searchParams.set('text', text);
    window.location.assign(whatsapp);
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

const rail = document.querySelector('.rail-light');
const outlet = document.querySelector('.tooth-outlet');

if (rail && outlet && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const header = document.querySelector('.site-header');
  const main = document.querySelector('.site-main');
  const intro = rail.querySelector('.rail-intro');
  const loop = rail.querySelector('.rail-loop');

  function fitRail() {
    const top = header.getBoundingClientRect().bottom;
    const width = main.getBoundingClientRect().width;
    const bottom = Math.max(0, document.documentElement.clientHeight - top - 16);
    const outletY = outlet.getBoundingClientRect().top + scrollY - top + 1;
    const start = Math.max(1, Math.min(outletY, bottom));
    const right = width - .5;
    const turn = `V .5 H ${right} V ${bottom}`;
    const introLength = start + bottom + width - 2;
    const loopLength = bottom * 2 + width - 2;
    const trail = Math.min(270, Math.max(160, width * .22));

    intro.setAttribute('d', `M .5 ${start} ${turn}`);
    loop.setAttribute('d', `M .5 ${bottom} ${turn}`);
    rail.style.setProperty('--rail-top', `${top - 1}px`);
    rail.style.setProperty('--rail-trail', `${trail}px`);
    rail.style.setProperty('--rail-gap', `${loopLength + trail}px`);
    rail.style.setProperty('--rail-intro-time', `${introLength / 270}s`);
    rail.style.setProperty('--rail-loop-time', `${loopLength / 270}s`);
    rail.style.setProperty('--rail-intro-end', `${trail - introLength}px`);
    rail.style.setProperty('--rail-loop-end', `${trail - loopLength}px`);
    rail.classList.add('is-tracing');
  }

  fitRail();
  document.fonts.ready.then(fitRail);
  window.addEventListener('resize', fitRail);
}
