import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {directHome} from '../src/direct-page.mjs';
import {content} from '../src/content.mjs';
import {policy,document,escape} from '../src/city-page.mjs';
import {blackHome as home} from '../src/black-page.mjs';
import {searchConfig,localizedMarkdown,llmsIndex} from '../src/search-discovery.mjs';
const root=new URL('../',import.meta.url),out=new URL('dist/',root);
const {base,indexable}=searchConfig(process.env.SITE_URL,process.env.INDEXABLE);
await rm(out,{recursive:true,force:true});
await mkdir(out,{recursive:true});
await cp(new URL('public/',root),out,{recursive:true});
for(const [key,c] of Object.entries(content)){
 await mkdir(new URL(`${key}/`,out),{recursive:true});
 await writeFile(new URL(`${key}/index.html`,out),document(c,key,home(c,key),{base,indexable,viewer:true,variant:'black'}));
 await writeFile(new URL(`${key}/index.md`,out),localizedMarkdown(c,key,base));
 await mkdir(new URL(`${key}/black/`,out),{recursive:true});
 await writeFile(new URL(`${key}/black/index.html`,out),`<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=/${key}/"><link rel="canonical" href="${base}/${key}/"><title>João Victor · jovi47</title></head><body><a href="/${key}/">João Victor · jovi47 →</a></body></html>`);
 await mkdir(new URL(`${key}/direct/`,out),{recursive:true});
 await writeFile(new URL(`${key}/direct/index.html`,out),document(c,key,directHome(c,key),{base,indexable:false,path:'direct/',canonicalPath:'',direct:true}));
 for(const type of ['privacy','terms']){
  await mkdir(new URL(`${key}/${type}/`,out),{recursive:true});
  await writeFile(new URL(`${key}/${type}/index.html`,out),document(c,key,policy(c,key,type),{base,indexable,title:`${c[type].title} · João Victor`,description:c[type].intro,path:`${type}/`}));
 }
}
await writeFile(new URL('index.html',out),document(content['pt-br'],'pt-br',home(content['pt-br'],'pt-br'),{base,indexable:false,viewer:true,variant:'black'}));
await writeFile(new URL('404.html',out),document(content['pt-br'],'pt-br',`<main id="main" class="not-found section-wrap"><a class="wordmark" href="/pt-br/">jovi47.</a><p class="eyebrow">404 / PEÇA NÃO ENCONTRADA</p><h1>Essa peça ainda<br>não se encaixa.</h1><p>O endereço pode ter mudado. Volte à cidade e encontre os projetos e contatos.</p><a class="button" href="/pt-br/">Voltar à cidade ↗</a><div lang="en"><p>Page not found. Return to the city.</p><a href="/en/">English →</a></div><div lang="es"><p>Página no encontrada. Vuelve a la ciudad.</p><a href="/es/">Español →</a></div></main>`,{indexable:false,title:'404 · João Victor'}));
await writeFile(new URL('robots.txt',out),`User-agent: *\n${indexable?'Allow: /':'Disallow: /'}\n${indexable?`Sitemap: ${base}/sitemap.xml\n`:''}`);
await writeFile(new URL('llms.txt',out),llmsIndex(content,base));
const urls=indexable?Object.keys(content).flatMap(key=>['','privacy/','terms/'].map(path=>`<url><loc>${escape(`${base}/${key}/${path}`)}</loc></url>`)).join(''):'';
await writeFile(new URL('sitemap.xml',out),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
console.log(`Built ${Object.keys(content).length} locales; indexable=${indexable}`);
