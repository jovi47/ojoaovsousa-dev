const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

toggle.hidden = false;
toggle.addEventListener('click', () => {
  menu.showModal();
  toggle.setAttribute('aria-expanded', 'true');
});
menu.addEventListener('close', () => toggle.setAttribute('aria-expanded', 'false'));
menu.addEventListener('click', event => {
  if (event.target === menu || event.target.closest('a')) menu.close();
});
matchMedia('(min-width: 1024px)').addEventListener('change', event => {
  if (event.matches && menu.open) menu.close();
});

const viewer = document.querySelector('.car-viewer');
const stage = viewer.querySelector('.car-stage');
const photo = stage.querySelector('img');
const picker = viewer.querySelector('.vehicle-picker');
const controls = viewer.querySelector('.car-controls');
const title = viewer.querySelector('.car-detail-title');
const description = viewer.querySelector('.car-description');
const display = viewer.querySelector('.car-display');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const photos = {
  coupe: ['assets/coupe.webp', 'Mercedes-AMG GT branco em uma plataforma'],
  motorcycle: ['assets/moto.webp', 'Moto urbana grafite em vista de três quartos']
};

let selected, vehicle = 'coupe', scene;
function showService(button) {
  selected?.setAttribute('aria-pressed', 'false');
  selected = button;
  selected?.setAttribute('aria-pressed', 'true');
  photo.style.transformOrigin = button?.dataset.point || '';
  photo.classList.toggle('is-focused', Boolean(button));
  title.textContent = button?.textContent || 'Visão geral';
  description.textContent = button?.dataset.info || 'Selecione uma peça ou um serviço para ver como funciona.';
  scene?.showService(button?.dataset.service);
}

async function loadVehicle() {
  try {
    await scene?.showVehicle(vehicle);
  } catch {
    // The still image remains available if the 3D model fails to load.
  }
}

picker.addEventListener('click', event => {
  const button = event.target.closest('[data-vehicle]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;
  vehicle = button.dataset.vehicle;
  for (const tab of picker.querySelectorAll('button')) tab.setAttribute('aria-pressed', String(tab === button));
  for (const group of controls.querySelectorAll('[data-for]')) group.hidden = group.dataset.for !== vehicle;
  [photo.src, photo.alt] = photos[vehicle];
  showService();
  loadVehicle();
});
controls.addEventListener('click', event => {
  const button = event.target.closest('[data-service]');
  if (!button) return;
  const detail = selected === button ? undefined : button;
  showService(detail);
  if (detail && !matchMedia('(min-width: 1024px) and (min-height: 750px)').matches) {
    display.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
});

document.querySelector('#outros-servicos').addEventListener('click', event => {
  const link = event.target.closest('[data-show-part]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (vehicle !== 'coupe') picker.querySelector('[data-vehicle="coupe"]').click();
  showService(controls.querySelector(`[data-service="${link.dataset.showPart}"]`));
});

picker.hidden = false;
controls.hidden = false;
if ('IntersectionObserver' in window && 'ResizeObserver' in window) {
  const lazy = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      lazy.unobserve(element);
      import('./vehicle-stage.js').then(({ createVehicleStage }) => {
        const overview = element === stage;
        const renderer = createVehicleStage(element, { xray: overview });
        if (!overview) return renderer.showVehicle('coupe');
        scene = renderer;
        const loading = loadVehicle();
        scene.showService(selected?.dataset.service);
        return loading;
      }).catch(() => {
        // Browsers without WebGL use the image view.
      });
    }
  }, { rootMargin: '180px' });
  lazy.observe(document.querySelector('.hero-stage .car-stage'));
  lazy.observe(stage);
}
