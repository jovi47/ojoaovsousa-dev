import {initContactChannels} from './contact-channels.js';
import {initProjectProcess} from './project-process.js';
import {initTechnologyMarquee} from './technology-marquee.js';
import {initViewerOverflow} from './viewer-overflow.js';
const disposeProjectProcess=initProjectProcess();
const disposeTechnologyMarquee=initTechnologyMarquee();
const disposeViewerOverflow=initViewerOverflow();
const body=document.body;
function syncInquiryAvailability(){if(body.classList.contains('reading')||body.classList.contains('graphics-failed'))for(const button of document.querySelectorAll('.inquiry-cta[data-question]'))button.disabled=false;}
const menu=document.querySelector('#mobile-menu'),menuToggle=document.querySelector('[data-menu]');
menuToggle?.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuToggle.setAttribute('aria-expanded',String(!menu.hidden));});
for(const a of menu?.querySelectorAll('a')||[])a.addEventListener('click',()=>{menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');});
// Keep native disclosure state while its text spans below both stable actions.
function openExperience(){if(location.hash==='#experience')document.querySelector('#experience .career-details')?.setAttribute('open','');}
for(const link of document.querySelectorAll('a[href$="#experience"]'))link.addEventListener('click',()=>{if(new URL(link.href,location.href).pathname===location.pathname)document.querySelector('#experience .career-details')?.setAttribute('open','');});
window.addEventListener('hashchange',openExperience);openExperience();
for(const details of document.querySelectorAll('.project-detail')){
 const content=details.querySelector('.project-detail-content'),actions=details.closest('.project-actions'),summary=details.querySelector('summary');
 if(!content||!actions||!summary)continue;
 actions.after(content);
 const sync=()=>{content.hidden=!details.open;summary.setAttribute('aria-expanded',String(details.open));};
 sync();details.addEventListener('toggle',sync);
}
const dialog=document.querySelector('#inquiry-dialog'),contactStatus=dialog?.querySelector('[data-contact-status]');
const labels=JSON.parse(document.querySelector('#world-data')?.textContent||'{}');
initContactChannels(dialog);
let focusBeforeDialog=null;
function openInquiry(button){if(!dialog)return;document.dispatchEvent(new Event('citypause'));focusBeforeDialog=button;if(contactStatus)contactStatus.textContent='';if(!dialog.open)dialog.showModal();}
for(const button of document.querySelectorAll('[data-inquiry]'))button.addEventListener('click',()=>openInquiry(button));
for(const button of document.querySelectorAll('[data-close]'))button.addEventListener('click',()=>button.closest('dialog')?.close());
dialog?.addEventListener('close',()=>{document.dispatchEvent(new CustomEvent('citydialog',{detail:false}));const target=[focusBeforeDialog,...document.querySelectorAll('.viewer-contact-fab:not(:disabled),[data-skip-build],.chapter.active button,.direct-contact [data-inquiry]')].find(node=>node?.checkVisibility());target?.focus({preventScroll:true});});
const connection=document.querySelector('#connection-status');
function online(){if(connection)connection.hidden=navigator.onLine;}
window.addEventListener('online',online);window.addEventListener('offline',online);online();
const residentDialog=document.querySelector('#resident-dialog');
let residentFocus=null;
function openResident(id,button){
 if(!residentDialog)return;
 const identity=id==='horagora'?'hori':id.startsWith('visitor')?'visitor':id;
 const story=labels.stories?.[identity]||labels.stories?.visitor;if(!story)return;
 residentFocus=button||document.querySelector('[data-orbit]');
 document.dispatchEvent(new CustomEvent('citydialog',{detail:true}));
 residentDialog.querySelector('#resident-title').textContent=story[0];
 residentDialog.querySelector('[data-resident-kind]').textContent=labels.scene;
 residentDialog.querySelector('[data-resident-speech]').textContent=story[1];
 const image=residentDialog.querySelector('[data-resident-image]');
 image.hidden=!['hori','andrea'].includes(identity);image.src=identity==='hori'?'/hori.webp':'/andrea-minifigure.png';image.alt=story[0];
 const project=residentDialog.querySelector('[data-resident-project]');
 const urls={hori:'https://horagora.com.br',andrea:'https://andreasousaconsultoria.com.br',technologies:location.pathname.replace(/\/$/,'')+'/direct/#experience'};
 project.hidden=!urls[identity];if(urls[identity])project.href=urls[identity];
 if(!residentDialog.open)residentDialog.showModal();
}
for(const button of document.querySelectorAll('[data-resident],[data-place]'))button.addEventListener('click',()=>openResident(button.dataset.resident||button.dataset.place,button));
residentDialog?.addEventListener('close',()=>{document.dispatchEvent(new CustomEvent('citydialog',{detail:false}));residentFocus?.focus({preventScroll:true});});
if('IntersectionObserver' in window){
 const revealTargets=[...document.querySelectorAll('.viewer-intro,.direct-section-intro,.direct-expertise>div,.technology-marquee,.direct-case-copy,[data-project-mockup],.direct-case-end,.direct-about>h2,.direct-about-portrait,.direct-about-copy>p,.career-intro,.career-details,.faq-intro,.faq-item,.project-process-steps,.project-process-preview,.direct-contact-content>div,.site-footer')];
 revealTargets.forEach((node,i)=>{node.dataset.scrollReveal=['up','left','down','right'][i%4];});
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){
  if(entry.target.dataset.scrollReveal){if(entry.isIntersecting&&entry.intersectionRatio>=.08)entry.target.classList.add('is-revealed');else if(!entry.isIntersecting)entry.target.classList.remove('is-revealed');}
  if(entry.target.id==='contact')body.classList.toggle('contact-visible',entry.isIntersecting);
  else if(entry.target.matches('.viewer-houses'))body.classList.toggle('viewer-controls-visible',entry.isIntersecting);
  else if(entry.target.matches('[data-project-mockup],[data-inquiry-cta]'))entry.target.classList.toggle('is-visible',entry.isIntersecting);
 }},{threshold:[0,.08,.1]});
 for(const block of new Set([...revealTargets,...document.querySelectorAll('[data-project-mockup],[data-inquiry-cta],#contact,.viewer-houses')]))observer.observe(block);
 window.addEventListener('pagehide',event=>{if(!event.persisted)observer.disconnect();});
}
document.addEventListener('visibilitychange',()=>body.classList.toggle('page-hidden',document.hidden));

