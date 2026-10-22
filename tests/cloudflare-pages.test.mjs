import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,copyFile,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {verifyDeployment} from '../scripts/verify-cloudflare.mjs';

const root=new URL('../',import.meta.url);
const csp=(await readFile(new URL('public/_headers',root),'utf8')).match(/  Content-Security-Policy: (.+)/)[1];

test('Pages rules preserve real404 handling and allow only the required inline noscript style',async()=>{
 const rules=await readFile(new URL('public/_redirects',root),'utf8');
 assert.match(rules,/^\/ \/pt-br\/ 301$/m);
 for(const key of ['pt-br','en','es'])for(const ending of ['','/'])assert.ok(rules.includes(`/${key}/black${ending} /${key}/ 301`));
 assert.doesNotMatch(rules,/^\/\* /m);
 assert.doesNotMatch(csp,/unsafe-inline|unsafe-eval|https?:/);
 assert.match(csp,/connect-src 'self' blob:/);
 const source=await readFile(new URL('src/viewer-page.mjs',root),'utf8');
 for(const [,style] of source.matchAll(/<style>(.*?)<\/style>/g))assert.ok(csp.includes(`'sha256-${createHash('sha256').update(style).digest('base64')}'`));
 const build=await readFile(new URL('scripts/build.mjs',root),'utf8');
 assert.ok(build.includes("new URL('404.html',out)"));
 const headers=await readFile(new URL('public/_headers',root),'utf8');
 assert.match(headers,/https:\/\/:deployment\.:project\.pages\.dev\/\*\n  X-Robots-Tag: noindex, nofollow/);
 assert.doesNotMatch(headers,/^\s+Cache-Control:.*(?:immutable|max-age=315)/m);
});

function fixture({preview=false,alter=()=>{}}={}){
 const origin='https://portfolio.example',files=new Map();
 const headers={'Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'};
 if(preview)headers['X-Robots-Tag']='noindex';
 files.set('/_headers',`/*\n  Content-Security-Policy: ${csp}\n`);
 const fetcher=async(url)=>{
  const pathname=new URL(url).pathname;
  const redirect=pathname==='/'?'/pt-br/':pathname.match(/^\/(pt-br|en|es)\/black\/?$/)?.[1];
  if(redirect)return new Response(null,{status:301,headers:{Location:redirect.startsWith('/')?redirect:`/${redirect}/`}});
  let body,status=200,extra={};
  if(pathname==='/__portfolio-release-missing__/'){body='404';status=404;}
  else if(/^\/(pt-br|en|es)\/$/.test(pathname))body=`<html><link rel="canonical" href="${origin}${pathname}"><meta name="robots" content="${preview?'noindex, nofollow':'index, follow'}"></html>`;
  else if(pathname==='/robots.txt')body=`User-agent: *\n${preview?'Disallow: /':'Allow: /\nSitemap: '+origin+'/sitemap.xml'}\n`;
  else if(pathname==='/sitemap.xml')body=preview?'<urlset/>':'<urlset>'+Array.from({length:9},()=>'<loc>https://portfolio.example/</loc>').join('')+'</urlset>';
  else if(pathname.endsWith('.md')){body='# João Victor';extra['Content-Type']='text/markdown; charset=utf-8';}
  else body='local asset';
  files.set(pathname==='/__portfolio-release-missing__/'?'/404.html':pathname,Buffer.from(body));
  const mime=pathname.endsWith('/')?'text/html':({'.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.woff2':'font/woff2','.glb':'model/gltf-binary'})[path.extname(pathname)];
  const result={body,status,headers:{...headers,...(mime?{'Content-Type':mime}:{}),...extra}};alter(pathname,result);
  return new Response(result.body,{status:result.status,headers:result.headers});
 };
 return {origin,options:{preview,fetcher,readArtifact:async path=>files.get(path)}};
}

test('release verifier compares responses with the exact local artifact',async()=>{
 const f=fixture();
 assert.ok((await verifyDeployment(f.origin,f.options)).length>10);
 const changed=fixture({alter:(path,result)=>{if(path==='/portrait.jpg')result.body='stale photo';}});
 await assert.rejects(verifyDeployment(changed.origin,changed.options),/artifact differs: \/portrait.jpg/);
 const missing=fixture({alter:(path,result)=>{if(path==='/__portfolio-release-missing__/')result.status=200;}});
 await assert.rejects(verifyDeployment(missing.origin,missing.options),/expected 404/);
});

test('preview verification requires noindex and invalid target never makes a request',async()=>{
 const f=fixture({preview:true});
 await verifyDeployment(f.origin,f.options);
 const indexed=fixture({preview:true,alter:(_path,result)=>{delete result.headers['X-Robots-Tag'];}});
 await assert.rejects(verifyDeployment(indexed.origin,indexed.options),/preview.*noindex/);
 let called=false;
 await assert.rejects(verifyDeployment('http://localhost',{fetcher:()=>{called=true;}}),/public HTTPS origin/);
 assert.equal(called,false);
});

test('artifact audit accepts Pages controls and checks their contents and copied bytes',async t=>{
 const directory=await mkdtemp(path.join(tmpdir(),'portfolio-pages-'));
 t.after(()=>rm(directory,{recursive:true,force:true}));
 for(const folder of ['scripts','public','dist'])await mkdir(path.join(directory,folder));
 await copyFile(new URL('scripts/audit.mjs',root),path.join(directory,'scripts','audit.mjs'));
 await writeFile(path.join(directory,'.gitignore'),'dist/\n');
 for(const name of ['_headers','_redirects']){
  const bytes=await readFile(new URL(`public/${name}`,root));
  for(const folder of ['public','dist'])await writeFile(path.join(directory,folder,name),bytes);
 }
 execFileSync('git',['init','--quiet'],{cwd:directory});
 const audit=()=>execFileSync(process.execPath,['scripts/audit.mjs'],{cwd:directory,encoding:'utf8',stdio:'pipe'});
 assert.match(audit(),/audit passed/);
 await writeFile(path.join(directory,'dist','_headers'),'stale');
 assert.throws(audit,/Stale copied asset: _headers/);
 await writeFile(path.join(directory,'public','_headers'),'-----BEGIN '+'PRIVATE KEY-----');
 assert.throws(audit,/Possible protected value in public\/_headers/);
});
