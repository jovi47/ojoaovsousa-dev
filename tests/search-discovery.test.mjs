import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {content} from '../src/content.mjs';
import {escape} from '../src/city-page.mjs';

async function fixture(t,{copyPublic=false}={}){
 const root=await mkdtemp(path.join(tmpdir(),'portfolio-discovery-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(path.join(root,'scripts'));
 await mkdir(path.join(root,'public'));
 if(copyPublic)await cp(new URL('../public/',import.meta.url),path.join(root,'public'),{recursive:true});
 await cp(new URL('../src/',import.meta.url),path.join(root,'src'),{recursive:true});
 for(const name of ['build.mjs','audit.mjs'])await cp(new URL(`../scripts/${name}`,import.meta.url),path.join(root,'scripts',name));
 await writeFile(path.join(root,'package.json'),'{"type":"module"}');
 await writeFile(path.join(root,'.gitignore'),'dist/\nnode_modules/\n');
 return {root,read:name=>readFile(path.join(root,'dist',name),'utf8'),build:(SITE_URL='',INDEXABLE='')=>execFileSync(process.execPath,['scripts/build.mjs'],{cwd:root,env:{PATH:process.env.PATH,SITE_URL,INDEXABLE},encoding:'utf8',stdio:'pipe'})};
}

test('preview and localhost builds never advertise an indexable release',async t=>{
 const f=await fixture(t);
 for(const [origin,flag] of [['',''],['','true'],['https://localhost','true'],['https://preview.localhost.','true'],['https://127.0.0.1','true'],['https://[::1]','true'],['https://preview.example','false']]){
  f.build(origin,flag);
  assert.match((await f.read('pt-br/index.html')).split('</head>')[0],/name="robots" content="noindex, nofollow"/);
  assert.equal(await f.read('robots.txt'),'User-agent: *\nDisallow: /\n');
  assert.doesNotMatch(await f.read('sitemap.xml'),/<loc>/);
 }
 for(const origin of ['http://portfolio.example','https://user:pass@portfolio.example','https://portfolio.example/path','https://portfolio.example?x=1']){
  assert.throws(()=>f.build(origin,'true'),/SITE_URL must be an HTTPS origin/);
 }
});

test('opted-in HTTPS release has reciprocal language URLs and factual linked discovery',async t=>{
 const f=await fixture(t),base='https://portfolio.example';
 f.build(base,'true');
 const expected=[['pt-br','pt-BR','Sites e software sob medida'],['en','en-GB','Websites and custom software'],['es','es','Sitios web y software a medida']];
 for(const [key,lang,title] of expected){
  const html=await f.read(`${key}/index.html`);
  assert.ok(html.includes(`<title>João Victor | ${title}</title>`));
  assert.match(html,/name="robots" content="index, follow"/);
  assert.ok(html.includes(`<link rel="canonical" href="${base}/${key}/">`));
  for(const [other,otherLang] of expected)assert.ok(html.includes(`hreflang="${otherLang}" href="${base}/${other}/"`));
  assert.ok(html.includes(`hreflang="x-default" href="${base}/pt-br/"`));
  assert.ok(html.includes(`type="text/markdown" href="${base}/${key}/index.md"`));
  assert.ok(html.includes('rel="describedby" href="/llms.txt"'));
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
  const person=data['@graph'].find(item=>item['@type']==='Person'),service=data['@graph'].find(item=>item['@type']==='Service');
  assert.equal(person.name,'João Victor');
  assert.equal(person['@id'],`${base}/#person`);
  assert.deepEqual(service.provider,{'@id':person['@id']});
  assert.equal(service.url,`${base}/${key}/`);
  assert.doesNotMatch(JSON.stringify(data),/alumniOf|award|aggregateRating|address|email|telephone/);
  const direct=await f.read(`${key}/direct/index.html`);
  assert.match(direct,/name="robots" content="noindex, nofollow"/);
  assert.ok(direct.includes(`rel="canonical" href="${base}/${key}/"`));
  const markdown=await f.read(`${key}/index.md`);
  assert.match(markdown,/^# João Victor/m);
  assert.ok(markdown.includes('https://horagora.com.br'));
  assert.ok(markdown.includes('https://andreasousaconsultoria.com.br'));
  assert.doesNotMatch(markdown,/mailto:|@gmail|wa\.me|inquiry-|<script|\.private/);
  assert.ok((await f.read('llms.txt')).includes(`(${base}/${key}/index.md)`));
  for(const type of ['privacy','terms']){
   const policy=await f.read(`${key}/${type}/index.html`);
   assert.ok(policy.includes(`<meta name="description" content="${escape(content[key][type].intro)}">`));
   assert.ok(policy.includes(`rel="canonical" href="${base}/${key}/${type}/"`));
   assert.doesNotMatch(policy,/application\/ld\+json/);
  }
 }
 const sitemap=await f.read('sitemap.xml');
 assert.equal((sitemap.match(/<loc>/g)||[]).length,9);
 assert.doesNotMatch(sitemap,/direct|black|index\.md/);
 assert.equal(await f.read('robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
 assert.doesNotMatch(await f.read('robots.txt'),/api/);
 assert.match(await f.read('llms.txt'),/^# João Victor · ojoaovsousa\n\n> /);
});

test('artifact audit permits only the three generated Markdown pages and llms.txt',async t=>{
 const f=await fixture(t);
 f.build();
 execFileSync('git',['init','--quiet'],{cwd:f.root});
 assert.match(execFileSync(process.execPath,['scripts/audit.mjs'],{cwd:f.root,encoding:'utf8'}),/audit passed/);
 await writeFile(path.join(f.root,'dist','pt-br','extra.md'),'Unapproved');
 assert.throws(()=>execFileSync(process.execPath,['scripts/audit.mjs'],{cwd:f.root,encoding:'utf8',stdio:'pipe'}),/Unapproved artifact path: pt-br\/extra.md/);
});

test('an indexable portfolio build keeps the Fisiopoa preview out of discovery',async t=>{
 const f=await fixture(t,{copyPublic:true});
 f.build('https://portfolio.example','true');
 const route='prototypes/fisiopoa/';
 const html=await f.read(route+'index.html');
 const privacy=await f.read(route+'privacidade.html');
 for(const page of [html,privacy])assert.ok(/<meta name="robots" content="noindex, nofollow">/.test(page),'prototype pages must declare noindex and nofollow');
 const stylesheet=html.match(/<link rel="stylesheet" href="((?:\.\/)?[a-z-]+\.css)">/)?.[1];
 assert.ok(stylesheet,'stylesheet must resolve relative to the prototype route');
 assert.ok((await f.read(new URL(stylesheet,'https://portfolio.example/'+route).pathname.slice(1))).length>0);
 assert.ok(/<nav\b/.test(html),'standalone navigation must be present');
 assert.ok(/href="privacidade\.html(?:#[^"]+)?"/.test(html),'privacy link must stay inside the prototype');
 const map=html.match(/<iframe\b[^>]+>/)?.[0]??'';
 assert.ok(/src="https:\/\/www\.google\.com\/maps\/embed\?/.test(map)&&/referrerpolicy="no-referrer"/.test(map)&&/loading="lazy"/.test(map),'map must use the approved lazy embed without a referrer');
 assert.ok(!/data-theme|theme-toggle|prefers-color-scheme|localStorage|document\.cookie|clarity\(/i.test(html+privacy+(await f.read(route+'page.js'))+(await f.read(route+'style.css'))),'prototype must not add a theme switch or tracking code');
 const locales=Object.keys(content);
 const discovery=['sitemap.xml','llms.txt','index.html',...locales.flatMap(locale=>['','direct/','privacy/','terms/'].map(page=>locale+'/'+page+'index.html'))];
 for(const file of discovery)assert.doesNotMatch(await f.read(file),/fisiopoa/i,file);
});

test('an indexable portfolio build keeps the Toro prototype isolated',async t=>{
 const f=await fixture(t,{copyPublic:true});
 f.build('https://portfolio.example','true');
 const route='prototypes/toro-auto-center/';
 const html=await f.read(route+'index.html');
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 assert.match(html,/<iframe\b[^>]*src="https:\/\/www\.google\.com\/maps[^>]*loading="lazy"/);
 assert.match(html, /class="map-link"[^>]+target="_blank"/);
 assert.match(html, /Horário de funcionamento.*7h às 17h.*7h às 12h/);
 assert.match(html, /href="privacidade.html#privacidade"/);
 assert.match(await f.read(route+'privacidade.html'), /name="robots" content="noindex, nofollow"/);
 const business=JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
 assert.equal(business['@type'],'AutoRepair');
 assert.equal(business.telephone,'+5534999927815');
 assert.equal(business.address.streetAddress,'Av. Rio Branco, 1200');
 assert.doesNotMatch(JSON.stringify(business),/review|rating|openingHours/i);
 const header=html.match(/<header\b[\s\S]*?<\/header>/)[0];
 assert.match(header,/<a class="header-logo"[^>]*>[\s\S]*?<span class="brand-mark"[^>]*><\/span>\s*<span class="brand-name"><span class="brand-oro"><span class="toro-wheel">o<\/span>ro<\/span><span class="brand-descriptor">Auto Center<\/span><\/span>\s*<\/a>/);
 assert.ok(header.indexOf('class="menu-toggle')<header.indexOf('class="button button-header"'));
 for(const item of ['Baterias','Correias','Óleo e filtro de óleo','Palhetas','Escapamentos','Velas e cabos','Alinhamento e balanceamento','Injeção eletrônica','Ar-condicionado','Faróis','Freios','Suspensão']) {
  assert.ok(html.includes('<span>'+item+'</span></button>'),item);
 }
 for(const item of ['Entendemos o problema','Combinamos o horário','Buscamos seu carro','Resolvemos para você'])assert.ok(html.includes('>'+item+'</h4>'),item);
 for(const item of ['Revisão de carros','Manutenção preventiva','Inspeção veicular'])assert.ok(html.includes('>'+item+'</h3>'),item);
 assert.ok(html.includes('<span>Bateria para moto</span></button>'));
 assert.doesNotMatch(html,/data-mode=|data-scene-step=|data-step=/);
 assert.ok(html.indexOf('id="inicio"')<html.indexOf('id="servicos"'));
 assert.ok(html.indexOf('id="servicos"')<html.indexOf('id="baterias"'));
 for(const label of ['Carro','Moto'])assert.match(html,new RegExp('aria-label="'+label+'"[^>]*><svg '));
 assert.match(html,/<details class="vehicle-credit">/);
 assert.equal((html.match(/data-service="[^"]+"[^>]*><svg /g)||[]).length,13);
 const catalog=html.match(/<div class="battery-catalog">([\s\S]*?)<p class="battery-spec-note">/)[1];
 assert.equal((catalog.match(/data-battery="/g)||[]).length,7);
 for(const capacity of [40,48,60,70,100,150,12]){
  assert.ok(catalog.includes('aria-controls="battery-'+capacity+'"'),capacity);
  assert.ok(catalog.includes('id="battery-'+capacity+'"'),capacity);
  assert.ok(catalog.includes('Consultar bateria de '+capacity+' Ah'),capacity);
 }
 assert.match(catalog,/foto do Wix mostra um modelo de 6 Ah/);
 const stage=await f.read(route+'vehicle-stage.js');
 for(const [file,nodes] of [['coupe.glb',['BodyHood','IllustrativeEngine','WheelFrontL','WheelRearL']],['moto.glb',[]]]){
  const bytes=await readFile(path.join(f.root,'dist',route,'assets',file));
  assert.equal(bytes.toString('ascii',0,4),'glTF');
  assert.ok(bytes.length<3*1024*1024,file);
  assert.ok(stage.includes("'"+file+"'"));
  const gltf=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
  for(const node of nodes)assert.ok(gltf.nodes.some(item=>item.name===node),node);
  if(file==='coupe.glb') {
   const paint=gltf.materials.find(item=>item.name==='Paint 1 Toro');
   const [red,green,blue]=paint.pbrMetallicRoughness.baseColorFactor;
   assert.ok(Math.min(red,green,blue)>.75 && Math.max(red,green,blue)-Math.min(red,green,blue)<.08);
  }
 }
 const discovery=['sitemap.xml','llms.txt','index.html',...Object.keys(content).flatMap(locale=>['','direct/','privacy/','terms/'].map(page=>locale+'/'+page+'index.html'))];
 for(const file of discovery)assert.doesNotMatch(await f.read(file),/toro-auto-center/i,file);
});

test('every Toro product and service demonstrates its part and resets on revisit',async()=>{
 const html=await readFile(new URL('../public/prototypes/toro-auto-center/index.html',import.meta.url),'utf8');
 const {createPart}=await import('../public/prototypes/toro-auto-center/vehicle-parts.js');
 const snapshot=node=>{
  const state=[];
  node.traverse(({visible,position,rotation,scale,material})=>{
   state.push([visible,...position,...rotation,...scale,material?.opacity,material?.emissiveIntensity]);
  });
  return JSON.stringify(state);
 };
 const services=Array.from(html.matchAll(/data-service="([^"]+)"/g),([,service])=>service);
 assert.equal(services.length,13);
 for(const service of services){
  const {node,animate}=createPart(service);
  assert.equal(typeof animate,'function',service);
  const initial=snapshot(node);
  const frames=new Set([initial]);
  for(let step=1;step<=20;step++){
   animate(step/5);
   frames.add(snapshot(node));
  }
  assert.ok(frames.size>1,service+' should move or change appearance');
  animate(0);
  assert.equal(snapshot(node),initial,service+' should reset');
 }
});
