import {escape as e,header,footer,inquiry,projectLogo,contactLinks,inquiryCta} from './city-page.mjs';
import {cityCopy} from './city-copy.mjs';
import {renderSkills} from './skills.mjs';
import {renderProjectProcess} from './project-process.mjs';
import {renderFaq} from './faq.mjs';
import {renderCareer} from './career.mjs';

const external=(url,label,cls='text-link')=>`<a href="${e(url)}" class="${cls}" target="_blank" rel="noopener noreferrer">${e(label)}</a>`;
const serviceIcons=[
 '<path d="M4 8h24v8H4Zm0 13h24v8H4ZM8 5h4v3H8Zm12 0h4v3h-4ZM8 18h4v3H8Zm12 0h4v3h-4Z"/><path d="M8 11h3v2H8Zm0 13h3v2H8Z" fill="currentColor" stroke="none"/>',
 '<path d="m13 12-5 9m11-9 5 9M10 26h12M11 5h10v8H11ZM13 2h3v3h-3Zm5 0h3v3h-3ZM1 23h10v8H1Zm2-3h3v3H3Zm5 0h3v3H8ZM21 23h10v8H21Zm2-3h3v3h-3Zm5 0h3v3h-3Z"/>',
 '<path d="m3 12 13-6 13 6v13l-13 6-13-6Z" fill="currentColor" fill-opacity=".12"/><path d="m3 12 13 6 13-6M16 18v13M8 10V6l4-2 4 2v4l-4 2Zm10-4V2l4-1 4 2v4l-4 2Z"/>',
 '<path d="M3 7h23v21H3ZM7 4h4v3H7Zm12 0h4v3h-4ZM3 13h23M7 19l3 3 6-6"/><circle cx="23" cy="23" r="5" fill="var(--bg)"/><path d="m27 27 4 4"/>'
];
const button=label=>`<button type="button" class="button" data-inquiry>${e(label)}</button>`;

export function projectMockup(item,u,{compact=false}={}){
 const asset=item.id==='horagora'?'horagora':'asc';
 return `<a class="project-mockup${compact?' project-mockup-compact':''}" data-project-mockup href="${e(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="${e(`${u.details}: ${item.name}`)}"><span class="device-desktop device-frame" data-ui><span class="device-browser" aria-hidden="true"><span></span><span></span><span></span><span>${e(new URL(item.url).host)}</span></span><img src="/${asset}-desktop.webp" alt="${e(item.name)}" width="1280" height="700" loading="lazy" decoding="async"></span><span class="device-mobile device-frame" data-ui><img src="/${asset}-mobile.webp" alt="${e(item.name)}" width="390" height="700" loading="lazy" decoding="async"></span></a>`;
}

export function projectActions(item,c,u,{scope='case'}={}){
 const id=`project-detail-${scope}-${item.id}`;
 return `<div class="project-actions"><details class="project-detail"><summary class="button button-secondary" aria-controls="${e(id)}">${e(c.ui.details)}</summary><p id="${e(id)}" class="project-detail-content">${e(item.detail)}</p></details>${external(item.url,u.details,'button')}</div>`;
}

export function projectQuote(item){
 const q=item.quote;
 return `<figure class="project-quote" data-quote-kind="${e(q.kind)}"><blockquote><p>${e(q.text)}</p></blockquote><figcaption><span>${e(q.attribution)}</span><svg class="project-quote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M10 5H3v8h4c0 3-1 4-3 5v2c4-1 6-4 6-8V5Zm11 0h-7v8h4c0 3-1 4-3 5v2c4-1 6-4 6-8V5Z"/></svg></figcaption></figure>`;
}

