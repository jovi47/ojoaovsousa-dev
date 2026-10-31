import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {searchConfig} from '../src/search-discovery.mjs';

function publicOrigin(value){
 let config;try{config=searchConfig(value,'true');}catch{}
 assert.ok(config?.indexable,'Release verification needs a public HTTPS origin');
 return config.base;
}

// Read-only: compare the deployed responses with the local dist used for upload.
export async function verifyDeployment(origin,{preview=false,canonicalOrigin=origin,fetcher=fetch,readArtifact=pathname=>readFile(new URL(`../dist${pathname.endsWith('/')?pathname+'index.html':pathname}`,import.meta.url))}={}){
 origin=publicOrigin(origin);canonicalOrigin=publicOrigin(canonicalOrigin);
 const checks=[],headersFile=String(await readArtifact('/_headers'));
 const csp=headersFile.match(/  Content-Security-Policy: (.+)/)?.[1];
 assert.ok(csp,'Build dist with Pages headers before verification');
 async function request(pathname,status=200){
  const response=await fetcher(origin+pathname,{redirect:'manual',signal:AbortSignal.timeout(15000)});
  assert.equal(response.status,status,`${pathname}: expected ${status}, received ${response.status}`);
  checks.push(`${status} ${pathname}`);
  return response;
 }
 async function exact(pathname,localPath=pathname){
  const response=await request(pathname);
  const expectedType=pathname.endsWith('/')?/^text\/html\b/:({'.js':/^(?:text|application)\/javascript\b/,'.css':/^text\/css\b/,'.jpg':/^image\/jpeg\b/,'.woff2':/^font\/woff2\b/,'.glb':/^model\/gltf-binary\b/})[path.extname(pathname)];
  if(expectedType)assert.match(response.headers.get('content-type')||'',expectedType,`${pathname}: wrong content-type`);
  const bytes=Buffer.from(await response.arrayBuffer());
  assert.ok(bytes.equals(Buffer.from(await readArtifact(localPath))),`Deployed artifact differs: ${pathname}`);
  return {response,text:bytes.toString('utf8')};
 }
 async function redirect(from,to){
  const response=await request(from,301);
  assert.equal(new URL(response.headers.get('location'),origin).href,origin+to,`${from}: wrong redirect`);
 }
 const {text:root}=await exact('/');
 assert.ok(root.includes('<meta name="robots" content="noindex, nofollow">'),'Generic root must stay noindex');
 assert.ok(root.includes('<script src="/preferences.js"></script>'),'Generic root must load device preferences');
 for(const key of ['pt-br','en','es']){
  for(const ending of ['','/'])await redirect(`/${key}/black${ending}`,`/${key}/`);
  const {response,text}=await exact(`/${key}/`);
  for(const [name,value] of Object.entries({'x-content-type-options':'nosniff','x-frame-options':'DENY','referrer-policy':'strict-origin-when-cross-origin','permissions-policy':'camera=(), microphone=(), geolocation=()','content-security-policy':csp}))assert.equal(response.headers.get(name),value,`${key}: ${name}`);
  assert.ok(text.includes(`<link rel="canonical" href="${canonicalOrigin}/${key}/">`),`${key}: wrong canonical`);
  assert.ok(text.includes(`<meta name="robots" content="${preview?'noindex, nofollow':'index, follow'}">`),`${key}: wrong indexability`);
  if(preview)assert.match(response.headers.get('x-robots-tag')||'',/noindex/i,`${key}: preview requires noindex header`);
  else assert.doesNotMatch(response.headers.get('x-robots-tag')||'',/noindex/i,`${key}: production blocked by noindex header`);
 }
 for(const pathname of ['/pt-br/privacy/','/pt-br/terms/','/en/privacy/','/en/terms/','/es/privacy/','/es/terms/','/pt-br/direct/','/en/direct/','/es/direct/'])await exact(pathname);
 const {text:robots}=await exact('/robots.txt');
 assert.ok(robots.includes(preview?'Disallow: /':`Sitemap: ${canonicalOrigin}/sitemap.xml`),'Wrong robots release mode');
 const {text:sitemap}=await exact('/sitemap.xml');
 assert.equal((sitemap.match(/<loc>/g)||[]).length,preview?0:9,'Wrong sitemap release mode');
 for(const key of ['pt-br','en','es']){
  const {response}=await exact(`/${key}/index.md`);
  assert.match(response.headers.get('content-type')||'',/^text\/markdown\b/);
 }
 for(const pathname of ['/llms.txt','/black.css','/preferences.js','/city-app.js','/city.js','/portrait.jpg','/bricolage.woff2','/pixelify.woff2','/jovi-character.glb','/hori-character.glb','/andrea-character.glb','/vendor/three.module.js'])await exact(pathname);
 const missing=await request('/__portfolio-release-missing__/',404);
 assert.ok(Buffer.from(await missing.arrayBuffer()).equals(Buffer.from(await readArtifact('/404.html'))),'Unknown route must serve the custom404 artifact');
 return checks;
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 const [origin,mode='production',canonicalOrigin=origin]=process.argv.slice(2);
 try{
  assert.ok(origin&&['production','preview'].includes(mode),'Usage: node scripts/verify-cloudflare.mjs <https-origin> [production|preview] [canonical-origin]');
  const checks=await verifyDeployment(origin,{preview:mode==='preview',canonicalOrigin});
  console.log(`Read-only ${mode} verification passed: ${checks.length} HTTP/artifact checks at ${origin}`);
 }catch(error){console.error(error.message);process.exitCode=1;}
}
