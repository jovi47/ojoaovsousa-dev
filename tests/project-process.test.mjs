import {createProjectExamples} from '../public/project-examples.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderProjectProcess} from '../src/project-process.mjs';
import {initProjectProcess} from '../public/project-process.js';

class Target extends EventTarget{
 listeners=new Map();
 addEventListener(type,callback,options){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(callback);super.addEventListener(type,callback,options);}
 removeEventListener(type,callback,options){this.listeners.get(type)?.delete(callback);super.removeEventListener(type,callback,options);}
 get listenerCount(){return [...this.listeners.values()].reduce((count,listeners)=>count+listeners.size,0);}
}

function fixture({home=true,reduced=false,desktop=false}={}){
 const observers=[],timers=new Map(),scrolls=[],classes=new Set(),style=new Map();
 let now=0,timerId=0,completions=0;
 const reducedMedia=Object.assign(new Target(),{matches:reduced});
 const desktopMedia=Object.assign(new Target(),{matches:desktop});
 const view=Object.assign(new Target(),{Event,matchMedia:query=>query==='(min-width: 960px)'?desktopMedia:reducedMedia,scrollTo:options=>scrolls.push(options)});
 view.setTimeout=(callback,delay)=>{const id=++timerId;timers.set(id,{callback,at:now+delay});return id;};
 view.clearTimeout=id=>timers.delete(id);
 view.IntersectionObserver=class{
  constructor(callback,options){this.callback=callback;this.options=options;this.targets=[];this.disconnected=false;observers.push(this);}
  observe(node){this.targets.push(node);}
  disconnect(){this.disconnected=true;}
 };
 const doc=Object.assign(new Target(),{defaultView:view,hidden:false,body:{classList:{contains:name=>classes.has(name),add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name))}}});
 doc.addEventListener('projectprocesscomplete',()=>completions++);
 class Button extends Target{
  constructor(index){super();this.dataset={processStep:String(index),processStatusText:'Stage '+(index+1)};this.attributes=new Map();this.description={textContent:'Description '+(index+1),innerHTML:'Description '+(index+1)};this.focused=false;this.tabIndex=0;}
  setAttribute(name,value){this.attributes.set(name,value);}
  removeAttribute(name){this.attributes.delete(name);}
  querySelector(selector){return selector==='.project-process-description'?this.description:null;}
  focus(options){this.focused=true;this.focusOptions=options;}
  click(){this.dispatchEvent(new Event('click'));}
  key(value){const event=new Event('keydown',{cancelable:true});Object.defineProperty(event,'key',{value});this.dispatchEvent(event);return event;}
 }
 const buttons=Array.from({length:4},(_,index)=>new Button(index));
 const logs=buttons.map((_,stage)=>{
  const lines=Array.from({length:4},(_,index)=>({hidden:false,dataset:{processLine:String(index)},textContent:'Stage '+stage+' line '+index}));
  return {hidden:true,dataset:{processLog:String(stage)},lines,querySelectorAll:selector=>selector==='[data-process-line]'?lines:[]};
 });
 const status={textContent:'Online example'},description={hidden:true,textContent:'Description 4',set innerHTML(value){this.textContent=value.replace(/<[^>]*>/g,'');this.html=value;}},terminal={hidden:true,setAttribute(name,value){this[name]=value;}},site={hidden:false,dataset:{processComplete:'Online example'},setAttribute(name,value){this[name]=value;}},pin={};
 const output={clientHeight:200,position:0,writes:[],get scrollHeight(){return visibleLines()*22+20;},get scrollTop(){return this.position;},set scrollTop(value){this.position=value;this.writes.push(value);}};
 const terminalWindow={hidden:true},siteWindow={hidden:false};
 const nodes={'[data-process-window="terminal"]':terminalWindow,'[data-process-window="site"]':siteWindow,'[data-process-pin]':pin,'[data-process-panel="terminal"]':terminal,'[data-process-panel="site"]':site,'[data-process-status]':status,'[data-process-description]':description,'.project-process-output':output};
 const block={dataset:{processCurrent:'3',processPhase:'4'},ownerDocument:doc,
  style:{setProperty:(key,value)=>style.set(key,value),getPropertyValue:key=>style.get(key)||'',removeProperty:key=>style.delete(key)},
  matches:selector=>selector==='[data-project-process]',closest:selector=>selector==='.viewer-reading'&&home?{}:selector==='.direct-page'&&!home?{}:null,
  querySelector:selector=>nodes[selector]||null,querySelectorAll:selector=>selector==='[data-process-step]'?buttons:selector==='[data-process-log]'?logs:selector==='[data-process-line]'?logs.flatMap(log=>log.lines):[],
  getClientRects:()=>[{}]};
 const root={querySelectorAll:selector=>selector==='[data-project-process]'?[block]:[]};
 function tick(ms){
  const end=now+ms;
  for(let count=0;count<1000;count++){
   const next=[...timers.entries()].filter(([,timer])=>timer.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];
   if(!next){now=end;return;}
   const [id,timer]=next;timers.delete(id);now=timer.at;timer.callback();
  }
  assert.fail('timer did not yield');
 }
 function intersect(isIntersecting,intersectionRatio=isIntersecting?1:0){observers[0]?.callback([{target:block,isIntersecting,intersectionRatio}]);}
 function visibility(hidden){doc.hidden=hidden;doc.dispatchEvent(new Event('visibilitychange'));}
 function motion(matches){reducedMedia.matches=matches;reducedMedia.dispatchEvent(new Event('change'));}
 function resize(matches){desktopMedia.matches=matches;desktopMedia.dispatchEvent(new Event('change'));}
 function visibleLines(){return logs.reduce((count,log)=>count+(log.hidden?0:log.lines.filter(line=>!line.hidden).length),0);}
 return {root,block,buttons,logs,status,description,terminal,site,terminalWindow,siteWindow,resize,desktopMedia,output,view,doc,reducedMedia,observers,timers,classes,style,scrolls,tick,intersect,visibility,motion,visibleLines,get completions(){return completions;}};
}

