import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {document as renderDocument,footer} from '../src/city-page.mjs';
import {content} from '../src/content.mjs';

const source=await readFile(new URL('../public/analytics.js',import.meta.url),'utf8').catch(()=>null);
const css=await readFile(new URL('../public/direct.css',import.meta.url),'utf8');
const key='portfolio.analytics.v1',day=86400000,now=Date.UTC(2026,9,27);
function page(options={}){
 const node=()=>({hidden:true,disabled:false,dataset:{},listeners:{},addEventListener(name,fn){this.listeners[name]=fn;},focus(){this.focused=true;},scrollIntoView(){this.scrolled=true;}});
 const deny=node(),accept=node(),signal=node(),preferences=node(),panel=node();
 panel.dataset={deny:'Recusar',denyReload:'Recusar e recarregar',preview:options.preview?'true':'false'};
 panel.querySelector=selector=>selector.includes('denied')?deny:selector.includes('granted')?accept:signal;
 const scripts=[],events={},cookies=[],storage=new Map();
 if(options.stored!==undefined)storage.set(key,typeof options.stored==='string'?options.stored:JSON.stringify(options.stored));
 const location=new URL(options.url||'https://ojoaovsousa.pages.dev/pt-br/');
 location.reload=()=>{location.reloaded=true;};
 location.replace=value=>{location.replaced=value;};
 const document={referrer:options.referrer||'',querySelector:()=>panel,querySelectorAll:()=>[preferences],createElement:()=>({}),head:{append(script){if(options.appendFails)throw new Error('blocked');scripts.push(script);}}};
 Object.defineProperty(document,'cookie',{get:()=>options.cookies||'',set:value=>{if(options.cookieFails)throw new Error('blocked');cookies.push(value);}});
 const window={location,addEventListener:(name,fn)=>{events[name]=fn;}};
 const context={URL,window,document,navigator:{doNotTrack:options.dnt?'1':'0',globalPrivacyControl:!!options.gpc},localStorage:{getItem:k=>{if(options.storageFails)throw new Error('blocked');return storage.get(k);},setItem:(k,v)=>{if(options.storageFails||options.writeFails)throw new Error('blocked');storage.set(k,v);},removeItem:k=>{if(options.storageFails)throw new Error('blocked');storage.delete(k);}},Date:class extends Date{static now(){return now;}}};
 assert.ok(source,'the real local consent loader must exist');
 vm.runInNewContext(source.replace(/^export /gm,''),context);
 return {deny,accept,signal,preferences,panel,scripts,events,location,storage,window,cookies};
}

test('Clarity is absent until an explicit choice and revocation reloads the page',()=>{
 const p=page({cookies:'_clck=old; _clsk=old; portfolio-theme=dark'});
 assert.equal(p.scripts.length,0);assert.equal(p.window.clarity,undefined);assert.equal(p.panel.hidden,false);
 p.deny.listeners.click();assert.equal(p.scripts.length,0);assert.equal(p.panel.hidden,true);
 p.preferences.listeners.click();assert.equal(p.panel.hidden,false);assert.equal(p.deny.focused,true);
 p.accept.listeners.click();
 assert.equal(p.scripts.length,1);assert.equal(p.scripts[0].src,'https://www.clarity.ms/tag/z43jc8necn');
 assert.equal(p.scripts[0].referrerPolicy,'no-referrer');
 assert.deepEqual(JSON.parse(JSON.stringify(p.window.clarity.q)),[['consentv2',{ad_Storage:'denied',analytics_Storage:'granted'}]]);
 p.accept.listeners.click();assert.equal(p.scripts.length,1,'one SDK per page');
 p.preferences.listeners.click();assert.equal(p.deny.textContent,'Recusar e recarregar');
 p.deny.listeners.click();assert.equal(p.location.reloaded,true);
 assert.equal(JSON.parse(p.storage.get(key)).choice,'denied');
 assert.ok(p.cookies.some(value=>value.startsWith('_clck=;')));
 assert.ok(p.cookies.every(value=>!value.startsWith('portfolio-theme=')));
 assert.equal(p.window.gtag,undefined);assert.equal(p.window.dataLayer,undefined);
});

test('a fresh versioned choice expires after 90days and privacy signals override grants',()=>{
 for(const options of [
  {stored:{choice:'denied',at:now}},
  {stored:{choice:'granted',at:now-90*day}},
  {stored:{choice:'granted',at:now+1}},
  {stored:{choice:'granted',at:'today'}},
  {stored:'not-json'},{stored:{choice:'other',at:now}},
  {stored:{choice:'granted',at:now},dnt:true},
  {stored:{choice:'granted',at:now},gpc:true},
 ]){const p=page(options);assert.equal(p.scripts.length,0,JSON.stringify(options));}
 const valid=page({stored:{choice:'granted',at:now-89*day}});assert.equal(valid.scripts.length,1);
 for(const signal of ['dnt','gpc']){
  const p=page({[signal]:true});assert.equal(p.accept.disabled,true);p.preferences.listeners.click();assert.equal(p.signal.hidden,false);
  p.accept.listeners.click();assert.equal(p.scripts.length,0);
 }
 const blocked=page({storageFails:true});blocked.accept.listeners.click();assert.equal(blocked.scripts.length,1);blocked.deny.listeners.click();assert.equal(blocked.location.reloaded,true);
 const writes=page({stored:{choice:'granted',at:now},writeFails:true});writes.deny.listeners.click();assert.equal(writes.storage.has(key),false,'revocation clears a stale grant when writing is blocked');
});