export function renderDirectContent(c,key,{embedded=false}={}){
 const u=cityCopy[key],titleId=embedded?'viewer-reading-title':'direct-title',heading=embedded?'h2':'h1';
 const skills=renderSkills(c.skills,key).replaceAll('skills-title',embedded?'viewer-reading-skills-title':'skills-title');
 return `<section id="intro" class="direct-hero" aria-labelledby="${titleId}"><div class="direct-hero-copy"><div class="direct-identity"><img src="/portrait.jpg" alt="João Victor" width="1086" height="1448" ${embedded?'loading="lazy"':'fetchpriority="high"'} decoding="async"><div><p class="direct-role">${e(u.role)}</p><${heading} id="${titleId}">João Victor</${heading}></div></div><p class="direct-offer">${e(u.offer)}</p><p class="direct-description">${e(c.hero.description)}</p><div class="panel-actions">${button(u.brief)}<a href="#projects" class="text-link">${e(c.hero.secondary)}</a></div><p class="direct-signature">${e(u.intro)}</p></div>${embedded?'':`<a class="direct-world-link text-link" href="/${key}/">${e(u.orbit)}</a>`}</section>
 <section id="technologies" class="direct-section" aria-labelledby="technologies-title"><div class="direct-section-intro"><h2 id="technologies-title">${e(c.expertise.title)}</h2></div><dl class="direct-expertise">${c.expertise.items.map((item,i)=>`<div><dt><svg class="direct-service-icon service-${i}" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter" aria-hidden="true" focusable="false">${serviceIcons[i]}</svg>${e(item.title)}</dt><dd>${e(item.body)}</dd></div>`).join('')}</dl>${skills}</section>
 <section id="projects" class="direct-section direct-projects" aria-labelledby="projects-title"><div class="direct-section-intro"><h2 id="projects-title">${e(c.work.title)}</h2></div><div class="direct-cases">${c.work.cases.map(item=>`<article id="case-${e(item.id)}" class="direct-case" aria-labelledby="case-title-${e(item.id)}"><div class="direct-case-copy">${projectLogo(item)}<h3 id="case-title-${e(item.id)}" class="sr-only">${e(item.name)}</h3><p>${e(item.description)}</p></div>${projectMockup(item,u)}<div class="direct-case-end">${projectActions(item,c,u)}${projectQuote(item)}</div></article>`).join('')}</div></section>
 <section id="about" class="direct-section direct-about" aria-labelledby="about-title"><h2 id="about-title">${e(c.about.title)}</h2><div class="direct-about-portrait"><img src="/portrait.jpg" alt="João Victor" width="1086" height="1448" loading="lazy" decoding="async"></div><div class="direct-about-copy">${c.about.paragraphs.map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}${renderCareer(key,{compact:true,id:'experience'})}</div></section>
 ${renderFaq(key)}
 ${renderProjectProcess(key)}
 <section id="contact" class="direct-section direct-contact" aria-labelledby="contact-title"><div class="direct-section-intro"><h2 id="contact-title">${e(c.contact.title)}</h2><p>${e(c.contact.description)}</p></div><div class="direct-contact-content"><div class="direct-contact-primary"><div class="panel-actions">${button(u.brief)}</div>${contactLinks(c)}<figure class="direct-contact-character" data-contact-character aria-hidden="true"><img src="/jovi-poster.webp" alt="" width="108" height="160" loading="lazy" decoding="async"><canvas data-contact-character-canvas aria-hidden="true"></canvas></figure><p class="small direct-availability">${e(c.contact.availability)}</p></div><div class="direct-method"><h3>${e(c.trust.title)}</h3><dl>${c.trust.items.map(item=>`<div><dt>${e(item.title)}</dt><dd>${e(item.body)}</dd></div>`).join('')}</dl></div></div></section>`;
}

export function directHome(c,key){
 return `<div class="direct-page">${header(c,key,true,true)}<main id="main" class="direct-main" tabindex="-1">${renderDirectContent(c,key)}</main>${inquiryCta(key)}${footer(c,key)}${inquiry(c,key)}<script type="application/json" id="world-data">${JSON.stringify(cityCopy[key]).replace(/</g,'\\u003c')}</script></div>`;
}