test('localised stages preserve sixteen log lines and a clearly fictional static website without JS',()=>{
 for(const [key,labels] of Object.entries({'pt-br':['Sua ideia','Análise','Orçamento','Implementação'],en:['Your idea','Analysis','Proposal','Implementation'],es:['Tu idea','Análisis','Presupuesto','Implementación']})){
  const html=renderProjectProcess(key);
  assert.equal((html.match(/data-process-step=/g)||[]).length,4);
  assert.equal((html.match(/class="project-process-description"/g)||[]).length,4);
  const logs=[...html.matchAll(/<div\b[^>]*data-process-log="(\d)"[^>]*>([\s\S]*?)<\/div>/g)];
  assert.deepEqual(logs.map(match=>match[1]),['0','1','2','3']);
  for(const log of logs)assert.equal((log[2].match(/\bdata-process-line(?:\s|=|>)/g)||[]).length,4);
  assert.equal((html.match(/\bdata-process-line(?:\s|=|>)/g)||[]).length,16);
  for(const label of labels)assert.ok(html.includes(label));
  assert.match(html,/ilustrativ|illustrative/i);
  assert.match(html,/Estúdio fictício|Fictional studio|Estudio ficticio/);
  assert.match(html,/class="project-process-site-brand">forma<\/span>/);
  assert.match(html,/Espaços com intenção|Spaces with intention|Espacios con intención/);
  assert.match(html,/class="project-process-site-art"[^>]*aria-hidden="true"/);
  assert.match(html,/class="project-process-site-services"/);
  const example=html.slice(html.indexOf('data-process-panel="site"'));
  assert.match(example,/<span class="project-process-site-cta">/);
  assert.doesNotMatch(example,/<(?:a|button|input|form)\b|href=|onclick=|tabindex=/);
  assert.doesNotMatch(html,/project-process-delivery-mark|project-process-runner|process-dino|Seu site implementado|Your website implemented|Tu sitio web implementado/);
  assert.match(html,/data-process-phase="4"/);assert.equal((html.match(/data-process-window=/g)||[]).length,2);assert.match(html,/data-process-built="4"/);assert.match(html,/data-process-panel="terminal" hidden/);
  assert.doesNotMatch(html,/data-process-panel="site"[^>]*\bhidden/);
  assert.doesNotMatch(html,/data-process-replay/);
  assert.match(html,/aria-live="polite"/);assert.equal((html.match(/type="button"/g)||[]).length,4);
  assert.doesNotMatch(html,/\bid=|<(?:iframe|img|video|form)\b|https?:\/\/|↗/);
  assert.doesNotMatch(html,/\bstyle=/, 'preview remains compatible with production CSP');
 }
});

