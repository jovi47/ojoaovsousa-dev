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
