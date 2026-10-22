import {escape as e,header,footer,inquiry,projectLogo,contactLinks,inquiryCta} from './city-page.mjs';
import {cityCopy} from './city-copy.mjs';
import {renderSkills} from './skills.mjs';
import {renderProjectProcess} from './project-process.mjs';
import {renderFaq} from './faq.mjs';
import {renderCareer} from './career.mjs';

const external=(url,label,cls='text-link')=>`<a href="${e(url)}" class="${cls}" target="_blank" rel="noopener noreferrer">${e(label)}</a>`;
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
 <section id="technologies" class="direct-section" data-reveal aria-labelledby="technologies-title"><div class="direct-section-intro"><h2 id="technologies-title">${e(c.expertise.title)}</h2></div><dl class="direct-expertise">${c.expertise.items.map(item=>`<div><dt>${e(item.title)}</dt><dd>${e(item.body)}</dd></div>`).join('')}</dl>${skills}</section>
 <section id="projects" class="direct-section direct-projects" aria-labelledby="projects-title"><div class="direct-section-intro"><h2 id="projects-title">${e(c.work.title)}</h2></div><div class="direct-cases">${c.work.cases.map(item=>`<article id="case-${e(item.id)}" class="direct-case" aria-labelledby="case-title-${e(item.id)}">${projectMockup(item,u)}<div class="direct-case-copy">${projectLogo(item)}<h3 id="case-title-${e(item.id)}" class="sr-only">${e(item.name)}</h3><p>${e(item.description)}</p>${projectActions(item,c,u)}${projectQuote(item)}</div></article>`).join('')}</div></section>
 <section id="about" class="direct-section direct-about" data-reveal aria-labelledby="about-title"><div class="direct-about-portrait"><img src="/portrait.jpg" alt="João Victor" width="1086" height="1448" loading="lazy" decoding="async"></div><div><h2 id="about-title">${e(c.about.title)}</h2>${c.about.paragraphs.map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}${renderCareer(key,{compact:true,id:'experience'})}</div></section>
 ${renderFaq(key)}
 ${renderProjectProcess(key)}
 <section id="contact" class="direct-section direct-contact" data-reveal aria-labelledby="contact-title"><div class="direct-section-intro"><h2 id="contact-title">${e(c.contact.title)}</h2><p>${e(c.contact.description)}</p></div><div class="direct-contact-content"><div><div class="panel-actions">${button(u.brief)}</div>${contactLinks(c)}<p class="small direct-availability">${e(c.contact.availability)}</p></div><div class="direct-method"><h3>${e(c.trust.title)}</h3><dl>${c.trust.items.map(item=>`<div><dt>${e(item.title)}</dt><dd>${e(item.body)}</dd></div>`).join('')}</dl></div></div></section>`;
}

export function directHome(c,key){
 return `<div class="direct-page">${header(c,key,true,true)}<main id="main" class="direct-main" tabindex="-1">${renderDirectContent(c,key)}</main>${inquiryCta(key)}${footer(c,key)}${inquiry(c,key)}<script type="application/json" id="world-data">${JSON.stringify(cityCopy[key]).replace(/</g,'\\u003c')}</script></div>`;
}
