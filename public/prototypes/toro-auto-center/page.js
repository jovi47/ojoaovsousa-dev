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
const heroStage = document.querySelector('.hero-stage .car-stage');
const heroPoster = heroStage.querySelector('img');
const story = document.querySelector('.vehicle-story');
const frame = story.querySelector('.vehicle-story-frame');
const introCopy = story.querySelector('.hero-copy');
const cue = story.querySelector('.hero-scroll-cue');
const explorer = document.querySelector('#servicos');
const picker = viewer.querySelector('.vehicle-picker');
const controls = viewer.querySelector('.car-controls');
const title = viewer.querySelector('.car-detail-title');
const description = viewer.querySelector('.car-description');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const photos = {
  coupe: ['assets/coupe.webp', 'Mercedes-AMG GT branco em uma plataforma'],
  motorcycle: ['assets/moto.webp', 'Moto naked grafite em vista de três quartos']
};

let selected, vehicle = 'coupe', scene;
function showService(button) {
  selected?.setAttribute('aria-pressed', 'false');
  selected = button;
  selected?.setAttribute('aria-pressed', 'true');
  heroPoster.style.transformOrigin = button?.dataset.point || '';
  heroPoster.classList.toggle('is-focused', Boolean(button));
  heroStage.classList.toggle('has-part', Boolean(button));
  title.textContent = button?.textContent || 'Visão geral';
  description.textContent = button?.dataset.info || 'Selecione carro ou moto. Depois, escolha uma peça ou um serviço para ver como funciona.';
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
  [heroPoster.src, heroPoster.alt] = photos[vehicle];
  showService();
  loadVehicle();
});
controls.addEventListener('click', event => {
  const button = event.target.closest('[data-service]');
  if (!button) return;
  const detail = selected === button ? undefined : button;
  showService(detail);
});

picker.hidden = false;
controls.hidden = false;
cue.hidden = false;
story.classList.add('is-pinned');
const step = (value, start, end) => Math.min(1, Math.max(0, (value - start) / (end - start)));
const startY = () => story.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(frame).top);
const distance = () => parseFloat(getComputedStyle(story).minHeight) - frame.offsetHeight;
let pending = 0, progress = 0;
function updateStory() {
  pending = 0;
  story.style.setProperty('--scene-height', frame.offsetHeight + 'px');
  progress = step(scrollY - startY(), 0, Math.max(1, distance() - 1));
  const reduced = reducedMotion.matches;
  const intro = reduced ? Number(progress < .5) : 1 - step(progress,.04,.36);
  const explore = reduced ? Number(progress >= .5) : step(progress,.28,.70);
  const options = reduced ? explore : step(progress,.48,.90);
  introCopy.inert = intro === 0;
  cue.hidden = progress > .06;
  explorer.inert = explore === 0;
  controls.inert = options === 0;
  if (explore === 0 && selected) showService();
  story.style.setProperty('--intro-opacity',intro);
  story.style.setProperty('--intro-position', reduced ? intro : 1 - progress);
  story.style.setProperty('--explore-opacity',explore);
  story.style.setProperty('--explore-offset', (1 - explore) * 18 + 'px');
  story.style.setProperty('--options-opacity',options);
  story.style.setProperty('--options-offset', (1 - options) * 18 + 'px');
  scene?.setXray(reduced ? explore : step(progress,.10,.85));
}
function scheduleStory() {
  if (!pending) pending = requestAnimationFrame(updateStory);
}
function goToExplorer() {
  window.scrollTo({ top: Math.ceil(startY() + distance()), behavior: 'instant' });
  updateStory();
}
window.addEventListener('scroll',scheduleStory,{passive:true});
window.addEventListener('resize',scheduleStory,{passive:true});
if ('ResizeObserver' in window) new ResizeObserver(scheduleStory).observe(frame);
reducedMotion.addEventListener('change',scheduleStory);
window.addEventListener('hashchange',() => {
  if (location.hash === '#servicos') goToExplorer();
});
document.addEventListener('click',event => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    || !event.target.closest('a[href="#servicos"]')) return;
  event.preventDefault();
  if (location.hash !== '#servicos') history.pushState(null,'','#servicos');
  goToExplorer();
  explorer.focus({ preventScroll: true });
});
explorer.addEventListener('click', event => {
  if (progress < 1 && event.target.closest('.car-controls button, .vehicle-picker button')) goToExplorer();
});
explorer.addEventListener('focusin', event => {
  if (progress < 1 && event.target.matches('button:focus-visible')) goToExplorer();
});
if (location.hash === '#servicos') goToExplorer();
else updateStory();

if ('IntersectionObserver' in window && 'ResizeObserver' in window) {
  const lazy = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    import('./vehicle-stage.js').then(({ createVehicleStage }) => {
      scene = createVehicleStage(heroStage);
      const loading = loadVehicle();
      scene.showService(selected?.dataset.service);
      updateStory();
      return loading;
    }).catch(() => {
      // Browsers without WebGL use the image view.
    });
  }, { rootMargin: '180px' });
  lazy.observe(heroStage);
}

