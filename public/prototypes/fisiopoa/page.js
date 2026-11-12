const header = document.querySelector('.site-header');
const menuButton = header.querySelector('.header-menu');
const mobileMenu = header.querySelector('.mobile-menu');
const mobileMenuLayout = matchMedia('(max-width: 890px)');

menuButton.addEventListener('click', () => {
  mobileMenu.showModal();
  menuButton.setAttribute('aria-expanded', 'true');
});
mobileMenu.addEventListener('close', () => menuButton.setAttribute('aria-expanded', 'false'));
mobileMenu.addEventListener('click', event => {
  if (event.defaultPrevented) return;
  const link = event.target.closest('nav a');
  if (link || event.target === mobileMenu) mobileMenu.close();
  if (link) {
    const section = document.querySelector(link.hash);
    section.setAttribute('tabindex', '-1');
    section.focus({preventScroll:true});
  }
});
mobileMenuLayout.addEventListener('change', event => {
  if (!event.matches && mobileMenu.open) mobileMenu.close();
});

const hero = document.querySelector('[data-scroll-scene="hero"]');
const heroRibbon = hero.querySelector('.hero-ribbon');
const heroContact = hero.querySelector('.hero-copy .button');
const ribbonTrack = heroRibbon.querySelector('.ribbon-track');
ribbonTrack.append(ribbonTrack.firstElementChild.cloneNode(true));
heroRibbon.classList.add('is-looping');
const visit = document.querySelector('.visit');
const deck = document.querySelector('[data-scroll-scene="deck"]');
const sceneStages = [hero, deck].map(scene => ({scene, stage: scene.querySelector('[data-scene-stage]')}));
const deckStage = sceneStages[1].stage;
const deckNav = deck.querySelector('.orb-nav');
const deckTitle = deck.querySelector('#servicos-titulo');
const wordBand = deck.querySelector('.service-words');
const cards = [...deck.querySelectorAll('.service-chapter')];
const dialCards = [...deck.querySelectorAll('[data-dial-card]')];
const links = [...deckNav.querySelectorAll('a')];
const orb = deck.querySelector('.orb-visual');
const serviceWords = [...wordBand.children];
const startCue = hero.querySelector('.more-content-start');
const moreCue = document.querySelector('.more-content-floating');
const mobileCue = matchMedia('(max-width:1100px)');
const cueDismissDistance = innerHeight * .5;
let mobileCueDismissed = scrollY >= cueDismissDistance;
let desktopCueDismissed = false;
let cueAssemblyFinished = false;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const tones = ['pulse', 'balance', 'strength', 'home'];
const steps = cards.length - .68;
const clamp = value => Math.max(0, Math.min(1, value));
let frame = 0;
let active = -1;
let lastPosition = -1;
let lastHero = -1;
let lastDeckArrival = -1;
let deckStop = 0;
let settleFrame = 0;
let heroTravel = 0;
let deckHeightWithWordLead = 0;
let lastWordExit = -1;

function sceneProgress(scene, stage, travel = scene.offsetHeight - stage.offsetHeight) {
  return clamp((header.offsetHeight - scene.getBoundingClientRect().top) / Math.max(1, travel));
}

function deckArrival(top) {
  const start = innerHeight * .82;
  const arrival = clamp((start - top) / Math.max(1, start - header.offsetHeight));
  return arrival * (2 - arrival);
}

function renderDeck(progress) {
  const position = progress * steps;
  if (position === lastPosition) return;
  lastPosition = position;
  const pose = Math.min(cards.length - 1, position);
  const next = Math.round(pose);

  if (active !== next) {
    cards.forEach((card, i) => { card.inert = i !== next; });
    if (active >= 0) links[active].removeAttribute('aria-current');
    links[next].setAttribute('aria-current', 'step');
    orb.dataset.tone = tones[next];
    active = next;
  }

  dialCards.forEach((card, i) => {
    const distance = Math.max(-1.5, Math.min(1.5, i - pose));
    const gap = Math.abs(distance);
    const angle = distance * Math.PI / 5.8;
    const near = clamp(1 - gap);
    card.style.setProperty('--card-visibility', gap < 1.38 ? 'visible' : 'hidden');
    card.style.setProperty('--card-near', (near * near * (3 - 2 * near)).toFixed(3));
    card.style.setProperty('--card-ghost', (1 - gap / 1.5).toFixed(3));
    card.style.setProperty('--card-x', ((Math.cos(angle) - 1) * 62).toFixed(1) + '%');
    card.style.setProperty('--card-y', (Math.sin(angle) * 173).toFixed(1) + '%');
    card.style.setProperty('--card-angle', (distance * 9).toFixed(2) + 'deg');
    card.style.setProperty('--card-scale', (1 - gap * .13).toFixed(3));
    card.style.setProperty('--card-z', i === next ? '2' : '1');
    serviceWords[i].style.setProperty('--word-shift', distance.toFixed(3));
    serviceWords[i].style.setProperty('--word-opacity', Math.max(0, 1 - gap * 1.12).toFixed(3));
  });

  orb.style.setProperty('--trail', (.08 + pose / (cards.length - 1) * .87).toFixed(3));
  orb.style.setProperty('--orb-turn', (pose * 90).toFixed(2) + 'deg');
}

