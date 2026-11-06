import test from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../src/content.mjs';
import {directHome,renderDirectContent,projectMockup,projectActions} from '../src/direct-page.mjs';
import {escape as e,contactLinks,socialIcon} from '../src/city-page.mjs';
import {cityCopy} from '../src/city-copy.mjs';
import {renderSkills} from '../src/skills.mjs';

test('the direct portfolio has complete localised content without the world runtime',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=directHome(c,key);
  const factual=renderDirectContent(c,key);
  const siteHeader=html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0];
  assert.doesNotMatch(siteHeader,/data-tour-link|aria-disabled/);
  const footerNav=html.match(/<nav class="footer-socials"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.equal((footerNav.match(/<a /g)||[]).length,1);
  assert.match(footerNav,/href="https:\/\/github.com\/jovi47"/);
  const headerMark=siteHeader.match(/<a class="wordmark"[^>]*>([\s\S]*?)<\/a>/)?.[1],footerMark=html.match(/<a class="footer-name"[^>]*>([\s\S]*?)<\/a>/)?.[1];
  assert.equal(footerMark,'ojoaovsousa',`${key}: footer keeps only the pixel wordmark`);assert.match(headerMark,/src="\/jovi-poster\.webp"/);
  const siteFooter=html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];assert.ok(siteFooter);assert.ok(!siteFooter.includes(`href="/${key}/direct/"`),`${key}: footer omits the reading option`);
  assert.doesNotMatch(factual,/data-contact-character|direct-contact-character/);
  for(const id of ['experience','projects','faq','contact'])assert.equal((siteHeader.match(new RegExp(`href="#${id}"`,'g'))||[]).length,2,`${key}: local native section navigation`);
  assert.ok(html.includes(factual),`${key}: direct content renderer`);
  const channels=contactLinks(c);
  assert.ok(factual.includes(channels),`${key}: shared contact channels`);
  for(const url of ['https://wa.me/5579998230872','mailto:jovi47profissional@gmail.com','https://www.linkedin.com/in/jovi47/'])assert.ok(channels.includes(`href="${url}"`),`${key}: existing contact destination`);
  assert.ok(channels.includes(e(c.contact.whatsapp)));
  assert.doesNotMatch(factual,/href="tel:|class="phone"|\+55 79 99823-0872/);
  for(const kind of ['whatsapp','linkedin']){
   assert.match(socialIcon(kind),new RegExp(`src="/contact-icons/${kind}\\.svg"`));
   assert.match(socialIcon(kind),/alt="" aria-hidden="true" width="24" height="24"/);
   assert.equal((html.split(socialIcon(kind)).length-1),2,`${key}: same local mark in contact and dialog`);
  }
  assert.match(socialIcon('mail'),/^<span class="social-brick social-brick-mail" aria-hidden="true"><svg\b/);
  for(const kind of ['whatsapp','linkedin','github'])assert.ok(socialIcon(kind).startsWith(`<span class="social-brick social-brick-${kind}" aria-hidden="true"><img`));
  for(const group of [c.work,c.expertise]){
   assert.ok(factual.includes(e(group.title)),`${key}: section title`);
   assert.ok(!factual.includes(e(group.description)),`${key}: concise section introduction`);
  }
  assert.ok(factual.includes(`>${e(cityCopy[key].details)}</a>`),`${key}: live website action`);
  for(const id of ['main','intro','about','experience','projects','contact','inquiry-dialog'])assert.equal((html.match(new RegExp(`\\bid="${id}"`,'g'))||[]).length,1,`${key}: ${id}`);
  for(const item of c.work.cases){
   for(const value of [item.name,item.url,item.description,item.detail])assert.ok(factual.includes(e(value)),`${key}: ${item.id} factual content`);
   const actions=projectActions(item,c,cityCopy[key]);
   const detailsId=`project-detail-case-${item.id}`;
   assert.ok(actions.includes(`aria-controls="${detailsId}"`));
   assert.ok(actions.includes(`<p id="${detailsId}" class="project-detail-content">${e(item.detail)}</p>`));
   assert.ok(actions.indexOf('<summary')<actions.indexOf('</details>')&&actions.indexOf('</details>')<actions.indexOf('<a '));
   assert.ok(factual.includes(actions),`${key}: shared native project disclosure`);
   const mockup=projectMockup(item,cityCopy[key]);
   assert.ok(factual.includes(mockup),`${key}: shared ${item.id} mockup`);
   assert.equal((mockup.match(/\bdata-project-mockup(?:\s|=|>)/g)||[]).length,1);
   const images=[...mockup.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
   assert.equal(images.length,2);
   for(const device of ['desktop','mobile'])assert.ok(images.some(image=>image.includes(`src="/${item.id==='horagora'?'horagora':'asc'}-${device}.webp"`)),`${key}: ${item.id} ${device}`);
   for(const image of images){assert.match(image,/\bloading="lazy"/);assert.match(image,/\balt="[^"]+"/);}
  }
  assert.equal((factual.match(/\bdata-project-mockup(?:\s|=|>)/g)||[]).length,2);
  assert.equal((factual.match(/<img\b[^>]*\bsrc="\/(?:horagora|asc)-(?:desktop|mobile)\.webp"/g)||[]).length,4);
  for(const paragraph of c.about.paragraphs)assert.ok(factual.includes(e(paragraph)));
  const technologyNames=[...factual.matchAll(/<ul\b[^>]*data-tech-primary[^>]*>([\s\S]*?)<\/ul>/g)].map(match=>match[1]).join('');
  assert.equal((technologyNames.match(/class="technology-name"/g)||[]).length,54);
  for(const item of c.expertise.items){assert.ok(factual.includes(e(item.title)));assert.ok(factual.includes(e(item.body)));}
  assert.doesNotMatch(factual,/<(?:header|footer|main|dialog|form)\b|↗|↓|←/);
  for(const asset of ['horagora-logo.svg','horagora-logo-dark.svg','asc-logo.svg','asc-logo-dark.svg'])assert.ok(factual.includes(`src="/${asset}"`));
  assert.equal((factual.match(/class="project-actions"/g)||[]).length,2);
  assert.equal((factual.match(/\bdata-project-process(?:\s|=|>)/g)||[]).length,1);
  assert.ok(factual.indexOf('data-project-process')<factual.indexOf('id="contact"'));
  assert.ok(factual.indexOf('data-project-process')<factual.indexOf('id="faq"'),`${key}: process precedes common questions`);
  assert.match(factual,/<h3[^>]*class="sr-only"/);
  assert.ok(html.includes(`href="/${key}/"`));
  assert.match(html,/data-inquiry/);
  const fab=html.match(/<button\b[^>]*class="[^"]*inquiry-cta[^"]*"[^>]*>/)?.[0];
  assert.ok(fab,`${key}: shared floating inquiry`);
  assert.match(fab,/data-inquiry-cta/);assert.doesNotMatch(fab,/\sdisabled|data-question/);
  assert.equal((html.match(/\bdata-inquiry-cta(?:\s|=|>)/g)||[]).length,1);
  assert.doesNotMatch(html,/<canvas|city-canvas|city\.js|\.glb|data-walk|data-board/);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: duplicated DOM id`);
 }
});

test('the skills API renders 54 named technologies with local icons and no scores or familiarity gauges',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=renderSkills(c.skills,key);
  const primary=[...html.matchAll(/<ul\b[^>]*data-tech-primary[^>]*>([\s\S]*?)<\/ul>/g)].map(match=>match[1]).join('');
  assert.equal((primary.match(/class="technology-item"/g)||[]).length,54);
  assert.equal((primary.match(/class="technology-name"/g)||[]).length,54);
  for(const name of ['Elixir','Java','JavaScript','React','Phoenix','PostgreSQL','Fly.io','AWS','Docker','GitHub','Git','HTML','CSS','Python','Spring Boot','CI/CD','Harnesses','RAG','XML','MySQL','PL/SQL'])assert.ok(primary.includes(`>${name}</span>`));
  assert.match(html,/<h3 id="skills-title">[^<]+<\/h3>/);
  assert.match(html,/data-technology-marquee tabindex="0" aria-label="[^"]+"/);
  assert.doesNotMatch(html,/data-tech-pause|<button\b/);
  for(const item of c.skills.items)assert.equal(Object.hasOwn(item,'value'),false,`${key}: obsolete numeric score`);
  assert.equal(Object.hasOwn(c.skills,'note'),false,`${key}: obsolete scoring note`);
  for(const name of ['java','elixir','javascript','react'])assert.ok(html.includes(`/icons/${name}.svg`));
  assert.doesNotMatch(html,/https?:\/\/|conic-gradient|skill-(?:gauge|ring|value)|skills-note|stroke-dasharray|%/);
  assert.doesNotMatch(html,/aria-(?:label|description)="[^"]*(?:familiaridade|familiarity|familiaridad)/i);
 }
});


test('reading case order explains each project before its visual and actions',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=renderDirectContent(c,key);
  for(const item of c.work.cases){
   const article=html.match(new RegExp(`<article id="case-${item.id}"[^>]*>([\\s\\S]*?)</article>`))?.[1];
   assert.ok(article,`${key}: ${item.id} article`);
   const description=article.indexOf(e(item.description)),mockup=article.indexOf('data-project-mockup'),actions=article.indexOf('class="project-actions"');
   assert.ok(article.indexOf('class="brand-image project-logo"')<description,`${key}: logo precedes explanation`);
   assert.ok(description<mockup&&mockup<actions,`${key}: explanation, preview, then actions`);
   assert.equal((article.match(/\bdata-project-mockup(?:\s|=|>)/g)||[]).length,1);
   assert.ok(actions<article.indexOf('class="project-quote"'),`${key}: attribution follows actions`);
  }
 }
});

test('reading biography introduces the portrait beside its first paragraph without duplicating it',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=renderDirectContent(c,key),about=html.match(/<section id="about"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  assert.ok(about);
  assert.ok(about.indexOf('id="about-title"')<about.indexOf('class="direct-about-portrait"'),`${key}: heading introduces biography`);
  assert.ok(about.indexOf('class="direct-about-portrait"')<about.indexOf(e(c.about.paragraphs[0])),`${key}: portrait meets first paragraph`);
  assert.equal((about.match(/src="\/portrait.jpg"/g)||[]).length,1);
  for(const paragraph of c.about.paragraphs)assert.ok(about.includes(e(paragraph)));
 }
});

test('reading services retain their complete copy with decorative local brick vectors',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=renderDirectContent(c,key),services=html.match(/<dl class="direct-expertise">([\s\S]*?)<\/dl>/)?.[1];
  assert.ok(services);
  const icons=[...services.matchAll(/<svg class="direct-service-icon service-[0-3]"[^>]*>[\s\S]*?<\/svg>/g)].map(match=>match[0]);
  assert.equal(icons.length,c.expertise.items.length);
  for(const icon of icons){assert.match(icon,/viewBox="0 0 32 32"/);assert.match(icon,/aria-hidden="true" focusable="false"/);assert.match(icon,/<path/);assert.doesNotMatch(icon,/<image|<script|\bstyle=/);}
  for(const item of c.expertise.items){assert.ok(services.includes(e(item.title)));assert.ok(services.includes(e(item.body)));}
 }
});
