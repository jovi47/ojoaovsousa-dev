import { setupScenes } from './page-scenes.js';

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
  if (!link && event.target !== menu) return;
  menu.close();
});
matchMedia('(min-width: 891px)').addEventListener('change', event => {
  if (event.matches && menu.open) menu.close();
});

const viewer = document.querySelector('.car-viewer');
const stage = viewer.querySelector('.car-stage');
const photo = stage.querySelector('img');
const caption = stage.querySelector('figcaption');
const picker = viewer.querySelector('.vehicle-picker');
const modes = viewer.querySelector('.inspection-modes');
const controls = viewer.querySelector('.car-controls');
const title = viewer.querySelector('.car-detail-title');
const description = viewer.querySelector('.car-description');
const reset = viewer.querySelector('.reset-view');
const navigation = viewer.querySelector('.part-navigation');
const [previous, next] = navigation.querySelectorAll('button');
const chapterButtons = [...controls.querySelectorAll('[data-service]')];
const display = viewer.querySelector('.car-display');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const photos = {
  coupe: ['assets/coupe.webp', 'Mercedes-AMG GT branco ilustrativo em vista de três quartos'],
  motorcycle: ['assets/moto.webp', 'Moto urbana grafite em vista de três quartos']
};

let selected, vehicle = 'coupe', scene, mode = '';
function showMode(value = '') {
  mode = value;
  for (const button of modes.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  scene?.showMode(mode);
}
function focusVehicle() {
  scene?.showService(selected?.dataset.service);
  caption.textContent = stage.hasAttribute('data-ready')
    ? selected ? 'Peça 3D ilustrativa' : 'Modelo 3D ilustrativo'
    : 'Imagem ilustrativa';
}
async function loadVehicle() {
  if (!scene) return;
  modes.hidden = true;
  try {
    await scene.showVehicle(vehicle);
  } catch {
    // The image and service controls remain usable when a model fails to load.
  }
  focusVehicle();
  modes.hidden = vehicle !== 'coupe' || !stage.hasAttribute('data-ready');
}
function showService(button) {
  selected?.setAttribute('aria-pressed', 'false');
  selected = button;
  selected?.setAttribute('aria-pressed', 'true');
  photo.style.transformOrigin = button?.dataset.point || '';
  photo.classList.toggle('is-focused', Boolean(button));
  title.textContent = button?.textContent || 'Visão geral';
  description.textContent = button?.dataset.info || 'Explore as peças do veículo e os serviços disponíveis na oficina.';
  reset.hidden = !button;
  const chapters = chapterButtons.filter(chapter => !chapter.closest('[data-for]').hidden);
  const index = chapters.indexOf(button);
  previous.disabled = index === -1;
  next.disabled = index === chapters.length - 1;
  navigation.hidden = chapters.length < 2;
  focusVehicle();
}
picker.addEventListener('click', event => {
  const button = event.target.closest('[data-vehicle]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;
  vehicle = button.dataset.vehicle;
  showMode();
  for (const tab of picker.querySelectorAll('button')) tab.setAttribute('aria-pressed', String(tab === button));
  for (const group of controls.querySelectorAll('[data-for]')) group.hidden = group.dataset.for !== vehicle;
  [photo.src, photo.alt] = photos[vehicle];
  showService();
  loadVehicle();
});
controls.addEventListener('click', event => {
  const button = event.target.closest('[data-point]');
  if (!button) return;
  showMode();
  showService(button);
  title.focus({ preventScroll: true });
  display.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});
navigation.addEventListener('click', event => {
  const button = event.target.closest('[data-step]');
  if (!button) return;
  const chapters = chapterButtons.filter(chapter => !chapter.closest('[data-for]').hidden);
  const index = chapters.indexOf(selected);
  showMode();
  showService(chapters[index + Number(button.dataset.step)]);
  if (button.disabled) (button === next ? previous : next).focus({ preventScroll: true });
});
modes.addEventListener('click', event => {
  const button = event.target.closest('[data-mode]');
  if (!button) return;
  showService();
  showMode(mode === button.dataset.mode ? '' : button.dataset.mode);
  if (mode) {
    title.textContent = button.textContent;
    description.textContent = mode === 'xray'
      ? 'A carroceria fica translúcida para mostrar o compartimento do motor.'
      : 'Capô, rodas, motor e bateria se afastam para mostrar como as peças se encaixam.';
    reset.hidden = false;
  }
});
reset.addEventListener('click', () => {
  (selected || modes.querySelector('[aria-pressed="true"]'))?.focus({ preventScroll: true });
  showMode();
  showService();
});
picker.hidden = false;
controls.hidden = false;
showService();

document.querySelector('#outros-servicos').addEventListener('click', event => {
  const link = event.target.closest('[data-show-part]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const car = picker.querySelector('[data-vehicle="coupe"]');
  if (vehicle !== 'coupe') car.click();
  showMode();
  showService(chapterButtons.find(button => button.dataset.service === link.dataset.showPart));
});

const heroStage = document.querySelector('.hero-stage');
let transfer;
setupScenes(({ current, previous, motion }) => {
  const home = current.id === 'inicio';
  const services = current.id === 'servicos';
  const crossing = ['inicio','servicos'].includes(current.id) && ['inicio','servicos'].includes(previous?.id);
  transfer?.cancel();
  const from = crossing && motion && innerWidth >= 768 ? stage.getBoundingClientRect() : null;
  return () => {
    const target = home ? heroStage : display;
    if (home) {
      const car = picker.querySelector('[data-vehicle="coupe"]');
      if (vehicle !== 'coupe') car.click();
      else {
        showMode();
        showService();
      }
    }
    heroStage.hidden = !home;
    if ((home || services) && stage.parentNode !== target) target.prepend(stage);
    if (!from?.width) return;
    const to = stage.getBoundingClientRect();
    transfer = stage.animate([
      { transformOrigin: '0 0', transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})` },
      { transformOrigin: '0 0', transform: 'none' }
    ], { duration: 610, easing: 'cubic-bezier(.22,.61,.36,1)' });
  };
});
if ('IntersectionObserver' in window && 'ResizeObserver' in window) {
  const lazy = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    lazy.disconnect();
    import('./vehicle-stage.js').then(({ createVehicleStage }) => {
      scene = createVehicleStage(stage, stage.querySelector('.rotation-button'));
      return loadVehicle();
    }).catch(() => {
      // Browsers without WebGL use the image view.
    });
  }, { rootMargin: '180px' });
  lazy.observe(stage);
}
