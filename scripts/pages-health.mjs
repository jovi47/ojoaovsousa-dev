import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyDeployment} from './verify-cloudflare.mjs';
import {deploymentURL} from './pages-api.mjs';
import {PRODUCTION_ORIGIN} from './pages-release.mjs';

const hash=value=>createHash('sha256').update(value).digest('hex');
async function responseBytes(origin,pathname,status=200,fetcher=fetch){
 const response=await fetcher(origin+pathname,{redirect:'manual',signal:AbortSignal.timeout(15000)});assert.equal(response.status,status,`Unexpected health status: ${pathname}`);
 return {bytes:Buffer.from(await response.arrayBuffer()),type:response.headers.get('content-type')||''};
}
export async function verifyRuntimeAssets(origin,{artifactRoot=new URL('../dist/',import.meta.url),fetcher=fetch}={}){
 const root=artifactRoot instanceof URL?fileURLToPath(artifactRoot):artifactRoot,paths=[];
 async function walk(directory,prefix=''){
  for(const entry of await readdir(directory,{withFileTypes:true})){
   assert.ok(!entry.isSymbolicLink(),'Artifact links are forbidden');const name=prefix+entry.name;
   if(entry.isDirectory())await walk(path.join(directory,entry.name),name+'/');else if(/\.(?:js|css)$/.test(name))paths.push('/'+name);
  }
 }
 await walk(root);
 const covered=new Set(['/black.css','/city-app.js','/city.js','/vendor/three.module.js']);
 for(const pathname of paths.filter(value=>!covered.has(value)).sort()){
  const {bytes,type}=await responseBytes(origin,pathname,200,fetcher);assert.match(type,pathname.endsWith('.css')?/^text\/css\b/:/^(?:text|application)\/javascript\b/,`Wrong runtime MIME: ${pathname}`);
  assert.ok(bytes.equals(await readFile(path.join(root,pathname))),`Runtime artifact differs: ${pathname}`);
 }
 return paths.filter(value=>!covered.has(value));
}
export async function verifyRelease(origin,mode){
 const checks=await verifyDeployment(origin,{preview:mode==='sandbox',canonicalOrigin:PRODUCTION_ORIGIN});
 const extra=await verifyRuntimeAssets(origin);return checks.length+extra.length;
}
export async function captureRecovery(previous,{fetcher=fetch}={}){
 const alias=deploymentURL(previous.url),samples=[];
 for(const pathname of ['/pt-br/','/en/','/es/','/city.js','/viewer.css','/robots.txt','/sitemap.xml','/__portfolio-release-missing__/']){
  const status=pathname==='/__portfolio-release-missing__/'?404:200;
  const live=await responseBytes(PRODUCTION_ORIGIN,pathname,status,fetcher),frozen=await responseBytes(alias,pathname,status,fetcher);
  assert.ok(live.bytes.equals(frozen.bytes),`Previous production differs from its immutable deployment: ${pathname}`);
  if(/^\/(?:pt-br|en|es)\/$/.test(pathname)){
   const html=live.bytes.toString('utf8');assert.ok(html.includes(`<link rel="canonical" href="${PRODUCTION_ORIGIN}${pathname}">`),'Previous production canonical is unhealthy');assert.ok(html.includes('content="index, follow"'),'Previous production is not indexable');
  }
  samples.push({path:pathname,status,hash:hash(live.bytes)});
 }
 return {id:previous.id,samples};
}
export async function verifyRecovery(snapshot,{fetcher=fetch}={}){
 for(const sample of snapshot.samples){const {bytes}=await responseBytes(PRODUCTION_ORIGIN,sample.path,sample.status,fetcher);assert.equal(hash(bytes),sample.hash,`Recovery bytes differ: ${sample.path}`);}
}
