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
const heroStage = document.querySelector('.hero-stage .car-stage');
const heroPoster = heroStage.querySelector('img');
const story = document.querySelector('.vehicle-story');
const frame = story.querySelector('.vehicle-story-frame');
const introCopy = story.querySelector('.hero-copy');
const explorer = document.querySelector('#servicos');
const pinned = matchMedia('(min-width: 1180px) and (min-height: 680px) and (prefers-reduced-motion: no-preference), (min-width: 768px) and (min-height: 820px) and (prefers-reduced-motion: no-preference), (max-width: 767px) and (min-height: 840px) and (prefers-reduced-motion: no-preference)');
const picker = viewer.querySelector('.vehicle-picker');
const controls = viewer.querySelector('.car-controls');
const title = viewer.querySelector('.car-detail-title');
const description = viewer.querySelector('.car-description');
const display = viewer.querySelector('.car-display');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const photos = {
  coupe: ['assets/coupe.webp', 'Mercedes-AMG GT branco em uma plataforma'],
  motorcycle: ['assets/moto.webp', 'Moto naked grafite em vista de três quartos']
};

let selected, vehicle = 'coupe', scene, openingScene;
const activeScene = () => pinned.matches ? openingScene : scene;
function showService(button) {
  selected?.setAttribute('aria-pressed', 'false');
  selected = button;
  selected?.setAttribute('aria-pressed', 'true');
  photo.style.transformOrigin = button?.dataset.point || '';
  photo.classList.toggle('is-focused', Boolean(button));
  title.textContent = button?.textContent || 'Visão geral';
  description.textContent = button?.dataset.info || 'Selecione carro ou moto. Depois, escolha uma peça ou um serviço para ver como funciona.';
  activeScene()?.showService(button?.dataset.service);
}

async function loadVehicle() {
  try {
    await activeScene()?.showVehicle(vehicle);
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
  if (pinned.matches) [heroPoster.src, heroPoster.alt] = photos[vehicle];
  showService();
  loadVehicle();
});
controls.addEventListener('click', event => {
  const button = event.target.closest('[data-service]');
  if (!button) return;
  const detail = selected === button ? undefined : button;
  showService(detail);
  if (detail && !pinned.matches && !matchMedia('(min-width: 768px)').matches) {
    display.scrollIntoView({ block: 'nearest', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
});

picker.hidden = false;
controls.hidden = false;
if ('IntersectionObserver' in window && 'ResizeObserver' in window) {
  const step = (value, start, end) => Math.min(1, Math.max(0, (value - start) / (end - start)));
  const startY = () => story.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(frame).top);
  const distance = () => story.offsetHeight - frame.offsetHeight;
  let pending = 0;
  function updateStory() {
    pending = 0;
    if (!pinned.matches) return;
    const progress = step(scrollY - startY(), 0, Math.max(1,distance()));
    const intro = 1 - step(progress,.04,.36);
    const explore = step(progress,.28,.70);
    const options = step(progress,.48,.90);
    introCopy.inert = intro < .52;
    explorer.inert = options < .75;
    story.style.setProperty('--intro-opacity',intro);
    story.style.setProperty('--intro-position', 1 - progress);
    story.style.setProperty('--explore-opacity',explore);
    story.style.setProperty('--explore-offset', (1 - explore) * 18 + 'px');
    story.style.setProperty('--options-opacity',options);
    story.style.setProperty('--options-offset', (1 - options) * 18 + 'px');
    openingScene?.setXray(step(progress,.10,.85));
  }
  function scheduleStory() {
    if (!pending) pending = requestAnimationFrame(updateStory);
  }
  function goToExplorer() {
    window.scrollTo({ top: startY() + distance(), behavior: 'instant' });
    updateStory();
    explorer.focus({ preventScroll: true });
  }
  function configureStory() {
    story.classList.toggle('is-pinned',pinned.matches);
    if (pinned.matches) {
      [heroPoster.src, heroPoster.alt] = photos[vehicle];
      openingScene?.showVehicle(vehicle).catch(() => {});
      openingScene?.showService(selected?.dataset.service);
      updateStory();
      if (location.hash === '#servicos') goToExplorer();
    } else {
      introCopy.inert = explorer.inert = false;
      [heroPoster.src, heroPoster.alt] = photos.coupe;
      openingScene?.setXray(0);
      openingScene?.showService();
      openingScene?.showVehicle('coupe').catch(() => {});
      scene?.showService(selected?.dataset.service);
      if (!scene) lazy.observe(stage);
    }
  }
  window.addEventListener('scroll',scheduleStory,{passive:true});
  window.addEventListener('resize',scheduleStory,{passive:true});
  window.addEventListener('hashchange',() => {
    if (pinned.matches && location.hash === '#servicos') goToExplorer();
  });
  document.addEventListener('click',event => {
    if (!pinned.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || !event.target.closest('a[href="#servicos"]')) return;
    event.preventDefault();
    if (location.hash !== '#servicos') history.pushState(null,'','#servicos');
    goToExplorer();
  });
  pinned.addEventListener('change',configureStory);
  const lazy = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      lazy.unobserve(element);
      if (element === stage && pinned.matches) continue;
      import('./vehicle-stage.js').then(({ createVehicleStage }) => {
        const overview = element === stage;
        const renderer = createVehicleStage(element, { xray: overview ? 1 : 0 });
        if (overview) scene = renderer;
        else openingScene = renderer;
        if (renderer !== activeScene()) return renderer.showVehicle('coupe');
        const loading = loadVehicle();
        renderer.showService(selected?.dataset.service);
        if (pinned.matches) updateStory();
        return loading;
      }).catch(() => {
        // Browsers without WebGL use the image view.
      });
    }
  }, { rootMargin: '180px' });
  lazy.observe(heroStage);
  configureStory();
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
let drive;
function showStep(index) {
  stepButtons.forEach((button, step) => button.setAttribute('aria-pressed', String(step === index)));
  stepDetails.forEach((detail, step) => detail.setAttribute('aria-hidden', String(step !== index)));
}

stepWindow.dataset.enhanced = '';
showStep(0);
stepButtons.forEach((button, index) => {
  button.disabled = false;
  button.addEventListener('click', () => {
    enterTimeline?.disconnect();
    drive?.cancel();
    stepWindow.setAttribute('aria-live', 'polite');
    timelineProgress.style.width = (index / (stepButtons.length - 1) * 100) + '%';
    showStep(index);
  });
});

const enterTimeline = 'IntersectionObserver' in window && timelineProgress.animate && !reducedMotion.matches
  ? new IntersectionObserver(async ([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
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
      timeline.classList.remove('is-driving');
      drive = undefined;
    }
  }, { threshold: .25 })
  : undefined;

if (enterTimeline) {
  timeline.dataset.animate = '';
  enterTimeline.observe(timeline);
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    enterTimeline.disconnect();
    drive?.cancel();
    timeline.removeAttribute('data-animate');
    timelineProgress.style.removeProperty('width');
  });
}