test('only clean canonical homes on the exact production origin or explicit local test preview may load',()=>{
 for(const locale of ['pt-br','en','es']){
  const p=page({url:`https://ojoaovsousa.pages.dev/${locale}/`,stored:{choice:'granted',at:now}});assert.equal(p.scripts.length,1);
 }
 for(const url of [
  'https://ojoaovsousa.pages.dev/','https://ojoaovsousa.pages.dev/pt-br',
  'https://ojoaovsousa.pages.dev/pt-br/direct/','https://ojoaovsousa.pages.dev/en/privacy/',
  'https://ojoaovsousa.pages.dev/es/terms/','https://ojoaovsousa.pages.dev/.private/',
  'https://ojoaovsousa.pages.dev/404.html','https://ojoaovsousa.pages.dev/missing/',
  'https://alias.ojoaovsousa.pages.dev/pt-br/','https://ojoaovsousa.pages.dev.evil.example/pt-br/',
  'http://ojoaovsousa.pages.dev/pt-br/','https://ojoaovsousa.pages.dev:444/pt-br/',
  'https://ojoaovsousa.pages.dev/pt-br/?email=synthetic@example.test',
  'https://ojoaovsousa.pages.dev/pt-br/?utm_source=synthetic',
  'https://ojoaovsousa.pages.dev/pt-br/#synthetic-private-value',
  'https://ojoaovsousa.pages.dev/pt-br/#main','http://localhost:3000/pt-br/',
 ]){const p=page({url,stored:{choice:'granted',at:now}});assert.equal(p.scripts.length,0,url);}
 assert.equal(page({url:'http://localhost:3000/pt-br/',preview:true,stored:{choice:'granted',at:now}}).scripts.length,1);
 const local=page({url:'http://localhost:3000/pt-br/'});
 assert.equal(local.panel.hidden,false,'normal local preview exposes UI without enabling the SDK');
 local.accept.listeners.click();assert.equal(local.scripts.length,0);
 assert.equal(page({url:'https://alias.ojoaovsousa.pages.dev/pt-br/',preview:true,stored:{choice:'granted',at:now}}).scripts.length,0);
 for(const referrer of ['https://example.test/?q=synthetic','https://ojoaovsousa.pages.dev/pt-br/#synthetic',
  'https://ojoaovsousa.pages.dev/synthetic-contact@example.test/','https://example.test/arbitrary-private-path/',
  'https://synthetic-user@example.test/','ftp://example.test/','not-a-url',
 ])assert.equal(page({referrer,stored:{choice:'granted',at:now}}).scripts.length,0,referrer);
 for(const referrer of ['https://example.test/','https://ojoaovsousa.pages.dev/en/','https://ojoaovsousa.pages.dev/es/privacy/'])assert.equal(page({referrer,stored:{choice:'granted',at:now}}).scripts.length,1);
 const changed=page({stored:{choice:'granted',at:now}});changed.location.hash='#synthetic';changed.events.hashchange();assert.equal(changed.location.reloaded,true);
 const otherTab=page({stored:{choice:'granted',at:now}});otherTab.events.storage({key});assert.equal(otherTab.location.reloaded,true);
});

test('tracker failure remains isolated and preferences can still be revoked',()=>{
 const p=page({appendFails:true});assert.doesNotThrow(()=>p.accept.listeners.click());
 p.preferences.listeners.click();assert.equal(p.panel.hidden,false);assert.doesNotThrow(()=>p.deny.listeners.click());
 assert.doesNotThrow(()=>page({cookieFails:true}));
});

test('localized consent uses native equal actions, masks main and stays out of metadata and schema',()=>{
 for(const locale of ['pt-br','en','es']){
  const c=content[locale],body=`<main id="main"><h1>${c.title}</h1></main>${footer(c,locale)}`;
  const html=renderDocument(c,locale,body,{base:'https://ojoaovsousa.pages.dev',indexable:true});
  assert.match(html,/<main id="main" data-clarity-mask="true"><section[^>]+id="analytics-consent"/);
  assert.match(html,/<script type="module" src="\/analytics.js"><\/script>/);
  assert.equal((html.match(/data-consent="(?:denied|granted)"/g)||[]).length,2);
  assert.equal((html.match(/class="button button-secondary" data-consent=/g)||[]).length,2);
  assert.match(html,/data-analytics-preferences hidden/);
  assert.match(html,new RegExp(`href="/${locale}/privacy/"`));
  assert.doesNotMatch(html,/<script[^>]+src="https:/);
  assert.doesNotMatch(c.privacy.sections.map(s=>s.body).join(' '),/não usa publicidade, analytics|no advertising, analytics|no utiliza publicidad, (?:analytics|analítica)|enables no visitor analytics/);
 }
 assert.match(css,/\.consent-actions[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.consent-actions \.button[^}]*min-height:48px/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
});