test('logs grow down from the top and only scroll after the fixed output area is actually full',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);f.intersect(true);
 f.output.writes.length=0;f.tick(400+7*420);assert.equal(f.visibleLines(),8);assert.deepEqual(f.output.writes,[]);
 f.tick(420);assert.equal(f.visibleLines(),9);assert.equal(f.output.scrollTop,18);
 f.tick(420);assert.equal(f.output.scrollTop,40);
 f.intersect(false);assert.equal(f.output.scrollTop,0);cleanup();
});

test('completed-preview motion eligibility follows visibility and preference and cleans up its state',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);f.intersect(true);assert.equal(f.block.dataset.processRunning,'false');
 f.buttons[3].click();assert.equal(f.block.dataset.processRunning,'true');assert.equal(f.terminal['aria-hidden'],'true');assert.equal(f.site['aria-hidden'],'false');
 f.intersect(true,.24);assert.equal(f.block.dataset.processRunning,'false');f.intersect(true,.25);assert.equal(f.block.dataset.processRunning,'true');
 f.visibility(true);assert.equal(f.block.dataset.processRunning,'false');f.visibility(false);assert.equal(f.block.dataset.processRunning,'true');
 f.motion(true);assert.equal(f.block.dataset.processRunning,'false');f.motion(false);assert.equal(f.block.dataset.processRunning,'true');cleanup();assert.equal(f.block.dataset.processRunning,undefined);
});

test('the preview keeps a fixed viewport, top-aligned output and opacity-only line appearance',async()=>{
 const css=await readFile(new URL('../public/project-process.css',import.meta.url),'utf8');
 assert.match(css,/\.project-process-output\{[^}]*justify-content:flex-start/);
 assert.doesNotMatch(css,/justify-content:flex-end/);
 assert.match(css,/@keyframes process-line-in\{from\{opacity:0\}to\{opacity:1\}\}/);
 assert.match(css,/transition:opacity \.25s/);
 assert.doesNotMatch(css,/process-dino|project-process-runner/);
});

test('home and direct start only at 25% visibility and reveal sixteen timed lines before the final site',()=>{
 for(const home of [true,false]){
  const f=fixture({home}),cleanup=initProjectProcess(f.root);
  assert.equal(f.block.dataset.processPhase,'0');assert.equal(f.visibleLines(),0);assert.equal(f.timers.size,0);
  assert.equal(f.block.dataset.processPinned,undefined);assert.equal(f.style.has('--process-track-height'),false);
  assert.equal(f.site.hidden,true);assert.equal(f.terminal.hidden,false);
  assert.equal(f.observers.length,1);assert.deepEqual(f.observers[0].targets,[f.block]);
  f.intersect(true,.24);f.intersect(false,1);assert.equal(f.timers.size,0);
  f.intersect(true,.25);f.intersect(true,.8);assert.equal(f.timers.size,1);
  f.tick(399);assert.equal(f.visibleLines(),0);
  f.tick(1);assert.equal(f.visibleLines(),1);assert.equal(f.block.dataset.processPhase,'0');
  for(let line=2;line<=16;line++){
   f.tick(419);assert.equal(f.visibleLines(),line-1);
   f.tick(1);assert.equal(f.visibleLines(),line);assert.equal(f.timers.size,1);
   if([5,9,13].includes(line))assert.equal(f.block.dataset.processPhase,String(Math.floor((line-1)/4)));
  }
  assert.equal(f.block.dataset.processPhase,'3');assert.equal(f.site.hidden,true);assert.equal(f.completions,0);
  f.tick(419);assert.equal(f.site.hidden,true);
  f.tick(1);assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.site.hidden,false);assert.equal(f.terminal.hidden,true);assert.equal(f.status.textContent,'Online example');
  assert.equal(f.block.dataset.processFinished,'true');assert.ok(f.classes.has('project-process-complete'));assert.equal(f.completions,1);assert.equal(f.timers.size,0);
  f.intersect(true);f.tick(10000);assert.equal(f.completions,1);assert.equal(f.timers.size,0);
  assert.equal(f.view.listeners.get('scroll')?.size||0,0);assert.equal(f.scrolls.length,0);assert.equal(f.block.dataset.processPinned,undefined);assert.equal(f.style.has('--process-track-height'),false);
  cleanup();
 }
});