const batteryCatalog = document.querySelector('.battery-catalog');
const batteryOptions = batteryCatalog.querySelector('.battery-options');
const batteryButtons = [...batteryOptions.querySelectorAll('button')];
const batterySheets = [...batteryCatalog.querySelectorAll('.battery-specs')];
const batteryStatus = batteryCatalog.querySelector('[role="status"]');

function showBattery(button) {
  for (const option of batteryButtons) option.setAttribute('aria-pressed', String(option === button));
  for (const sheet of batterySheets) sheet.hidden = sheet.id !== button.getAttribute('aria-controls');
}
showBattery(batteryButtons[0]);
batteryOptions.hidden = false;
batteryOptions.addEventListener('click', event => {
  const button = event.target.closest('[data-battery]');
  if (!button || button.getAttribute('aria-pressed') === 'true') return;
  showBattery(button);
  batteryStatus.textContent = 'Bateria de ' + button.textContent + ' selecionada';
});

for (const applications of batteryCatalog.querySelectorAll('.battery-applications')) {
  const picker = document.createElement('div');
  picker.className = 'maker-picker';
  picker.setAttribute('role', 'group');
  picker.setAttribute('aria-label', 'Montadoras');

  const entries = Array.from(applications.children, (entry, index) => {
    const name = entry.querySelector('dt');
    const label = name.textContent.trim();
    const button = document.createElement('button');
    button.type = 'button';
    button.title = label;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-expanded', 'false');
    entry.id = applications.closest('.battery-specs').id + '-maker-' + (index + 1);
    button.setAttribute('aria-controls', entry.id);
    button.append(name.querySelector('svg').cloneNode(true));
    picker.append(button);
    entry.hidden = true;
    return { button, entry };
  });

  picker.addEventListener('click', event => {
    const selected = event.target.closest('button');
    if (!selected) return;
    const expand = selected.getAttribute('aria-expanded') === 'false';
    for (const { button, entry } of entries) {
      const active = expand && button === selected;
      button.setAttribute('aria-expanded', String(active));
      entry.hidden = !active;
    }
  });

  applications.dataset.enhanced = '';
  applications.before(picker);
}

const timeline = document.querySelector('.home-timeline');
const stepButtons = [...timeline.querySelectorAll('.home-steps button')];
const stepWindow = timeline.querySelector('.home-step-window');
const stepDetails = [...stepWindow.children];
const timelineProgress = timeline.querySelector('.timeline-progress');
let drive, run = 0, wasVisible = false;
function showStep(index) {
  stepButtons.forEach((button, step) => button.setAttribute('aria-pressed', String(step === index)));
  stepDetails.forEach((detail, step) => detail.setAttribute('aria-hidden', String(step !== index)));
}

stepWindow.dataset.enhanced = '';
showStep(0);
stepButtons.forEach((button, index) => {
  button.disabled = false;
  button.addEventListener('click', () => {
    stopDrive();
    stepWindow.setAttribute('aria-live', 'polite');
    timelineProgress.style.width = (index / (stepButtons.length - 1) * 100) + '%';
    showStep(index);
  });
});

function stopDrive() {
  run++;
  drive?.cancel();
  drive = undefined;
  timeline.classList.remove('is-driving');
}

async function playTimeline() {
  const currentRun = ++run;
  stepWindow.removeAttribute('aria-live');
  timelineProgress.style.width = '0%';
  showStep(0);
  timeline.classList.add('is-driving');
  try {
    for (let index = 1; index < stepButtons.length; index++) {
      const from = (index - 1) / (stepButtons.length - 1) * 100 + '%';
      const to = index / (stepButtons.length - 1) * 100 + '%';
      drive = timelineProgress.animate([{ width: from }, { width: to }], { duration: 1580, easing: 'linear' });
      await drive.finished;
      timelineProgress.style.width = to;
      showStep(index);
    }
  } catch (error) {
    if (error.name !== 'AbortError') throw error;
  } finally {
    if (currentRun === run) stopDrive();
  }
}

if ('IntersectionObserver' in window && timelineProgress.animate) {
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      wasVisible = false;
      stopDrive();
    } else if (!wasVisible && entry.intersectionRatio >= .25) {
      wasVisible = true;
      if (!reducedMotion.matches) playTimeline();
    }
  }, { threshold: [0, .25] }).observe(timeline);

  reducedMotion.addEventListener('change', event => {
    if (event.matches) stopDrive();
  });
}

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio >= .08) entry.target.classList.add('is-revealed');
      else if (!entry.isIntersecting) entry.target.classList.remove('is-revealed');
    }
  }, { threshold: [0, .08] });
  document.querySelectorAll('[data-scroll-reveal]').forEach(element => reveal.observe(element));
}
