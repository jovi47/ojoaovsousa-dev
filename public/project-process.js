import {createProjectExamples} from './project-examples.js';
import {createProcessFlight} from './process-flight.js';
const instances=new WeakMap();

export function initProjectProcess(root=document){
 const blocks=root.matches?.('[data-project-process]')?[root]:[...root.querySelectorAll('[data-project-process]')],dispose=[];
 for(const block of blocks){
  if(instances.has(block))continue;
  const buttons=[...block.querySelectorAll('[data-process-step]')],logs=[...block.querySelectorAll('[data-process-log]')],lines=[...block.querySelectorAll('[data-process-line]')];
  const terminal=block.querySelector('[data-process-panel="terminal"]'),site=block.querySelector('[data-process-panel="site"]'),status=block.querySelector('[data-process-status]'),description=block.querySelector('[data-process-description]'),output=block.querySelector('.project-process-output');
  const terminalWindow=block.querySelector('[data-process-window="terminal"]'),siteWindow=block.querySelector('[data-process-window="site"]');
  if(buttons.length!==4||logs.length!==4||lines.length!==16||!terminal||!site||!status||!description||!output||!terminalWindow||!siteWindow)continue;
  const doc=block.ownerDocument,view=doc.defaultView,reduced=view.matchMedia('(prefers-reduced-motion: reduce)'),listeners=[];
  const examples=createProjectExamples(block);
  const flight=createProcessFlight(block);
  let timer=null,near=!view.IntersectionObserver,manual=false,disposed=false,count=0,phase=0;
  function listen(target,event,callback){target.addEventListener(event,callback);listeners.push(()=>target.removeEventListener(event,callback));}
  function stop(){if(timer!==null){view.clearTimeout(timer);timer=null;}}
  function syncMotion(){const visible=!disposed&&near&&!doc.hidden&&!reduced.matches,active=visible&&phase===4;block.dataset.processRunning=String(active);examples.setActive(active);flight.sync({count,active:visible&&!manual&&phase<4,reduced:reduced.matches});}
  function finish(){
   if(block.dataset.processFinished==='true')return;
   block.dataset.processFinished='true';doc.body.classList.add('project-process-complete');doc.dispatchEvent(new Event('projectprocesscomplete'));
  }
  function syncPanels(){
   terminal.hidden=terminalWindow.hidden=disposed;site.hidden=siteWindow.hidden=false;
   terminal.setAttribute('aria-hidden',String(terminal.hidden));site.setAttribute('aria-hidden',String(site.hidden));
  }
  function render(next,focus=false){
   phase=next;const index=Math.min(3,phase),finished=phase===4;
   block.dataset.processCurrent=String(index);block.dataset.processPhase=String(phase);block.dataset.processBuilt=String(Math.floor(count/4));
   buttons.forEach((button,i)=>{button.dataset.processComplete=String(count>=(i+1)*4);block.style.setProperty('--process-link-'+i,String(Math.max(0,Math.min(1,(count-i*4)/4))));button.setAttribute('aria-pressed',String(i===index));button.tabIndex=i===index?0:-1;if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
   syncPanels();logs.forEach((log,i)=>{log.hidden=i>index;});lines.forEach((line,i)=>{line.hidden=i>=count;});
   if(!terminal.hidden){if(count===0)output.scrollTop=0;else if(output.scrollHeight>output.clientHeight)output.scrollTop=output.scrollHeight-output.clientHeight;}
   syncMotion();
   status.textContent=finished?site.dataset.processComplete:buttons[index].dataset.processStatusText;
   description.innerHTML=buttons[index].querySelector('.project-process-description').innerHTML;description.hidden=false;
   if(focus)buttons[index].focus({preventScroll:true});
  }
  function schedule(delay=420){
   if(disposed||timer!==null||manual||reduced.matches||!near||doc.hidden||phase===4)return;
   timer=view.setTimeout(()=>{
    timer=null;if(disposed||!near||doc.hidden)return;
    if(count===lines.length){render(4);finish();return;}
    count++;render(Math.floor((count-1)/4));schedule();
   },delay);
  }
  function choose(index,focus=false){manual=true;stop();count=(index+1)*4;render(index===3?4:index,focus);if(phase===4)finish();}
  buttons.forEach((button,index)=>{
   listen(button,'click',()=>choose(index));
   listen(button,'keydown',event=>{const next=event.key==='Home'?0:event.key==='End'?3:['ArrowDown','ArrowRight'].includes(event.key)?(index+1)%4:['ArrowUp','ArrowLeft'].includes(event.key)?(index+3)%4:null;if(next===null)return;event.preventDefault();choose(next,true);});
  });
  listen(doc,'visibilitychange',()=>{if(doc.hidden)stop();else schedule();syncMotion();});
  listen(view,'resize',()=>flight.resize());
  listen(reduced,'change',()=>{if(reduced.matches){stop();count=lines.length;render(4);if(near)finish();}else schedule();syncMotion();});
  const observer=view.IntersectionObserver?new view.IntersectionObserver(entries=>{for(const entry of entries){near=entry.isIntersecting&&entry.intersectionRatio>=.25;if(near){if(reduced.matches&&phase===4)finish();schedule(count?420:400);}else{stop();if(!entry.isIntersecting&&!reduced.matches){manual=false;count=0;render(0);}}syncMotion();}},{threshold:[0,.25]}):null;
  observer?.observe(block);if(reduced.matches)count=lines.length;render(reduced.matches?4:0);block.dataset.processEnhanced='true';flight.resize();if(reduced.matches){if(near)finish();}else schedule(400);
  const cleanup=()=>{if(disposed)return;disposed=true;stop();examples.destroy();flight.destroy();observer?.disconnect();for(const remove of listeners)remove();count=lines.length;render(4);description.hidden=true;delete block.dataset.processEnhanced;delete block.dataset.processFinished;delete block.dataset.processRunning;doc.body.classList.remove('project-process-complete');instances.delete(block);};
  instances.set(block,cleanup);dispose.push(cleanup);
 }
 return ()=>{for(const cleanup of dispose)cleanup();};
}
