import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {content} from '../src/content.mjs';
import {viewerHome} from '../src/viewer-page.mjs';
import {directHome} from '../src/direct-page.mjs';

async function startup(loadCity){
 const source=await readFile(new URL('../public/city-app.js',import.meta.url),'utf8');
 const glue=source.slice(source.indexOf('let world='),source.indexOf('if(canvas){if(reduced.matches)'));
 const navigation=[],classes=new Set(),listeners={},timers=new Map(),errors=[],retry={hidden:true,addEventListener(_event,fn){listeners.retry=fn;}},status={};
 const canvas={dataset:{},focus(){navigation.push('focus');},cloneNode(){return {...this,dataset:{...this.dataset}};},replaceWith(){}};
 const context={loadCity,starting:false,location:{hash:''},labels:{},openInquiry(){},openResident(){},syncInquiryAvailability(){},menu:null,
  matchMedia:()=>({matches:false}),console:{error:(...args)=>errors.push(args)},Event,CustomEvent:Event,
  document:{body:{dataset:{}},querySelector:selector=>selector==='#city-canvas'?canvas:selector==='.viewer-board'?{scrollIntoView(){navigation.push('scene');}}:selector==='#world-status'?status:selector==='[data-retry]'?retry:null,
   querySelectorAll:selector=>selector==='[data-read-projects]'?[{addEventListener(_event,fn){listeners.projects=fn;}}]:[],dispatchEvent(){},addEventListener:(event,fn)=>{listeners[event]=fn;}},
  body:{classList:{contains:name=>classes.has(name),add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),toggle:(name,on)=>on?classes.add(name):classes.delete(name)}},
  setTimeout:fn=>{const id=timers.size+1;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id),window:{addEventListener(){}}};
 runInNewContext(glue.replace("import('./city.js')",'loadCity()'),context);
 return {context,navigation,classes,listeners,timers,errors,retry,start:()=>context.start()};
}

test('failed initialization leaves normal reading and a manual retry without concurrent attempts',async()=>{
 let calls=0;
 const f=await startup(async()=>{calls++;throw new Error('WebGL unavailable');});
 await Promise.all([f.start(),f.start()]);
 assert.equal(calls,1);assert.ok(f.classes.has('reading'));assert.ok(f.classes.has('graphics-failed'));
 assert.equal(f.retry.hidden,false);assert.equal(f.errors.length,1);assert.equal(f.context.starting,false);
});

test('lost WebGL context disposes the stale world and a manual retry builds a fresh one',async()=>{
 let created=0,disposed=0;const canvases=[];
 const f=await startup(async()=>({createCity:async canvas=>{canvases.push(canvas);created++;return {dispose(){disposed++;},setReading(){},goTo(){}};}}));
 await f.start();f.listeners.cityreading();
 assert.equal(disposed,1);assert.equal(runInNewContext('world',f.context),null);assert.ok(f.classes.has('reading'));
 f.listeners.retry();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(created,2);assert.notEqual(canvases[0],canvases[1],'a lost WebGL context requires a fresh canvas');assert.ok(f.classes.has('world-loaded'));assert.ok(!f.classes.has('graphics-failed'));
});

test('a renderer that fails before returning also gets a fresh canvas on manual retry',async()=>{
 const canvases=[];
 const f=await startup(async()=>({createCity:async canvas=>{canvases.push(canvas);if(canvases.length===1)throw new Error('Context lost during startup');return {dispose(){},setReading(){},goTo(){}};}}));
 await f.start();await f.listeners.retry();
 assert.equal(canvases.length,2);assert.notEqual(canvases[0],canvases[1]);assert.ok(f.classes.has('world-loaded'));
});

test('a stalled module import is bounded and late completion cannot unexpectedly replace reading',async()=>{
 let resolveImport,created=0;
 const f=await startup(()=>new Promise(resolve=>{resolveImport=resolve;}));
 const pending=f.start();
 assert.equal(f.timers.size,1,'startup must have a timeout');
 for(const expire of f.timers.values())expire();
 await pending;assert.ok(f.classes.has('reading'));assert.equal(f.context.starting,false);
 resolveImport({createCity:async()=>{created++;}});await new Promise(resolve=>setImmediate(resolve));
 assert.equal(created,0);assert.ok(!f.classes.has('world-loaded'));assert.equal(f.timers.size,0);
});

test('the projects shortcut reveals reading immediately and the 3D action reuses a healthy world',async()=>{
 let created=0;
 const f=await startup(async()=>({createCity:async()=>{created++;return {dispose(){},setReading(){},goTo(){}};}}));
 await f.start();f.listeners.projects();
 assert.ok(f.classes.has('reading'));assert.equal(f.retry.hidden,false);
 f.listeners.retry();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(created,1);assert.ok(!f.classes.has('reading'));assert.ok(f.classes.has('world-loaded'));assert.deepEqual(f.navigation,['focus','scene']);
});

test('localized heroes link straight to the configured WhatsApp with context and keep alternative channels',()=>{
 for(const [key,c] of Object.entries(content))for(const html of [viewerHome(c,key),directHome(c,key)]){
  const hero=html.match(/<section[^>]*class="(?:viewer-intro|direct-hero)"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero);
  const primary=hero.match(/<a[^>]*class="button"[^>]*href="([^"]+)"[^>]*>/);
  assert.ok(primary,`${key}: primary is a native WhatsApp link`);
  const url=new URL(primary[1].replaceAll('&amp;','&'));
  assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/5579998230872');assert.ok(url.searchParams.get('text'));
  assert.ok(hero.includes('href="#projects"'));assert.ok(html.includes('id="inquiry-dialog"'));
  assert.ok(html.includes('mailto:jovi47profissional@gmail.com'));
 }
});

test('fallback retry follows the complete presentation and has no dominant technical banner',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=viewerHome(c,key);
  assert.ok(html.indexOf('class="viewer-recovery"')>html.indexOf('id="contact"'));
  const recovery=html.match(/<div class="viewer-recovery"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.ok(recovery);assert.doesNotMatch(recovery,/<p|Reload page|Recarregar página|Recargar página/);
 }
});

test('the owner keeps the original services and technology strip visible without a new disclosure',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=directHome(c,key);
  assert.doesNotMatch(html,/technical-repertoire|service-actions|project-evidence/);
  assert.ok(html.indexOf('data-technology-marquee')<html.indexOf('id="projects"'));
  assert.ok(html.includes('data-tech-primary'));
 }
});