test('leaving the viewport or hiding the document cancels work and resumes from the same line',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);
 f.intersect(true);f.tick(400);f.tick(420);assert.equal(f.visibleLines(),2);
 f.intersect(true,.24);assert.equal(f.timers.size,0);f.tick(10000);assert.equal(f.visibleLines(),2);
 f.intersect(true,.25);assert.equal(f.timers.size,1);f.tick(420);assert.equal(f.visibleLines(),3);
 f.visibility(true);assert.equal(f.timers.size,0);f.tick(10000);assert.equal(f.visibleLines(),3);
 f.visibility(false);assert.equal(f.timers.size,1);f.tick(420);assert.equal(f.visibleLines(),4);
 f.intersect(false);assert.equal(f.block.dataset.processPhase,'0');assert.equal(f.visibleLines(),0);assert.equal(f.timers.size,0);
 f.intersect(true);f.tick(399);assert.equal(f.visibleLines(),0);f.tick(1);assert.equal(f.visibleLines(),1);
 cleanup();
});

test('only a full exit restarts autoplay; manual selection and the completion latch survive partial visibility changes',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);
 f.intersect(true);f.buttons[2].click();assert.equal(f.block.dataset.processPhase,'2');assert.equal(f.visibleLines(),12);assert.equal(f.timers.size,0);
 f.intersect(true,.24);f.intersect(true,.8);f.visibility(true);f.visibility(false);f.tick(10000);assert.equal(f.visibleLines(),12);assert.equal(f.timers.size,0);
 f.intersect(false);assert.equal(f.block.dataset.processPhase,'0');assert.equal(f.visibleLines(),0);assert.equal(f.timers.size,0);
 f.intersect(true);f.tick(400);assert.equal(f.visibleLines(),1);
 f.buttons[3].click();assert.equal(f.site.hidden,false);assert.equal(f.block.dataset.processFinished,'true');assert.equal(f.completions,1);
 f.intersect(true,.24);assert.equal(f.site.hidden,false);f.intersect(false);assert.equal(f.block.dataset.processPhase,'0');assert.equal(f.site.hidden,true);
 assert.equal(f.block.dataset.processFinished,'true');assert.ok(f.classes.has('project-process-complete'));
 f.intersect(true);f.tick(400);assert.equal(f.visibleLines(),1);f.tick(16*420);assert.equal(f.site.hidden,false);assert.equal(f.completions,1);cleanup();
});

test('keyboard selection keeps roving focus, supports Home and End, and never scrolls the page',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);
 assert.equal(f.buttons[0].key('Tab').defaultPrevented,false);
 assert.equal(f.buttons[0].key('ArrowRight').defaultPrevented,true);assert.equal(f.block.dataset.processPhase,'1');assert.equal(f.visibleLines(),8);
 assert.deepEqual(f.buttons.map(button=>button.tabIndex),[-1,0,-1,-1]);assert.deepEqual(f.buttons[1].focusOptions,{preventScroll:true});
 assert.equal(f.buttons[1].key('End').defaultPrevented,true);assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.site.hidden,false);assert.ok(f.buttons[3].focused);
 f.buttons[3].key('Home');assert.equal(f.block.dataset.processPhase,'0');assert.equal(f.visibleLines(),4);
 f.buttons[0].key('ArrowLeft');assert.equal(f.block.dataset.processPhase,'4');assert.deepEqual(f.buttons.map(button=>button.tabIndex),[-1,-1,-1,0]);
 f.buttons[3].key('ArrowDown');assert.equal(f.block.dataset.processPhase,'0');
 assert.equal(f.scrolls.length,0);assert.equal(f.timers.size,0);cleanup();
});

