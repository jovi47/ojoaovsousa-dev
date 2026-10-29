import test from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../src/content.mjs';
import {viewerHome} from '../src/viewer-page.mjs';
import {renderDirectContent} from '../src/direct-page.mjs';
import {escape as e} from '../src/city-page.mjs';
import {cityCopy} from '../src/city-copy.mjs';

test('the introduction precedes the optional 3D canvas in keyboard order and replay has localized visible text',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=viewerHome(c,key);
  const intro=html.indexOf('<section class="viewer-intro"');
  const canvas=html.indexOf('<canvas ');
  assert.ok(intro>=0&&intro<canvas,`${key}: identity and actions come before the demonstration`);
  assert.ok(html.indexOf('class="panel-actions"',intro)<canvas,`${key}: primary actions precede the canvas`);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${key}: one primary heading`);
  const replay=html.match(/<button[^>]*\bdata-replay-landmark\b[^>]*>[\s\S]*?<\/button>/)?.[0];
  const replayLabel={'pt-br':'Montar novamente',en:'Build again',es:'Montar de nuevo'}[key];
  assert.ok(replay?.includes(`<span class="viewer-replay-label">${replayLabel}</span>`));
  assert.ok(replay.includes(`aria-label="${replayLabel}"`),`${key}: accessible replay name matches its visible text`);
  assert.ok(html.includes(`class="footer-name" href="/${key}/#main"`),`${key}: home anchor remains visible with or without 3D`);
  assert.match(html,/<p class="viewer-touch-hint sr-only" id="viewer-mobile-help">[^<]+<\/p>/);
  assert.doesNotMatch(html,/\$\{e\(v\./,`${key}: no template expression leaks into button text`);
 }
});

test('the portfolio viewer has five panels, four landmark selectors and a separate contact control in every locale',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=viewerHome(c,key);
  const houses=html.match(/<nav\b[^>]*class="[^"]*\bviewer-houses\b[^"]*"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(houses,`${key}: building navigation`);
  assert.deepEqual([...houses.matchAll(/data-select-building="([^"]+)"/g)].map(match=>match[1]).sort(),['andrea','challenge','horagora','stack']);
  const aboutSelector=houses.match(/<button\b[^>]*data-select-building="stack"[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(aboutSelector?.includes(e({'pt-br':'Sobre mim',en:'About me',es:'Sobre mí'}[key])),`${key}: castle opens the personal profile`);
  assert.equal((html.match(/data-select-building="/g)||[]).length,4);
  const selectors=Object.fromEntries([...houses.matchAll(/<button\b[^>]*data-select-building="([^"]+)"[^>]*>[\s\S]*?<\/button>/g)].map(match=>[match[1],match[0]]));
  assert.match(selectors.stack,/<img[^>]+src="\/portrait\.jpg"/);
  assert.doesNotMatch(selectors.stack,/icons\/java|icons\/elixir/);
  assert.match(selectors.horagora,/viewer-brand-symbol viewer-horagora-symbol/);
  assert.match(selectors.horagora,/<img[^>]+src="\/horagora-logo\.svg"/);
  assert.doesNotMatch(selectors.horagora,/hori\.webp/);
  assert.match(selectors.andrea,/viewer-brand-symbol/);
  assert.match(selectors.andrea,/<img[^>]+src="\/asc-symbol\.svg"/);
  assert.match(selectors.horagora,/<img[^>]+src="\/horagora-logo-dark\.svg"/);
  assert.match(selectors.andrea,/<img[^>]+src="\/asc-symbol-dark\.svg"/);
  assert.ok(selectors.horagora.includes('>HorAgora</span>'));
  assert.ok(selectors.andrea.includes('>ASC</span>'));

  const question=houses.match(/<button\b[^>]*class="[^"]*viewer-house-question[^"]*"[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(question);for(const attr of ['data-select-building="challenge"','aria-pressed="false"','aria-controls="viewer-card"','disabled'])assert.ok(question.includes(attr));
  assert.doesNotMatch(question,/data-inquiry|data-question/);
  assert.doesNotMatch(question,/aria-label=/);
  const contact=html.match(/<button\b[^>]*class="[^"]*\bviewer-contact-fab\b[^"]*"[^>]*>/)?.[0];
  assert.ok(contact,`${key}: separate contact button`);
  for(const attribute of ['data-question','data-inquiry','disabled'])assert.match(contact,new RegExp(`\\s${attribute}(?:\\s|=|>)`));
  const siteHeader=html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0];
  assert.ok(siteHeader.includes('>ojoaovsousa</a>'),`${key}: current public handle`);
  assert.doesNotMatch(html,/>ojoaovsousa<span[^>]*>\.<\/span>/);
  for(const heading of html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g))assert.ok(!heading[1].replace(/<[^>]+>/g,'').trim().endsWith('.'),`${key}: titles have no terminal full stop`);
  assert.doesNotMatch(siteHeader,/data-tour-link|aria-disabled|tabindex="-1"/);
  for(const id of ['experience','projects','faq','contact'])assert.equal((siteHeader.match(new RegExp(`href="/${key}/direct/#${id}"`,'g'))||[]).length,2,`${key}: native reading navigation to ${id}`);
  assert.doesNotMatch(siteHeader,/data-skip-build|header-direct|header-skip/);
  assert.doesNotMatch(siteHeader,/header-github|href="https:\/\/github\.com/);
  assert.match(siteHeader,/<img class="header-character" src="\/jovi-poster\.webp"[^>]*alt=""/);
  for(const flag of ['pt-br','en','es'])assert.ok(siteHeader.includes(`data-flag="${flag}"`),`${key}: local SVG language flag ${flag}`);
  assert.match(siteHeader,/class="language-picker"><summary aria-label="[^"]+: (?:Português|English|Español)"/);
  const skip=html.match(/<a\b[^>]*\bdata-skip-build\b[^>]*>/)?.[0];
  assert.ok(skip,`${key}: skip remains available within the scene`);
  assert.match(skip,/class="[^"]*\bviewer-skip\b/);
  assert.ok(skip.includes(`href="/${key}/direct/"`),`${key}: useful direct fallback without JavaScript`);
  assert.doesNotMatch(skip,/\sdisabled(?:\s|=|>)/);
  assert.doesNotMatch(siteHeader,/version-picker|mobile-versions|\/black\//);
  for(const locale of ['pt-br','en','es'])assert.ok(siteHeader.includes(`href="/${locale}/"`),`${key}: canonical language ${locale}`);
  assert.ok(html.includes(`href="/${key}/direct/"`),`${key}: accessible reading mode remains outside header`);
  assert.doesNotMatch(html,/class="[^"]*(?:viewer-direct|viewer-card-direct)[^"]*"/);
  assert.match(html,/<button[^>]*class="viewer-start-cue"[^>]*data-start-build[^>]*aria-label="[^"]+"/);
  const startCue=html.match(/<button type="button" class="viewer-start-cue"[^>]*data-start-build[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(startCue,`${key}: prominent native assembly cue`);
  assert.ok(startCue.includes({'pt-br':'Role ou arraste para baixo para montar',en:'Scroll or swipe down to build',es:'Desplázate o desliza hacia abajo para montar'}[key]));
  assert.match(startCue,/<svg[^>]*aria-hidden="true"/);
  assert.ok(html.includes({'pt-br':'Role para montar',en:'Scroll to build',es:'Desplázate para montar'}[key]));
  const theme=siteHeader.match(/<button\b[^>]*\bdata-theme-toggle\b[^>]*>[\s\S]*?<\/button>/)?.[0];
  assert.ok(theme,`${key}: theme action in header`);
  for(const attribute of ['aria-label','title','data-theme-dark','data-theme-light'])assert.match(theme,new RegExp(`\\b${attribute}="[^\"]+"`));
  assert.match(theme,/<svg[^>]*class="[^"]*theme-moon/);
  assert.match(theme,/<svg[^>]*class="[^"]*theme-sun/);
  assert.doesNotMatch(theme,/◐/);
  assert.equal((html.match(/class="viewer-tour"/g)||[]).length,1);
  assert.equal((html.match(/class="viewer-board"/g)||[]).length,1);
  assert.match(html,/class="viewer-tour"><div class="viewer-board"/);
  assert.deepEqual([...html.matchAll(/data-viewer-card="([^"]+)"/g)].map(match=>match[1]).sort(),['about','andrea','challenge','horagora','stack']);
  assert.doesNotMatch(html,/viewer-about-trigger|data-select-about/);
  assert.ok(html.includes({'pt-br':'Preparando as peças…',en:'Preparing the pieces…',es:'Preparando las piezas…'}[key]));
  assert.match(html,/<p class="viewer-loading"><span class="viewer-loading-brick" aria-hidden="true"><\/span>/);
  assert.match(html,/<noscript><style>\.viewer-page \.viewer-board\{display:none\}/);
  const quoteCopy={'pt-br':'Fale comigo',en:'Let’s talk',es:'Hablemos'}[key];
  assert.ok(html.includes(`<span class="viewer-contact-label">${quoteCopy}</span>`));
  assert.match(html,/<p class="sr-only" id="world-status" role="status">/);
  assert.doesNotMatch(html,/viewer-camera|data-scene-tools|data-replay-build|data-view-reset|data-view-zoom|data-view-rotate/);
  assert.ok(!html.includes('data-view-landmark'),`${key}: explicit 3D mode is absent`);
  assert.doesNotMatch(html,/class="viewer-status"/);
  assert.doesNotMatch(html,/data-building-step|data-mobile-tour/,`${key}: landmark tabs replace redundant arrows and pause controls`);
  assert.equal((html.match(/id="city-canvas"/g)||[]).length,1);
  assert.equal((html.match(/id="inquiry-dialog"/g)||[]).length,1);
  assert.equal((html.match(/\bdata-inquiry-cta(?:\s|=|>)/g)||[]).length,1);
  assert.ok(html.indexOf('data-inquiry-cta')>html.indexOf('</main>'),`${key}: floating contact is outside the scene and reading stacking contexts`);
  for(const attribute of ['data-inquiry','data-replay-landmark','data-retry'])assert.ok(html.includes(attribute),`${key}: ${attribute}`);
  assert.doesNotMatch(html,/data-clear-selection|closeCard/);
  assert.match(html,/<aside[^>]+id="viewer-card"[^>]*><div class="viewer-identity viewer-identity--compact">[\s\S]*?<\/div><\/div><p class="viewer-card-top">[^<]+<\/p><section data-viewer-card="stack"/);
  assert.ok(html.includes(`/${key}/direct/`));
  assert.ok(html.includes({'pt-br':'Role para montar · Depois arraste para girar',en:'Scroll to build · Then drag to rotate',es:'Desplázate para montar · Luego arrastra para girar'}[key]));
  assert.match(html,/<aside[^>]+id="viewer-card"[^>]+hidden/);
  assert.doesNotMatch(html,/data-walk|data-board|data-car|world-2d|data-season|data-fw-|\.glb|<script[^>]+src=/);
 }
});

test('cards and the shared reading fallback retain factual projects, local mockups and one accessible inquiry',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=viewerHome(c,key);
  const reading=renderDirectContent(c,key,{embedded:true});
  const readingSection=html.match(/<section\b[^>]*class="viewer-reading"[^>]*>/)?.[0];
  assert.ok(readingSection&&html.includes(`${readingSection}${reading}</section>`),`${key}: shared direct renderer`);
  assert.doesNotMatch(reading,/<(?:header|footer|main|dialog|form)\b/);
  for(const item of c.work.cases){
   const cardStart=html.indexOf(`<section data-viewer-card="${item.id}"`);
   const card=html.slice(cardStart,html.indexOf('<section data-viewer-card="',cardStart+1));
   for(const value of [item.name,item.url,item.description,item.detail]){
    assert.ok(reading.includes(e(value)),`${key}: ${item.id} reading content`);
    assert.ok(card.includes(e(value)),`${key}: ${item.id} project card content`);
   }
   assert.match(card,/<h2[^>]*class="sr-only"[^>]*data-viewer-title/);
   assert.match(card,/class="project-actions"><details/);
   const detailId=`project-detail-viewer-${item.id}`;
   assert.ok(card.includes(`aria-controls="${detailId}"`));
   assert.ok(card.includes(`<p id="${detailId}" class="project-detail-content">${e(item.detail)}</p>`));

   assert.doesNotMatch(card,/viewer-project-role|↗/);
  }
  for(const logo of ['horagora-logo.svg','horagora-logo-dark.svg','asc-logo.svg','asc-logo-dark.svg','icons/java.svg','icons/elixir.svg','icons/javascript.svg','icons/react.svg'])assert.ok(html.includes(logo));
  const readingTechnologies=[...reading.matchAll(/<ul\b[^>]*data-tech-primary[^>]*>([\s\S]*?)<\/ul>/g)].map(match=>match[1]).join('');
  assert.equal((readingTechnologies.match(/class="technology-name"/g)||[]).length,54,`${key}: reading technology names`);
  for(const name of ['Elixir','Java','JavaScript','React','Phoenix','PostgreSQL','Docker','GitHub','Python','MySQL','PL/SQL'])assert.ok(readingTechnologies.includes(`>${name}</span>`));
  for(const paragraph of c.about.paragraphs)assert.ok(reading.includes(e(paragraph)));
  for(const item of c.trust.items){assert.ok(reading.includes(e(item.title)));assert.ok(reading.includes(e(item.body)));}
  for(const id of ['stack','about']){
   const cardStart=html.indexOf(`<section data-viewer-card="${id}"`);
   const card=html.slice(cardStart,html.indexOf('<section data-viewer-card="',cardStart+1));
   assert.match(card,/<img\b[^>]*src="\/portrait\.jpg"[^>]*alt="João Victor"/);
   for(const value of [c.about.title,c.hero.description,...c.about.paragraphs])assert.ok(card.includes(e(value)),`${key}: ${id} personal profile`);
   assert.ok(!card.includes(e(c.trust.title)),`${key}: method stays in shared reading only`);
   for(const item of c.expertise.items){assert.ok(card.includes(e(item.title)),`${key}: ${id} experience and method`);assert.ok(card.includes(e(item.body)));}
   const technologies=[...card.matchAll(/<ul\b[^>]*data-tech-primary[^>]*>([\s\S]*?)<\/ul>/g)].map(match=>match[1]).join('');
   assert.equal((technologies.match(/class="technology-name"/g)||[]).length,54,`${key}: ${id} technology names`);
   for(const icon of ['elixir','java','javascript','react'])assert.ok(technologies.includes(`/icons/${icon}.svg`));
   assert.match(card,/data-technology-marquee/);
   assert.doesNotMatch(card,/data-project-mockup|skill-(?:gauge|ring|value)|skills-note|stroke-dasharray|%/);
   for(const item of c.work.cases)for(const value of [item.description,item.detail])assert.ok(!card.includes(e(value)),`${key}: long project content belongs to its own card`);
  }
  for(const item of c.work.cases){
   assert.ok(html.includes(e(item.quote.text)),`${key}: approved project quote`);
   assert.ok(html.includes(`<figcaption><span>${e(item.quote.attribution)}</span><svg class="project-quote-icon"`));
   assert.match(html,/<svg class="project-quote-icon"[^>]*aria-hidden="true"[^>]*focusable="false"/);
   assert.ok(html.includes(`data-quote-kind="${item.quote.kind}"`));
  }
  assert.doesNotMatch(html,/viewer-fiction|Minha casa|My house presents|Mi casa presenta/);
  for(const id of ['intro','about','experience','projects','contact'])assert.equal((reading.match(new RegExp(`\\bid="${id}"`,'g'))||[]).length,1,`${key}: ${id}`);
  assert.equal((reading.match(/\bdata-project-mockup(?:\s|=|>)/g)||[]).length,2);
  const images=[...reading.matchAll(/<img\b[^>]*\bsrc="\/(?:horagora|asc)-(?:desktop|mobile)\.webp"[^>]*>/g)].map(match=>match[0]);
  assert.equal(images.length,4,`${key}: desktop and mobile mockups for both projects`);
  for(const image of images)assert.match(image,/\bloading="lazy"/);
  const challenge=html.slice(html.indexOf('<section data-viewer-card="challenge"'),html.indexOf('</aside>',html.indexOf('<section data-viewer-card="challenge"')));
  assert.ok(challenge.includes(e(cityCopy[key].brief)),`${key}: challenge briefing invitation`);
  assert.ok(challenge.includes(e(c.contact.availability)),`${key}: real availability`);
  assert.match(challenge,/<strong>(?:Menos tarefas repetitivas|Fewer repetitive tasks|Menos tareas repetitivas)/);
  assert.ok(challenge.includes(e({'pt-br':'O que vamos construir juntos?',en:'What shall we build together?',es:'¿Qué vamos a construir juntos?'}[key])),`${key}: collaborative challenge title`);
  assert.match(challenge,/(?:hoje|today|hoy)\?<\/strong>/);
  for(const value of [c.contact.title,c.contact.description])assert.ok(reading.includes(e(value)),`${key}: shared contact copy unchanged`);
  assert.match(challenge,/<button\b[^>]*\bdata-inquiry\b/);
  for(const url of ['https://wa.me/5579998230872','mailto:jovi47profissional@gmail.com','https://www.linkedin.com/in/jovi47/'])assert.ok(challenge.includes(`href="${url}"`));
  assert.equal((reading.match(/\bdata-project-process(?:\s|=|>)/g)||[]).length,1);
  assert.ok(reading.indexOf('data-project-process')<reading.indexOf('id="contact"'));
  assert.doesNotMatch(reading,/↗|↓|←/);
  assert.doesNotMatch(challenge,/\b\d[\d.,]*\s*(?:%|peças|pieces|piezas)/i);
  const siteFooter=html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
  assert.ok(siteFooter,`${key}: shared footer`);
  for(const url of ['https://github.com/jovi47']){
   const social=[...siteFooter.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(match=>match[0]).find(link=>link.includes(`href="${url}"`));
   assert.ok(social,`${key}: footer ${url}`);
   if(url.startsWith('mailto:'))assert.match(social,/<svg\b/);
   else assert.match(social,/<img\b[^>]*class="social-brand-icon social-brand-(?:github|linkedin|whatsapp)"[^>]*\bsrc="\/(?:contact-icons|technology-icons)\/[a-z]+\.svg"[^>]*alt="" aria-hidden="true"/);
  }
  assert.equal((html.match(/<header\b/g)||[]).length,1);
  assert.equal((html.match(/<footer\b/g)||[]).length,1);
  assert.doesNotMatch(html,/<(?:form|input|textarea|select)\b/);
  assert.doesNotMatch(html,/skill-(?:gauge|ring|value)|skills-note|stroke-dasharray/);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: duplicated DOM id`);
 }
});
test('desktop cards share one compact identity without another main heading',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=viewerHome(c,key),card=html.slice(html.indexOf('<aside id="viewer-card"'),html.indexOf('</aside>'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((card.match(/viewer-identity--compact/g)||[]).length,1);
  assert.match(card,/<p class="viewer-identity-name">João Victor<\/p>/);
  assert.ok(card.indexOf('viewer-identity--compact')<card.indexOf('data-viewer-card="stack"'));
 }
});
