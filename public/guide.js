const guide = document.getElementById('tour-guide');
const sections = [...document.querySelectorAll('[data-tour-section][data-guide]')];

if (guide && sections.length) {
  const person = guide.matches('.brick-person') ? guide : guide.querySelector('.brick-person');
  const caption = document.getElementById('guide-caption');
  const next = document.getElementById('guide-next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = null;
  let arrival = null;
  let paused = document.documentElement.dataset.motion === 'paused';
  const visible = new Set();
  const canMove = () => !paused && !reducedMotion.matches && !document.hidden;
  const pose = () => active?.dataset.guidePose || 'idle';

  function settle() {
    arrival?.cancel();
    arrival = null;
    if (person) {
      person.dataset.pose = pose();
      person.classList.toggle('is-paused', !canMove());
    }
  }

  function enter(section, move = true) {
    if (section === active) return;
    active = section;
    if (caption) caption.textContent = section.dataset.guide;
    if (next) {
      next.hidden = sections.indexOf(section) === sections.length - 1;
    }
    settle();
    if (!person || !move || !canMove()) return;
    person.dataset.pose = 'walk';
    const start = sections.indexOf(section) % 2 ? 84 : -84;
    const animation = person.animate([
      { transform: `translate(${start}px, 0)` },
      { transform: `translate(${start * .75}px, -3px)` },
      { transform: `translate(${start * .5}px, 0)` },
      { transform: `translate(${start * .25}px, -3px)` },
      { transform: 'translate(0, 0)' },
    ], { duration: 1100, easing: 'linear' });
    arrival = animation;
    animation.finished.then(() => {
      if (arrival !== animation) return;
      arrival = null;
      person.dataset.pose = pose();
    }).catch(() => {});
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    const targetLine = window.innerHeight * .38;
    const nearest = [...visible].sort((a, b) => {
      const distance = (section) => {
        const bounds = section.getBoundingClientRect();
        return Math.abs((bounds.top + Math.min(bounds.height, window.innerHeight) * .35) - targetLine);
      };
      return distance(a) - distance(b);
    })[0];
    if (nearest) enter(nearest);
  }, { rootMargin: '-8% 0px -24% 0px', threshold: [0, .15, .4, .7] });

  for (const section of sections) observer.observe(section);
  enter(sections[0], false);

  next?.addEventListener('click', () => {
    const section = sections[sections.indexOf(active) + 1];
    if (!section) return;
    section.scrollIntoView({ behavior: canMove() ? 'smooth' : 'instant', block: 'start' });
    enter(section);
  });
  document.addEventListener('motionchange', (event) => {
    paused = Boolean(event.detail?.paused);
    settle();
  });
  reducedMotion.addEventListener('change', settle);
  document.addEventListener('visibilitychange', settle);
  window.addEventListener('pagehide', () => { observer.disconnect(); settle(); });
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    for (const section of sections) observer.observe(section);
    settle();
  });
}
