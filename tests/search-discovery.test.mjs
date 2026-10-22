import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {content} from '../src/content.mjs';
import {escape} from '../src/city-page.mjs';

async function fixture(t){
 const root=await mkdtemp(path.join(tmpdir(),'portfolio-discovery-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 await mkdir(path.join(root,'scripts'));
 await mkdir(path.join(root,'public'));
 await cp(new URL('../src/',import.meta.url),path.join(root,'src'),{recursive:true});
 for(const name of ['build.mjs','audit.mjs'])await cp(new URL(`../scripts/${name}`,import.meta.url),path.join(root,'scripts',name));
 const dependencies=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8')).dependencies||{};
 if(dependencies['libphonenumber-js']){
  await mkdir(path.join(root,'node_modules'));
  await cp(new URL('../node_modules/libphonenumber-js/',import.meta.url),path.join(root,'node_modules','libphonenumber-js'),{recursive:true});
  await mkdir(path.join(root,'public','vendor'));
  for(const name of ['libphonenumber-max.js','libphonenumber-max.js.map','libphonenumber-LICENSE.txt'])await cp(new URL(`../public/vendor/${name}`,import.meta.url),path.join(root,'public','vendor',name));
 }
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
 const expected=[['pt-br','pt-BR','Desenvolvedor de software sob medida'],['en','en-GB','Custom software developer'],['es','es','Desarrollador de software a medida']];
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
