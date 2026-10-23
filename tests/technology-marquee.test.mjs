import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {renderSkills} from '../src/skills.mjs';
import {initTechnologyMarquee} from '../public/technology-marquee.js';

test('the compatible skills renderer exposes 54 named technologies and practices once to assistive reading in every locale',()=>{
 for(const [key,title,concepts] of [
  ['pt-br','Tecnologias aplicadas em projetos',['Domínios','Infraestrutura','IA','Agentes','Modelagem 3D','APIs REST','Testes unitários','Testes de integração','Microsserviços']],
  ['en','Technologies applied in projects',['Domains','Infrastructure','AI','Agents','3D modelling','REST APIs','Unit tests','Integration tests','Microservices']],
  ['es','Tecnologías aplicadas en proyectos',['Dominios','Infraestructura','IA','Agentes','Modelado 3D','API REST','Pruebas unitarias','Pruebas de integración','Microservicios']],
 ]){
  const html=renderSkills({title:'Previous heading',items:[]},key);
  assert.ok(html.includes(`<h3 id="skills-title">${title}</h3>`));
  const primary=[...html.matchAll(/<ul\b[^>]*data-tech-primary[^>]*>([\s\S]*?)<\/ul>/g)];
  assert.equal(primary.length,2);
  const names=[...primary.map(item=>item[1]).join('').matchAll(/class="technology-name">([^<]+)</g)].map(item=>item[1]);
  assert.equal(names.length,54);assert.equal(new Set(names).size,54);
  for(const name of ['Elixir','Java','JavaScript','React','Phoenix','PostgreSQL','Fly.io','AWS','Docker','GitHub','Git','HTML','CSS','Python','Spring Boot','CI/CD','Harnesses','RAG','XML','MySQL','PL/SQL','LiveView','Oban','Ecto','Next.js','TypeScript','GraphQL','Kafka','RabbitMQ','MongoDB','Kubernetes','ExUnit','JUnit','Mockito','WireMock','TDD','DDD','SOLID','Scrum','Kanban','Tomcat','Metabase','Bootstrap','AJAX','SQL',...concepts])assert.ok(names.includes(name),`${key}: ${name}`);
  for(const [,body] of primary)assert.equal((body.match(/class="technology-name"/g)||[]).length,27);
  assert.equal((html.match(/data-tech-copy aria-hidden="true"/g)||[]).length,2);
  assert.match(html,/<section[^>]*data-technology-marquee[^>]*tabindex="0"[^>]*aria-label="[^"]+"/);
  assert.doesNotMatch(html,/<button\b|data-tech-pause|data-pause|data-resume/);
  for(const icon of ['elixir','java','javascript','react'])assert.ok(html.includes(`/icons/${icon}.svg`));
  assert.doesNotMatch(html,/https?:\/\/|skill-(?:gauge|ring|value)|stroke-dasharray|%/);
 }
});