function renderScroll() {
  frame = 0;
  header.classList.toggle('is-floating', scrollY > 48);
  const underHeader = header.offsetHeight + 10;
  const bounds = visit.getBoundingClientRect();
  const surface = bounds.top <= underHeader && bounds.bottom > underHeader ? 'visit' : 'paper';
  if (header.dataset.surface !== surface) header.dataset.surface = surface;
  header.classList.toggle('on-dark', surface === 'visit');
  const heroPinned = hero.classList.contains('scene-live');
  const amount = heroPinned ? sceneProgress(hero, sceneStages[0].stage, heroTravel) : 1;
  if (heroPinned) {
    if (lastHero !== amount) {
      hero.style.setProperty('--scene-build', amount.toFixed(3));
      lastHero = amount;
    }
  }
  if (amount >= 1) cueAssemblyFinished = true;
  const assembled = cueAssemblyFinished;
  if (mobileCue.matches && scrollY >= cueDismissDistance) mobileCueDismissed = true;
  if (!mobileCue.matches && assembled && scrollY >= cueDismissDistance) desktopCueDismissed = true;
  startCue.hidden = mobileCue.matches || assembled || scrollY > 2;
  moreCue.hidden = (mobileCue.matches ? mobileCueDismissed : !assembled || desktopCueDismissed) ||
    document.documentElement.scrollHeight - innerHeight - scrollY <= 100;
  if (deck.classList.contains('scene-live')) {
    const deckTop = deck.getBoundingClientRect().top;
    const arrival = deckArrival(deckTop);
    if (arrival !== lastDeckArrival) {
      deck.style.setProperty('--deck-arrival', arrival.toFixed(3));
      lastDeckArrival = arrival;
    }
    const travel = deck.offsetHeight - deckStage.offsetHeight;
    const progress = sceneProgress(deck, deckStage, travel);
    const exitStart = Math.max(deckHeightWithWordLead + header.offsetHeight - innerHeight,
      travel * ((cards.length - 1.5) / steps));
    const wordExit = clamp((header.offsetHeight - deckTop - exitStart) / Math.max(60, innerHeight * .14));
    if (wordExit !== lastWordExit) {
      deck.style.setProperty('--word-exit', wordExit.toFixed(3));
      lastWordExit = wordExit;
    }
    if (progress === 0) deckStop = 0;
    else if (progress === 1) deckStop = cards.length - 1;
    renderDeck(progress);
  }
}

function queueScroll() {
  if (!frame) frame = requestAnimationFrame(renderScroll);
}

function configureScenes() {
  stopDeckSettling();
  lastPosition = -1;
  hero.style.removeProperty('--ribbon-lead');
  deck.style.removeProperty('--word-lead');
  const available = innerHeight - header.offsetHeight;
  sceneStages.forEach(({scene, stage}) => {
    scene.classList.toggle('scene-live', !reduced.matches);
    if (stage.offsetHeight > available + 5) scene.classList.remove('scene-live');
  });
  if (hero.classList.contains('scene-live')) {
    const stage = sceneStages[0].stage;
    heroTravel = hero.offsetHeight - stage.offsetHeight;
    const ribbon = heroRibbon.getBoundingClientRect();
    const upperGap = ribbon.top - heroContact.getBoundingClientRect().bottom;
    const previousArrival = deck.style.getPropertyValue('--deck-arrival');
    deck.style.setProperty('--deck-arrival', deckArrival(header.offsetHeight + hero.offsetHeight).toFixed(3));
    const reveal = getComputedStyle(deckStage).transform;
    const shift = reveal === 'none' ? 0 : new DOMMatrixReadOnly(reveal).m42;
    const introTop = deckTitle.getBoundingClientRect().top;
    // Use the stage inset instead of its sticky position when measuring the opening.
    const introInset = deck.classList.contains('scene-live')
      ? introTop - deckStage.getBoundingClientRect().top + shift : introTop - deck.getBoundingClientRect().top;
    deck.style.setProperty('--deck-arrival', previousArrival);
    const lowerGap = stage.getBoundingClientRect().bottom - ribbon.bottom + heroTravel + introInset;
    const lead = Math.max(0, Math.min((lowerGap - upperGap) / 2, available - stage.offsetHeight, heroTravel - 16));
    hero.style.setProperty('--ribbon-lead', lead + 'px');
  }
  if (deck.classList.contains('scene-live')) {
    const words = wordBand.getBoundingClientRect();
    const upperGap = words.top - deckNav.getBoundingClientRect().bottom;
    const lowerGap = available - (words.bottom - deckStage.getBoundingClientRect().top);
    const lead = Math.max(0, Math.min((lowerGap - upperGap) / 2, available - deckStage.offsetHeight));
    deckHeightWithWordLead = deck.offsetHeight + lead;
    deck.style.setProperty('--word-lead', lead + 'px');
  } else {
    cards.forEach(card => { card.inert = false; });
    links.forEach(link => link.removeAttribute('aria-current'));
    orb.style.removeProperty('--trail');
    orb.style.removeProperty('--orb-turn');
    orb.dataset.tone = tones[0];
    active = lastPosition = -1;
  }
  queueScroll();
}

