const root=document.documentElement;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const readPreference=key=>{try{return localStorage.getItem(key);}catch{return null;}};
const savePreference=(key,value)=>{try{localStorage.setItem(key,value);}catch{/* Preferences are optional when storage is disabled. */}};
const themeButton=document.querySelector('#theme-toggle');
root.dataset.theme=readPreference('jovi-theme')==='light'?'light':'dark';
function updateTheme(){themeButton?.setAttribute('aria-pressed',String(root.dataset.theme==='light'));}
updateTheme();
themeButton?.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';savePreference('jovi-theme',root.dataset.theme);updateTheme();});
const motionButton=document.querySelector('#motion-toggle');
let userPaused=readPreference('jovi-motion')==='paused';
function updateMotion(){
 const paused=userPaused||motionQuery.matches;
 root.dataset.motion=paused?'paused':'running';
 motionButton?.setAttribute('aria-pressed',String(paused));
 if(motionButton)motionButton.setAttribute('aria-label',paused?motionButton.dataset.resume:motionButton.dataset.pause);
 document.dispatchEvent(new CustomEvent('motionchange',{detail:{paused}}));
}
updateMotion();
motionQuery.addEventListener('change',updateMotion);
motionButton?.addEventListener('click',()=>{userPaused=!userPaused;savePreference('jovi-motion',userPaused?'paused':'running');updateMotion();});
document.addEventListener('visibilitychange',()=>{root.classList.toggle('page-hidden',document.hidden);});
const menu=document.querySelector('#mobile-menu');
document.querySelector('#menu-toggle')?.addEventListener('click',event=>{menu.hidden=!menu.hidden;event.currentTarget.setAttribute('aria-expanded',String(!menu.hidden));});
menu?.addEventListener('click',event=>{if(event.target.closest('a')){menu.hidden=true;document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;document.querySelector('#menu-toggle').setAttribute('aria-expanded','false');document.querySelector('#menu-toggle').focus();}});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
document.querySelectorAll('[data-case]').forEach(button=>button.addEventListener('click',()=>document.getElementById(`case-${button.dataset.case}`)?.showModal()));
const track=document.querySelector('#work-track');
if(track){
 const cards=[...track.children],position=document.querySelector('#work-position');
 function current(){const max=track.scrollWidth-track.clientWidth;if(max<=2)return 0;if(track.scrollLeft>=max-3)return cards.length-1;if(track.scrollLeft<=3)return 0;return Math.round(track.scrollLeft/max*(cards.length-1));}
 function update(){const index=current();position.textContent=`0${index+1} / 0${cards.length}`;document.querySelector('[data-carousel="prev"]').disabled=index===0;document.querySelector('[data-carousel="next"]').disabled=index===cards.length-1;}
 document.querySelectorAll('[data-carousel]').forEach(button=>button.addEventListener('click',()=>{const next=Math.min(cards.length-1,Math.max(0,current()+(button.dataset.carousel==='next'?1:-1)));track.scrollTo({left:cards[next].offsetLeft-track.offsetLeft,behavior:root.dataset.motion==='paused'?'instant':'smooth'});}));
 track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
}
const reveals=document.querySelectorAll('[data-reveal]');
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('revealed');revealObserver.unobserve(entry.target);}},{threshold:.12});
reveals.forEach(item=>revealObserver.observe(item));
document.querySelectorAll('[data-replay]').forEach(button=>button.addEventListener('click',()=>{const studio=document.querySelector('.studio');studio.classList.remove('rebuild');void studio.offsetWidth;studio.classList.add('rebuild');const person=studio.querySelector('.brick-person');if(person)person.dataset.pose='celebrate';}));
document.querySelector('.studio')?.addEventListener('animationend',event=>{if(event.animationName==='assembly')document.querySelector('.studio .brick-person')?.setAttribute('data-pose','wave');});
const connection=document.querySelector('#connection-status');
const updateConnection=()=>{if(connection)connection.hidden=navigator.onLine;};
window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);updateConnection();
import('./game.js');
import('./guide.js');
