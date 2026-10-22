import {mkdir,writeFile,cp,rm} from 'node:fs/promises';
import {content} from '../src/content.mjs';
import {home,policy,document,escape} from '../src/page.mjs';
const root=new URL('../',import.meta.url),out=new URL('dist/',root);
const base=(process.env.SITE_URL||'').replace(/\/$/,'');
if(base&&!/^https:\/\/[a-zA-Z0-9.-]+(?::\d+)?$/.test(base)) throw new Error('SITE_URL must be an HTTPS origin');
const indexable=process.env.INDEXABLE==='true'&&!!base;
await mkdir(out,{recursive:true});
await cp(new URL('public/',root),out,{recursive:true});
for(const [key,c] of Object.entries(content)){
 await mkdir(new URL(`${key}/`,out),{recursive:true});
 await writeFile(new URL(`${key}/index.html`,out),document(c,key,home(c,key),{base,indexable}));
 for(const type of ['privacy','terms']){
  await mkdir(new URL(`${key}/${type}/`,out),{recursive:true});
  await writeFile(new URL(`${key}/${type}/index.html`,out),document(c,key,policy(c,key,type),{base,indexable,title:`${c[type].title} · João Victor`,path:`${type}/`}));
 }
}
await writeFile(new URL('index.html',out),document(content['pt-br'],'pt-br',home(content['pt-br'],'pt-br'),{base,indexable:false}));
await writeFile(new URL('404.html',out),document(content['pt-br'],'pt-br',`<main id="main" class="not-found section-wrap"><a class="wordmark" href="/pt-br/">jovi47.</a><p class="eyebrow">404 / PEÇA NÃO ENCONTRADA</p><h1>Essa peça ainda<br>não se encaixa.</h1><p>O endereço pode ter mudado. Volte ao estúdio e encontre os projetos e contatos.</p><a class="button" href="/pt-br/">Voltar ao estúdio ↗</a><div lang="en"><p>Page not found. Return to the studio.</p><a href="/en/">English →</a></div><div lang="es"><p>Página no encontrada. Vuelve al estudio.</p><a href="/es/">Español →</a></div></main>`,{indexable:false,title:'404 · João Victor'}));
await writeFile(new URL('robots.txt',out),`User-agent: *\n${indexable?'Allow: /':'Disallow: /'}\n${indexable?`Sitemap: ${base}/sitemap.xml\n`:''}`);
const urls=indexable?Object.keys(content).flatMap(key=>['','privacy/','terms/'].map(path=>`<url><loc>${escape(`${base}/${key}/${path}`)}</loc></url>`)).join(''):'';
await writeFile(new URL('sitemap.xml',out),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
console.log(`Built ${Object.keys(content).length} locales; indexable=${indexable}`);
