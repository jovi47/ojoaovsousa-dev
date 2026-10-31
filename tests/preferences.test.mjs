import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {document as renderDocument} from '../src/city-page.mjs';
import {content} from '../src/content.mjs';

function browser(options={}){
 const storage=new Map(Object.entries(options.saved||{})),ready={},mediaListeners={},redirects=[],events=[];
 const html={dataset:{theme:'light'}};
 const button={dataset:{themeDark:'Switch to dark mode',themeLight:'Switch to light mode'},attributes:{},listeners:{},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,v){this.listeners[k]=v;}};
 const links=['pt-BR','en-GB','es'].map(lang=>({listeners:{},getAttribute(k){assert.equal(k,'lang');return lang;},addEventListener(k,v){this.listeners[k]=v;}}));
 const media={matches:!!options.dark,addEventListener(k,v){mediaListeners[k]=v;}};
 const location=new URL(options.path||'/', 'https://portfolio.example');location.replace=url=>redirects.push(url);
 const document={documentElement:html,readyState:'loading',querySelectorAll(selector){if(selector==='[data-theme-toggle]')return [button];if(selector==='.language-picker a[lang]')return links;throw new Error(selector);},addEventListener(k,v){ready[k]=v;},dispatchEvent(e){events.push(e.type);}};
 const context={document,location,navigator:{languages:options.languages??['en-US'],language:options.language??'en-US'},matchMedia:query=>{assert.equal(query,'(prefers-color-scheme: dark)');return media;},localStorage:{getItem(k){if(options.storageFails)throw new Error('blocked');return storage.get(k)||null;},setItem(k,v){if(options.storageFails)throw new Error('blocked');storage.set(k,v);}},Event:class{constructor(type){this.type=type;}}};
 runInNewContext(readFileSync(new URL('../public/preferences.js',import.meta.url),'utf8'),context);
 return {html,button,links,media,storage,redirects,events,ready:()=>ready.DOMContentLoaded?.(),system(dark){media.matches=dark;mediaListeners.change?.({matches:dark});}};
}

test('the generic entry selects the first supported device language and preserves its query and fragment',()=>{
 const b=browser({path:'/?utm_source=test#contact',languages:['fr-FR','es-MX','en-US'],dark:true});
 assert.deepEqual(b.redirects,['/es/?utm_source=test#contact']);
 assert.equal(b.html.dataset.theme,'dark','system theme applies before DOM ready');
});

test('saved language wins at the generic entry; explicit locale and invalid URLs stay accessible',()=>{
 for(const [options,want] of [
  [{saved:{'portfolio-language':'pt-br'},languages:['en-US']},['/pt-br/']],
  [{saved:{'portfolio-language':'https://evil.example'},languages:['en-AU']},['/en/']],
  [{languages:[],language:'pt-PT'},['/pt-br/']],
  [{languages:['de-DE'],language:'de-DE'},['/pt-br/']],
  [{path:'/index.html',languages:['es-AR']},['/es/']],
  [{path:'/pt-br/privacy/',languages:['es-ES'],saved:{'portfolio-language':'en'}},[]],
  [{path:'/missing-page',languages:['es-ES']},[]]
 ])assert.deepEqual(browser(options).redirects,want);
});

test('automatic theme follows device changes until the visitor chooses a theme',()=>{
 const b=browser({path:'/en/',dark:false});b.ready();
 assert.equal(b.html.dataset.theme,'light');
 b.system(true);assert.equal(b.html.dataset.theme,'dark');
 assert.equal(b.button.attributes['aria-label'],'Switch to light mode');
 b.button.listeners.click();assert.equal(b.html.dataset.theme,'light');
 assert.equal(b.storage.get('portfolio-theme'),'light');
 b.system(true);assert.equal(b.html.dataset.theme,'light');
 assert.ok(b.events.includes('themechange'));
});

test('valid manual themes persist while invalid saved values fall back to the device',()=>{
 const manual=browser({path:'/en/',dark:true,saved:{'portfolio-theme':'light'}});manual.ready();manual.system(true);
 assert.equal(manual.html.dataset.theme,'light');
 assert.equal(manual.button.attributes['aria-pressed'],'false');
 assert.equal(browser({path:'/en/',dark:true,saved:{'portfolio-theme':'sepia'}}).html.dataset.theme,'dark');
});

test('language choices are remembered and denied storage does not break automatic or manual theme',()=>{
 const b=browser({path:'/en/'});b.ready();b.links[2].listeners.click();assert.equal(b.storage.get('portfolio-language'),'es');
 const denied=browser({path:'/en/',dark:true,storageFails:true});denied.ready();
 assert.equal(denied.html.dataset.theme,'dark');
 denied.button.listeners.click();assert.equal(denied.html.dataset.theme,'light');
 denied.system(true);assert.equal(denied.html.dataset.theme,'light');
 denied.links[0].listeners.click();
});

test('every localized document loads device preferences before styles can paint',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=renderDocument(c,key,'<main id="main"></main>');
  const script=html.indexOf('<script src="/preferences.js"></script>');
  assert.ok(script>0&&script<html.indexOf('<link rel="stylesheet"'));
 }
});