test('reduced motion starts at the final site and never restarts on visibility changes',()=>{
 for(const home of [true,false]){
  const f=fixture({home,reduced:true}),cleanup=initProjectProcess(f.root);
  assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.site.hidden,false);assert.equal(f.terminal.hidden,true);assert.equal(f.timers.size,0);
  assert.ok(f.buttons.every(button=>button.dataset.processComplete==='true'));assert.equal(f.style.get('--process-link-0'),'1');
  assert.equal(f.block.dataset.processFinished,undefined);assert.equal(f.classes.has('project-process-complete'),false);
  assert.equal(f.completions,0);f.intersect(true,.24);assert.equal(f.completions,0);f.intersect(true,.25);assert.equal(f.completions,1);assert.equal(f.block.dataset.processFinished,'true');assert.ok(f.classes.has('project-process-complete'));f.tick(10000);assert.equal(f.timers.size,0);
  f.buttons[1].click();assert.equal(f.block.dataset.processPhase,'1');assert.equal(f.visibleLines(),8);assert.equal(f.timers.size,0);
  f.intersect(false);f.intersect(true);f.tick(10000);assert.equal(f.timers.size,0);assert.equal(f.block.dataset.processPhase,'1');cleanup();
 }
});

test('a motion preference change stops a running timer and shows the completed site immediately',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);
 f.intersect(true);f.tick(400);assert.equal(f.visibleLines(),1);assert.equal(f.timers.size,1);
 f.motion(true);assert.equal(f.timers.size,0);assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.site.hidden,false);assert.equal(f.block.dataset.processFinished,'true');assert.ok(f.classes.has('project-process-complete'));
 f.tick(10000);assert.equal(f.timers.size,0);cleanup();
});

test('initialization is single-instance and cleanup removes timers, observers and listeners and restores static content',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root),duplicate=initProjectProcess(f.root);
 assert.equal(f.observers.length,1);duplicate();
 f.intersect(true);assert.equal(f.timers.size,1);f.tick(400);assert.equal(f.visibleLines(),1);
 const completions=f.completions;cleanup();cleanup();
 assert.equal(f.timers.size,0);assert.equal(f.observers[0].disconnected,true);
 for(const target of [...f.buttons,f.view,f.reducedMedia,f.desktopMedia])assert.equal(target.listenerCount,0);
 assert.equal(f.doc.listeners.get('visibilitychange')?.size||0,0);
 assert.equal(f.block.dataset.processEnhanced,undefined);assert.equal(f.block.dataset.processPinned,undefined);assert.equal(f.block.dataset.processFinished,undefined);assert.equal(f.classes.has('project-process-complete'),false);
 assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.site.hidden,false);assert.equal(f.terminal.hidden,true);assert.equal(f.description.hidden,true);assert.equal(f.completions,completions);
 f.buttons[2].click();f.visibility(false);f.motion(false);f.tick(10000);assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.timers.size,0);
 const again=initProjectProcess(f.block);assert.equal(f.observers.length,2);assert.equal(f.block.dataset.processPhase,'0');again();
});

test('connector progress follows the existing stage clock and completed steps stay filled',()=>{
 const f=fixture(),cleanup=initProjectProcess(f.root);
 f.intersect(true);assert.equal(f.style.get('--process-link-0'),'0');
 f.tick(400);assert.equal(f.style.get('--process-link-0'),'0.25');
 f.tick(3*420);assert.equal(f.style.get('--process-link-0'),'1');assert.equal(f.buttons[0].dataset.processComplete,'true');
 f.tick(420);assert.equal(f.style.get('--process-link-1'),'0.25');assert.equal(f.buttons[0].dataset.processComplete,'true');
 f.buttons[3].click();assert.ok(f.buttons.every(button=>button.dataset.processComplete==='true'));
 cleanup();
});