function deckScrollTarget(index) {
  const travel = deck.offsetHeight - deckStage.offsetHeight;
  const top = scrollY + deck.getBoundingClientRect().top - header.offsetHeight;
  return top + travel * (index / steps);
}

function stopDeckSettling() {
  if (!settleFrame) return;
  cancelAnimationFrame(settleFrame);
  settleFrame = 0;
}

function goToCard(index, behavior) {
  stopDeckSettling();
  deckStop = index;
  const target = deckScrollTarget(index);
  if (behavior !== 'smooth') {
    scrollTo({top: target, behavior});
    return;
  }
  const from = scrollY;
  const distance = target - from;
  const duration = Math.min(440, 130 + Math.abs(distance) * .55);
  const start = performance.now();
  function glide(now) {
    const t = clamp((now - start) / duration);
    scrollTo({top: from + distance * (1 - (1 - t) ** 3), behavior:'instant'});
    settleFrame = t < 1 ? requestAnimationFrame(glide) : 0;
  }
  settleFrame = requestAnimationFrame(glide);
}

function settleDeck() {
  if (settleFrame || !deck.classList.contains('scene-live') || mobileMenu.open ||
      document.body.matches('.annotation-active,.preview-review-picking')) return;
  const position = sceneProgress(deck, deckStage) * steps;
  if (position < .015 || position >= cards.length - 1) return;
  const nearest = Math.round(position);
  const delta = position - deckStop;
  const index = nearest === deckStop && Math.abs(delta) >= .16 ? deckStop + Math.sign(delta) : nearest;
  if (Math.abs(position - index) > .015) goToCard(index, 'smooth');
}

const cardIndex = hash => cards.findIndex(card => '#' + card.id === hash);
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor || !deck.classList.contains('scene-live')) return;
  const index = cardIndex(anchor.hash);
  if (index < 0) return;
  event.preventDefault();
  if (location.hash !== anchor.hash) history.pushState(null, '', anchor.hash);
  if (!deck.contains(anchor)) links[index].focus({preventScroll:true});
  goToCard(index, 'smooth');
});

startCue.addEventListener('click', event => {
  if (!hero.classList.contains('scene-live')) return;
  event.preventDefault();
  scrollBy({top:Math.max(80,heroTravel * .25),behavior:reduced.matches ? 'instant' : 'smooth'});
});
moreCue.addEventListener('click', event => {
  event.preventDefault();
  scrollBy({top:innerHeight * .65,behavior:reduced.matches ? 'instant' : 'smooth'});
});
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
document.addEventListener('oaiannotationmodechange', event => {
  document.body.classList.toggle('annotation-active', !!event.detail.active);
});

function restoreCard() {
  const index = cardIndex(location.hash);
  if (index >= 0 && deck.classList.contains('scene-live')) goToCard(index, 'instant');
}

addEventListener('scroll', queueScroll, {passive:true});
for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
  addEventListener(type, stopDeckSettling, {passive:true});
}
if ('onscrollend' in document) document.addEventListener('scrollend', settleDeck);
else {
  let scrollIdle;
  addEventListener('scroll', () => {
    clearTimeout(scrollIdle);
    scrollIdle = setTimeout(settleDeck, 160);
  }, {passive:true});
}
addEventListener('resize', configureScenes);
addEventListener('load', () => { configureScenes(); restoreCard(); }, {once:true});
addEventListener('hashchange', restoreCard);
reduced.addEventListener('change', configureScenes);
configureScenes();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('built');
      observer.unobserve(entry.target);
    }
  }, {threshold:.12});
  document.querySelectorAll('[data-build]').forEach(element => observer.observe(element));
}
