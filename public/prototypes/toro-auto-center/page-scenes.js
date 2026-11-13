export function setupScenes(onChange) {
  const root = document.querySelector('.page');
  const main = document.querySelector('main');
  const header = root.querySelector('.site-header');
  const scenes = [...main.querySelectorAll(':scope > [data-scene]')];
  const navigation = document.querySelector('.scene-navigation');
  const [back, forward] = navigation.querySelectorAll('button');
  const status = navigation.querySelector('[role="status"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1;
  let wheelAt = 0;
  let wheelTravel = 0;
  let wheelLocked = false;
  let touch;

  function show(index, { focus = false, address = false } = {}) {
    const current = scenes[index];
    if (!current || index === active) return;
    const previous = scenes[active];
    const moveFocus = focus || previous?.contains(document.activeElement);
    const afterChange = onChange({ current, previous, motion: !reduced.matches });
    active = index;
    for (const section of scenes) section.hidden = section !== current;
    current.scrollTop = 0;
    status.textContent = current.dataset.scene;
    back.disabled = index === 0;
    forward.disabled = index === scenes.length - 1;
    root.dataset.scene = current.id;
    header.classList.toggle('is-floating', index > 0);
    if (address) history.pushState(null, '', '#' + current.id);
    if (moveFocus) current.focus({ preventScroll: true });
    afterChange();
  }

  function hashIndex() {
    return Math.max(0, scenes.findIndex(section => '#' + section.id === location.hash));
  }
  function canScroll(direction) {
    const { scrollTop, scrollHeight, clientHeight } = scenes[active];
    return direction > 0 ? scrollTop + clientHeight < scrollHeight - 2 : scrollTop > 2;
  }
  function advance(direction, focus = false) {
    show(active + direction, { focus, address: true });
  }

  navigation.addEventListener('click', event => {
    const button = event.target.closest('[data-scene-step]');
    if (button) advance(Number(button.dataset.sceneStep), true);
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.hash === '#conteudo') {
      event.preventDefault();
      scenes[active].focus({ preventScroll: true });
      return;
    }
    const index = scenes.findIndex(section => '#' + section.id === link.hash);
    if (index < 0) return;
    event.preventDefault();
    if (index === active) scenes[index].focus({ preventScroll: true });
    else show(index, { focus: true, address: true });
  });
  window.addEventListener('hashchange', () => {
    if (location.hash !== '#conteudo') show(hashIndex(), { focus: true });
  });
  document.addEventListener('wheel', event => {
    if (event.ctrlKey || document.querySelector('dialog[open]') || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const now = performance.now();
    if (now - wheelAt > 220) {
      wheelLocked = false;
      wheelTravel = 0;
    }
    wheelAt = now;
    if (wheelLocked) {
      event.preventDefault();
      return;
    }
    const direction = Math.sign(event.deltaY);
    if (!direction || canScroll(direction)) {
      wheelTravel = 0;
      return;
    }
    event.preventDefault();
    wheelTravel += event.deltaY * (event.deltaMode ? 20 : 1);
    if (Math.abs(wheelTravel) < 42) return;
    wheelLocked = true;
    advance(direction);
  }, { passive: false });
  main.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) {
      touch = undefined;
      return;
    }
    const { clientX, clientY } = event.touches[0];
    touch = { clientX, clientY, up: canScroll(-1), down: canScroll(1) };
  }, { passive: true });
  main.addEventListener('touchend', event => {
    if (!touch) return;
    const { clientX, clientY } = event.changedTouches[0];
    const delta = touch.clientY - clientY;
    if (Math.abs(delta) > Math.max(65, Math.abs(touch.clientX - clientX)) && !(delta > 0 ? touch.down : touch.up)) {
      advance(Math.sign(delta));
    }
    touch = undefined;
  }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey
        || event.target.closest('button, a, input, select, textarea, iframe, [contenteditable], dialog')) return;
    const direction = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[event.key];
    if (!direction || canScroll(direction)) return;
    event.preventDefault();
    advance(direction, true);
  });

  root.classList.add('has-scenes');
  document.documentElement.classList.add('has-scenes');
  navigation.hidden = false;
  show(hashIndex());
}