test('every rendered icon is a local safe vector and has a recorded source or original-concept origin',async()=>{
 const html=renderSkills({},'en');
 const paths=new Set([...html.matchAll(/\bsrc="([^"]+\.svg)"/g)].map(item=>item[1]));
 assert.ok(paths.size>=26);
 const manifest=JSON.parse(await readFile(new URL('../docs/technology-icon-sources.json',import.meta.url),'utf8'));
 for(const path of paths){
  const svg=await readFile(new URL(`../public${path}`,import.meta.url),'utf8');
  assert.match(svg,/<svg\b[^>]*viewBox=/);
  assert.doesNotMatch(svg,/<(?:script|foreignObject|image)\b|\bon\w+\s*=|(?:href|xlink:href)="(?:https?:|data:|\/\/)/i);
  if(path.startsWith('/technology-icons/')){
   const record=manifest.icons.find(icon=>icon.file===path.split('/').at(-1));
   assert.ok(record?.source&&record?.license);
   assert.equal(createHash('sha256').update(svg).digest('hex'),record.sha256,path);
   assert.equal(Buffer.byteLength(svg),record.bytes,path);
  }
 }
});

test('brand artwork keeps its colors in either theme; only black GitHub and Kafka marks adapt to dark',async()=>{
 const html=renderSkills({},'en');
 assert.doesNotMatch(html,/technology-monochrome/);
 assert.match(html,/class="technology-icon technology-github"[^>]*src="\/technology-icons\/github.svg"/);
 const css=await readFile(new URL('../public/technology-marquee.css',import.meta.url),'utf8');
 const filtered=[...css.matchAll(/([^{}]+)\{[^{}]*\bfilter\s*:[^{}]+\}/g)];
 assert.equal(filtered.length,1);
 assert.equal(filtered[0][1].trim(),'html[data-theme=dark] .technology-github,html[data-theme=dark] .technology-kafka');
 for(const icon of ['phoenix','postgresql','docker','git','html','css','python','spring-boot','mysql','aws','fly']){
  const svg=await readFile(new URL(`../public/technology-icons/${icon}.svg`,import.meta.url),'utf8');
  assert.match(svg,/(?:fill|stroke|stop-color)="#[0-9a-f]{3,8}"/i,icon);
 }
 const python=await readFile(new URL('../public/technology-icons/python.svg',import.meta.url),'utf8');
 assert.ok(new Set(python.match(/#[0-9a-f]{6}/gi)).size>=2,'Python retains its multicolor artwork');
});

test('pointer hover keeps the strip moving while keyboard focus can pause it',async()=>{
 const css=await readFile(new URL('../public/technology-marquee.css',import.meta.url),'utf8');
 assert.doesNotMatch(css,/:hover[^{}]*\{[^{}]*animation-play-state:paused/);
 assert.match(css,/:focus-within[^{}]*\{animation-play-state:paused\}/);
 for(const key of ['pt-br','en','es'])assert.doesNotMatch(renderSkills({},key),/Passe o ponteiro|Hover over|Coloca el puntero/);
});

function fixture({reduced=false,observer=true}={}){
 const media=Object.assign(new EventTarget(),{matches:reduced}),observers=[];
 const view={matchMedia:()=>media};
 if(observer)view.IntersectionObserver=class{constructor(callback){this.callback=callback;this.disconnected=false;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 const doc=Object.assign(new EventTarget(),{hidden:false,defaultView:view});
 const classes=new Set(),block={dataset:{},ownerDocument:doc,matches:()=>true,querySelector:()=>null,classList:{toggle(name,value){if(value)classes.add(name);else classes.delete(name);},remove(name){classes.delete(name);}}};
 return {media,observers,doc,block,classes};
}

test('motion runs only in view and respects tab visibility and reduced motion without requiring a button',()=>{
 const f=fixture(),cleanup=initTechnologyMarquee(f.block);
 assert.equal(f.block.dataset.techEnhanced,'true');assert.equal(f.classes.has('is-running'),false);
 f.observers[0].callback([{isIntersecting:true}]);assert.equal(f.classes.has('is-running'),true);
 f.observers[0].callback([{isIntersecting:false}]);assert.equal(f.classes.has('is-running'),false);
 f.observers[0].callback([{isIntersecting:true}]);assert.equal(f.classes.has('is-running'),true);
 f.doc.hidden=true;f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(f.classes.has('is-running'),false);
 f.doc.hidden=false;f.doc.dispatchEvent(new Event('visibilitychange'));assert.equal(f.classes.has('is-running'),true);
 f.media.matches=true;f.media.dispatchEvent(new Event('change'));assert.equal(f.classes.has('is-running'),false);
 f.media.matches=false;f.media.dispatchEvent(new Event('change'));assert.equal(f.classes.has('is-running'),true);
 initTechnologyMarquee(f.block);assert.equal(f.observers.length,1);
 cleanup();assert.equal(f.observers[0].disconnected,true);assert.equal(f.block.dataset.techEnhanced,undefined);assert.equal(f.classes.has('is-running'),false);
 f.observers[0].callback([{isIntersecting:true}]);assert.equal(f.classes.has('is-running'),false);
});

test('without a visibility observer the content keeps its static, dependency-free fallback',()=>{
 const f=fixture({observer:false}),cleanup=initTechnologyMarquee(f.block);
 assert.equal(f.block.dataset.techEnhanced,undefined);assert.equal(f.classes.has('is-running'),false);
 cleanup();
});
