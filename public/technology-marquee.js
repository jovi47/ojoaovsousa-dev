const instances=new WeakMap();

export function initTechnologyMarquee(root=document){
 const blocks=root.matches?.('[data-technology-marquee]')?[root]:[...root.querySelectorAll('[data-technology-marquee]')],cleanups=[];
 for(const block of blocks){
  if(instances.has(block))continue;
  const doc=block.ownerDocument,view=doc.defaultView;
  if(!view.IntersectionObserver)continue;
  const reduced=view.matchMedia('(prefers-reduced-motion: reduce)');
  let visible=false,disposed=false;
  function sync(){
   if(disposed)return;
   block.classList.toggle('is-running',visible&&!doc.hidden&&!reduced.matches);
  }
  const observer=new view.IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);sync();},{threshold:.05});
  observer.observe(block);doc.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
  block.dataset.techEnhanced='true';sync();
  const cleanup=()=>{
   disposed=true;observer.disconnect();doc.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);
   block.classList.remove('is-running');delete block.dataset.techEnhanced;instances.delete(block);
  };
  instances.set(block,cleanup);cleanups.push(cleanup);
 }
 return ()=>{for(const cleanup of cleanups)cleanup();};
}
