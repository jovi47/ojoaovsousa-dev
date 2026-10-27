import {cityCopy} from './city-copy.mjs';
import {structuredData} from './search-discovery.mjs';
export const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escape;

const localized=(k,pt,en,es)=>k==='pt-br'?pt:k==='en'?en:es;
const btn=(attr,label,cls='button')=>`<button type="button" ${attr} class="${cls}">${e(label)}</button>`;
function themeToggle(key){
 const dark=localized(key,'Ativar modo escuro','Switch to dark mode','Activar modo oscuro'),light=localized(key,'Ativar modo claro','Switch to light mode','Activar modo claro');
 return `<button type="button" class="icon-button theme-toggle" data-theme-toggle data-theme-dark="${e(dark)}" data-theme-light="${e(light)}" aria-pressed="false" aria-label="${e(dark)}" title="${e(dark)}"><svg class="theme-glyph theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/></svg><svg class="theme-glyph theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/></svg></button>`;
}
export function header(c,key,isHome=false,direct=false,variant='island'){
 const u=cityCopy[key],sectionPrefix=direct?'':`/${key}/direct/`;
 const route=k=>`/${k}/${direct?'direct/':''}`;
 const sections=['experience','projects','faq','contact'].map(id=>`<a href="${sectionPrefix}#${id}">${e(u[id])}</a>`).join('');

 const languageOptions=[['pt-br','PT','🇧🇷','Português'],['en','EN','🇬🇧','English'],['es','ES','🇪🇸','Español']];
 const languageName=languageOptions.find(([k])=>k===key)[3];
 const languages=languageOptions.map(([k,t,flag,name])=>`<a href="${route(k)}" lang="${contentLang(k)}" aria-label="${name}" ${k===key?'aria-current="page"':''}><span class="language-flag" aria-hidden="true">${flag}</span><span>${t}</span></a>`).join('');
 return `<a class="skip" href="#main">${e(c.ui.skip)}</a><header class="site-header"><a class="wordmark" href="/${key}/" aria-label="João Victor · ojoaovsousa"><img class="header-character" src="/jovi-poster.webp" alt="" width="36" height="40" decoding="async">ojoaovsousa</a><nav class="main-nav" aria-label="${e(u.chapter)}">${sections}</nav><div class="header-actions"><details class="language-picker"><summary aria-label="${e(c.ui.language)}: ${e(languageName)}"><span class="language-flag" aria-hidden="true">${e(c.flag)}</span><span class="language-current" aria-hidden="true">${e(c.short)}</span></summary><div>${languages}</div></details>${themeToggle(key)}${isHome?`<button type="button" data-inquiry class="button header-contact" aria-label="${e(inquiryCtaCopy[key].question)}" title="${e(inquiryCtaCopy[key].idea)}">`:`<a href="${sectionPrefix}#contact" class="button header-contact" aria-label="${e(inquiryCtaCopy[key].idea)}">`}<span class="header-contact-label">${e(inquiryCtaCopy[key].idea)}</span><svg class="header-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2V12a9 9 0 1 1 18-.5Z"/></svg>${isHome?'</button>':'</a>'}${btn('data-menu aria-expanded="false" aria-controls="mobile-menu" aria-label="'+e(c.ui.menu)+'"','☰','icon-button menu-toggle')}</div><nav id="mobile-menu" hidden aria-label="${e(c.ui.menu)}">${sections}<div class="mobile-languages" aria-label="${e(c.ui.language)}">${languages}</div></nav></header>`;
}
const contentLang=k=>k==='pt-br'?'pt-BR':k==='en'?'en-GB':'es';
export function socialIcon(kind){
 if(kind!=='mail')return `<img class="social-brand-icon social-brand-${kind}" src="/${kind==='github'?'technology-icons':'contact-icons'}/${kind}.svg" alt="" aria-hidden="true" width="24" height="24" loading="lazy" decoding="async">`;
 return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
}
export function projectLogo(item,{className='project-logo',symbol=false}={}){
 const hor=item.id==='horagora',base=hor?'horagora-logo':symbol?'asc-symbol':'asc-logo';
 const crop=symbol&&hor?' viewer-horagora-symbol':'';
 return `<span class="brand-image ${className}${crop}" aria-hidden="true"><img class="brand-light" src="/${base}.svg" alt="" width="${hor?1134:symbol?1000:1220}" height="${hor?266:symbol?1000:400}" loading="lazy" decoding="async"><img class="brand-dark" src="/${base}-dark.svg" alt="" width="${hor?1134:symbol?1000:1220}" height="${hor?266:symbol?1000:400}" loading="lazy" decoding="async"></span>`;
}
export function contactLinks(c,{dialog=false}={}){
 const q=c.inquiry,email='jovi47profissional@gmail.com';
 const address=`<a class="contact-channel" href="mailto:${email}">${socialIcon('mail')}<span>${dialog?`<strong>${e(q.email)}</strong><span class="contact-email-address" data-contact-email tabindex="-1">${email}</span>`:email}</span></a>`;
 const copy=dialog?`<button type="button" class="contact-copy button-secondary" data-copy-email="${email}" data-copied="${e(q.copied)}" data-copy-failed="${e(q.copyFailed)}" aria-label="${e(q.copyEmail)}">${e(q.copy)}</button>`:'';
 return `<div class="contact-links${dialog?' contact-channels':''}"><a class="contact-channel${dialog?' button contact-channel-primary':''}" href="https://wa.me/5579998230872" target="_blank" rel="noopener noreferrer">${socialIcon('whatsapp')}<span>${e(c.contact.whatsapp)}</span></a>${dialog?`<div class="contact-email-row">${address}${copy}</div>`:address}<a class="contact-channel" href="https://www.linkedin.com/in/jovi47/" target="_blank" rel="noopener noreferrer">${socialIcon('linkedin')}<span>LinkedIn</span></a></div>`;
}
export const inquiryCtaCopy={
 'pt-br':{idea:'Fale comigo',question:'Fale comigo: escolher canal de contato'},
 en:{idea:'Let’s talk',question:'Let’s talk: choose a contact channel'},
 es:{idea:'Hablemos',question:'Hablemos: elegir canal de contacto'},
};
export function inquiryCta(key,{gated=false}={}){
 const v=inquiryCtaCopy[key];
 return `<button type="button" class="viewer-contact-fab inquiry-cta${gated?' viewer-interactive':''}" data-inquiry-cta ${gated?'disabled data-question ':''}data-inquiry aria-label="${e(v.question)}" title="${e(v.question)}"><span class="viewer-contact-label">${e(v.idea)}</span><svg class="inquiry-cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2V12a9 9 0 1 1 18-.5Z"/></svg></button>`;
}
export const footer=(c,key,variant='island')=>`<footer class="site-footer"><a class="footer-name" href="/${key}/#main" aria-label="João Victor · ojoaovsousa">ojoaovsousa</a><nav class="footer-socials" aria-label="${localized(key,'Redes e contato','Social and contact','Redes y contacto')}">${[['github','https://github.com/jovi47','GitHub'],['linkedin','https://www.linkedin.com/in/jovi47/','LinkedIn'],['whatsapp','https://wa.me/5579998230872','WhatsApp'],['mail','mailto:jovi47profissional@gmail.com','E-mail']].map(([kind,url,label])=>`<a href="${url}" aria-label="${label}" ${kind==='mail'?'':'target="_blank" rel="noopener noreferrer"'}>${socialIcon(kind)}<span>${label}</span></a>`).join('')}</nav><div class="footer-legal"><span>© 2026</span><a href="/${key}/privacy/">${e(c.ui.privacy)}</a><a href="/${key}/terms/">${e(c.ui.terms)}</a><a href="/${key}/direct/">${localized(key,'Ler sem 3D','Read without 3D','Leer sin 3D')}</a></div></footer>`;
export function inquiry(c,key){
 const q=c.inquiry;
 return `<dialog id="inquiry-dialog" class="contact-dialog" aria-labelledby="inquiry-title"><div class="dialog-top"><span>João Victor</span>${btn('data-close aria-label="'+e(c.ui.close)+'"','×','icon-button')}</div><h2 id="inquiry-title">${e(q.title)}</h2><p>${e(q.description)}</p><nav aria-label="${e(q.channels)}">${contactLinks(c,{dialog:true})}</nav><p class="contact-copy-status small" data-contact-status role="status"></p><p class="small contact-dialog-note">${e(q.note)} <a href="/${key}/privacy/">${e(c.ui.privacy)}</a></p></dialog>`;
}
export function notFound(){
 return `<main id="main" class="not-found section-wrap" aria-labelledby="not-found-title">
 <a class="wordmark text-link" href="/pt-br/" aria-label="João Victor · ojoaovsousa">ojoaovsousa</a>
 <p class="eyebrow">404 / PÁGINA NÃO ENCONTRADA</p><h1 id="not-found-title">Página não encontrada.</h1>
 <p>Confira o endereço ou volte ao portfólio. Você também pode continuar sem o 3D.</p>
 <div class="panel-actions"><a class="button" href="/pt-br/">Voltar ao portfólio ↗</a><a class="text-link" href="/pt-br/direct/">Ler sem 3D</a></div>
 <div lang="en"><p>Page not found. Return to the portfolio.</p><a class="text-link" href="/en/">English →</a></div>
 <div lang="es"><p>Página no encontrada. Vuelve al portafolio.</p><a class="text-link" href="/es/">Español →</a></div></main>`;
}
export function policy(c,key,type){const p=c[type];return `${header(c,key)}<main id="main" class="policy" tabindex="-1"><a class="text-link" href="/${key}/">${e(c.ui.back)}</a><h1>${e(p.title)}</h1><p>${e(p.intro)}</p>${p.sections.map(s=>`<section><h2>${e(s.title)}</h2><p>${e(s.body)}</p></section>`).join('')}</main>${footer(c,key)}`;}
export function document(c,key,body,{base='',indexable=false,title=c.title,description=c.description,path='',canonicalPath=path,direct=false,viewer=false,variant='island'}={}){
 const url=base?`${base}/${key}/${canonicalPath}`:'';
 const discovery=canonicalPath===''?`<link rel="alternate" type="text/markdown" href="${base}/${key}/index.md"><link rel="describedby" href="/llms.txt">`:'';
 return `<!doctype html><html lang="${c.lang}" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><title>${e(title)}</title><meta name="description" content="${e(description)}"><meta name="robots" content="${indexable?'index, follow':'noindex, nofollow'}"><meta name="theme-color" content="#ff6b24"><meta property="og:type" content="website"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(description)}"><meta property="og:locale" content="${c.lang.replace('-','_')}">${base?`<meta property="og:image" content="${base}/og.png"><meta property="og:url" content="${url}"><link rel="canonical" href="${url}">${[['pt-br','pt-BR'],['en','en-GB'],['es','es']].map(([l,lang])=>`<link rel="alternate" hreflang="${lang}" href="${base}/${l}/${canonicalPath}">`).join('')}<link rel="alternate" hreflang="x-default" href="${base}/pt-br/${canonicalPath}">`:''}${discovery}<link rel="icon" href="/favicon.svg"><link rel="preload" href="/bricolage.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/${variant==='black'?'black':viewer?'viewer':'direct'}.css"><script type="module" src="/city-app.js"></script>${base&&canonicalPath===''?`<script type="application/ld+json">${structuredData(c,cityCopy[key].role,base,url)}</script>`:''}</head><body>${body}<div id="connection-status" class="connection-status" hidden>${localized(key,'Você está offline. Links externos precisam de conexão.','You are offline. External links need a connection.','Sin conexión. Los enlaces externos necesitan conexión.')}</div></body></html>`;
}