test('stage descriptions highlight keywords without leaving markdown or the removed scope note',()=>{
 for(const key of ['pt-br','en','es']){
  const html=renderProjectProcess(key);
  assert.match(html,/<strong>(?:requisitos|requirements)<\/strong>/);
  assert.doesNotMatch(html,/\*\*|project-process-note|<figcaption|project-process-status/);
  assert.match(html,/class="sr-only" data-process-status/);
 }
 const f=fixture(),cleanup=initProjectProcess(f.root);
 f.buttons[1].description.innerHTML='Clear <strong>scope</strong>';f.buttons[1].click();
 assert.equal(f.description.html,'Clear <strong>scope</strong>');
 cleanup();
});

test('example carousel cycles at five seconds, pauses and releases its timer',()=>{
 const examples=[{hidden:false},{hidden:true},{hidden:true}],timers=new Map();let id=0;
 const block={querySelectorAll:()=>examples,ownerDocument:{defaultView:{setTimeout(fn,ms){assert.equal(ms,5000);timers.set(++id,fn);return id;},clearTimeout(key){timers.delete(key);}}}};
 const carousel=createProjectExamples(block);
 const tick=()=>{const [key,fn]=timers.entries().next().value;timers.delete(key);fn();};
 carousel.setActive(true);carousel.setActive(true);assert.equal(timers.size,1);
 tick();assert.deepEqual(examples.map(e=>e.hidden),[true,false,true]);
 tick();assert.deepEqual(examples.map(e=>e.hidden),[true,true,false]);
 tick();assert.deepEqual(examples.map(e=>e.hidden),[false,true,true]);
 carousel.setActive(false);assert.equal(timers.size,0);
 carousel.setActive(true);assert.equal(timers.size,1);carousel.destroy();assert.equal(timers.size,0);
});


test('desktop keeps separate windows visible and builds the site from the existing line clock across resize',()=>{
 const f=fixture({desktop:true}),cleanup=initProjectProcess(f.root);
 assert.equal(f.terminal.hidden,false);assert.equal(f.site.hidden,false);
 assert.equal(f.terminalWindow.hidden,false);assert.equal(f.siteWindow.hidden,false);
 assert.equal(f.terminal['aria-hidden'],'false');assert.equal(f.site['aria-hidden'],'false');
 assert.equal(f.block.dataset.processBuilt,'0');f.intersect(true);
 for(let built=1;built<=4;built++){
  f.tick(built===1?400+3*420:4*420);
  assert.equal(f.block.dataset.processBuilt,String(built));assert.equal(f.visibleLines(),built*4);assert.equal(f.timers.size,1);
 }
 f.resize(false);assert.equal(f.site.hidden,true);assert.equal(f.siteWindow.hidden,true);assert.equal(f.site['aria-hidden'],'true');
 f.resize(true);assert.equal(f.site.hidden,false);assert.equal(f.siteWindow.hidden,false);assert.equal(f.timers.size,1);
 f.tick(420);assert.equal(f.block.dataset.processPhase,'4');assert.equal(f.terminal.hidden,false);assert.equal(f.terminalWindow.hidden,false);assert.equal(f.timers.size,0);
 f.resize(false);assert.equal(f.terminal.hidden,true);assert.equal(f.terminalWindow.hidden,true);assert.equal(f.terminal['aria-hidden'],'true');
 f.resize(true);assert.equal(f.terminal.hidden,false);assert.equal(f.terminal['aria-hidden'],'false');
 cleanup();assert.equal(f.desktopMedia.listenerCount,0);assert.equal(f.terminalWindow.hidden,true);assert.equal(f.siteWindow.hidden,false);assert.equal(f.block.dataset.processBuilt,'4');
});

test('desktop reduced motion shows both completed windows without animation timers',()=>{
 const f=fixture({desktop:true,reduced:true}),cleanup=initProjectProcess(f.root);
 assert.equal(f.terminal.hidden,false);assert.equal(f.site.hidden,false);assert.equal(f.visibleLines(),16);
 assert.equal(f.block.dataset.processBuilt,'4');assert.equal(f.block.dataset.processRunning,'false');assert.equal(f.timers.size,0);
 f.resize(false);assert.equal(f.terminal.hidden,true);assert.equal(f.site.hidden,false);f.resize(true);assert.equal(f.terminal.hidden,false);
 cleanup();assert.equal(f.desktopMedia.listenerCount,0);
});