let world=null,starting=false;
function applySeason(){document.body.dataset.season='spring';world?.setSeason?.('spring');}
let canvas=document.querySelector('#city-canvas');
const worldStatus=document.querySelector('#world-status');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function reading(value){
 if(value)document.dispatchEvent(new Event('citypause'));
 body.classList.toggle('reading',value);
 syncInquiryAvailability();
 for(const button of document.querySelectorAll('[data-reading]')){button.setAttribute('aria-pressed',String(value));button.textContent=value?labels.immersive:labels.read;}
 world?.setReading(value);
 if(value)for(const panel of document.querySelectorAll('.chapter')){panel.inert=false;panel.removeAttribute('aria-hidden');}
 if(!value&&!world)start();
 if(menu&&!menu.hidden){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');}
}
function failWorld(error){
 console.error('World unavailable:',error);
 const previous=world;world=null;
 body.classList.add('graphics-failed');body.classList.remove('immersive','world-loaded','construction-started','tour-complete','is-building');
 worldStatus.textContent=labels.fallback;document.querySelectorAll('[data-retry]').forEach(button=>button.hidden=false);reading(true);
 try{previous?.dispose();}catch(disposalError){console.error('World cleanup failed:',disposalError);}
 // A lost context remains attached to its canvas even after renderer disposal.
 const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);canvas=replacement;
}
document.addEventListener('cityreading',()=>failWorld(new Error('WebGL context lost')));
for(const link of document.querySelectorAll('[data-read-projects]'))link.addEventListener('click',()=>{if(canvas){reading(true);document.querySelectorAll('[data-retry]').forEach(button=>button.hidden=false);}});
for(const button of document.querySelectorAll('[data-reading]'))button.addEventListener('click',()=>{
 const id=document.querySelector('.chapter.active')?.id||'intro';reading(!body.classList.contains('reading'));
 requestAnimationFrame(()=>{if(body.classList.contains('reading'))document.getElementById(id)?.scrollIntoView();else world?.goTo(id);});
});
async function start(){
 if(!canvas||starting||world)return;starting=true;
 let timer;
 try{
  const module=await Promise.race([import('./city.js'),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('World module timed out')),10000);})]);
  world=await module.createCity(canvas,labels,openInquiry,openResident);
  body.classList.add('immersive','world-loaded');body.classList.remove('graphics-failed');
  worldStatus.textContent=reduced.matches?labels.reduced:canvas.dataset.exploreReady==='false'?labels.constructionStack:(labels.readySea||labels.ready);
  document.querySelectorAll('[data-retry]').forEach(button=>button.hidden=true);
  applySeason();world.setReading(body.classList.contains('reading'));const hash=location.hash.slice(1);if(hash||!body.classList.contains('mobile-entry'))world.goTo(hash||'intro');
 }catch(error){
  failWorld(error);
 }finally{clearTimeout(timer);starting=false;}
}
for(const button of document.querySelectorAll('[data-retry]'))button.addEventListener('click',async()=>{
 await start();
 if(world){reading(false);canvas.focus({preventScroll:true});document.querySelector('.viewer-board')?.scrollIntoView({behavior:'instant',block:'start'});}
});
if(canvas){if(reduced.matches){reading(true);worldStatus.textContent=labels.reduced;}else start();}
window.addEventListener('pagehide',event=>{if(!event.persisted){world?.dispose();disposeProjectProcess();disposeTechnologyMarquee();disposeViewerOverflow();}});
