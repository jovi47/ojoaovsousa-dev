import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createPagesClient,deploymentURL} from '../scripts/pages-api.mjs';
import {verifyRuntimeAssets,captureRecovery,verifyRecovery} from '../scripts/pages-health.mjs';
import {runDeployment} from '../scripts/deploy-pages.mjs';

const id='11111111-1111-4111-8111-111111111111',alias='https://11111111.ojoaovsousa.pages.dev',origin='https://ojoaovsousa.pages.dev';
const deployment={id,url:alias,environment:'production',latest_stage:{name:'deploy',status:'success'},deployment_trigger:{metadata:{branch:'main',commit_hash:'a'.repeat(40),commit_message:'example'}},env_vars:{protected:'must not be retained'}};
const config={accountId:'a'.repeat(32),project:'ojoaovsousa',token:'fictitious-test-token'};

test('the API client retains deployment identity only, paginates, and targets the documented rollback route once',async()=>{
 const requests=[];
 const client=createPagesClient({...config,fetcher:async(url,options)=>{
  requests.push({url,method:options.method});assert.equal(options.redirect,'error');assert.equal(options.headers.Authorization,'Bearer fictitious-test-token');
  const result=url.includes('/deployments?')?(new URL(url).searchParams.get('page')==='1'?[deployment]:[{...deployment,id:'22222222-2222-4222-8222-222222222222'}]):url.includes('/deployments/')?deployment:{name:'ojoaovsousa',subdomain:'ojoaovsousa.pages.dev',production_branch:'main',canonical_deployment:deployment,env_vars:{private:'discard'}};
  return Response.json({success:true,result,result_info:{total_pages:2}});
 }});
 const project=await client.project();assert.equal(project.canonical_deployment.id,id);assert.equal(project.env_vars,undefined);assert.equal(project.canonical_deployment.env_vars,undefined);
 assert.equal((await client.deployments()).length,2);assert.equal(requests.filter(r=>r.url.includes('/deployments?')).length,2);assert.equal((await client.deployment(id)).id,id);await client.rollback(id);
 assert.equal(requests.filter(r=>r.method==='POST').length,1);assert.ok(requests.at(-1).url.endsWith(`/deployments/${id}/rollback`));
});

test('invalid configuration and foreign deployment URLs fail before transmitting a token',()=>{
 for(const update of [{accountId:'unknown'},{project:'other-project'},{token:''}])assert.throws(()=>createPagesClient({...config,...update}));
 for(const value of ['http://11111111.ojoaovsousa.pages.dev','https://other.example','https://ojoaovsousa.pages.dev','https://11111111.ojoaovsousa.pages.dev/path','https://user@11111111.ojoaovsousa.pages.dev'])assert.throws(()=>deploymentURL(value));
 assert.equal(deploymentURL(alias),alias);
});

test('API failures do not print provider response bodies or tokens',async()=>{
 const client=createPagesClient({...config,fetcher:async()=>new Response('confidential provider error',{status:403})});
 await assert.rejects(client.project(),error=>error.message==='Cloudflare GET failed with HTTP 403');
});

test('the production entry point refuses local invocation and non-main workflow refs before reading credentials or uploading',async()=>{
 await assert.rejects(runDeployment('production',{GITHUB_ACTIONS:'false'}),/reviewed GitHub deployment workflow/);
 await assert.rejects(runDeployment('production',{GITHUB_ACTIONS:'true',GITHUB_REF:'refs/heads/feature'}),/main branch/);
});

test('all runtime JavaScript and CSS additions are compared with exact local bytes',async t=>{
 const directory=await mkdtemp(path.join(tmpdir(),'portfolio health '));t.after(()=>rm(directory,{recursive:true,force:true}));await mkdir(path.join(directory,'vendor'));
 await writeFile(path.join(directory,'city-inspection.js'),'inspection');await writeFile(path.join(directory,'interface-refinements.css'),'styles');await writeFile(path.join(directory,'vendor','extra.js'),'vendor');await writeFile(path.join(directory,'page.html'),'html');
 const files={'/city-inspection.js':'inspection','/interface-refinements.css':'styles','/vendor/extra.js':'vendor'};
 const fetcher=async url=>{const pathname=new URL(url).pathname;return new Response(files[pathname],{headers:{'Content-Type':pathname.endsWith('.css')?'text/css':'application/javascript'}});};
 assert.deepEqual(await verifyRuntimeAssets(origin,{artifactRoot:directory,fetcher}),Object.keys(files));
 files['/city-inspection.js']='stale';await assert.rejects(verifyRuntimeAssets(origin,{artifactRoot:directory,fetcher}),/Runtime artifact differs/);
});

test('recovery checks snapshot public production against its immutable alias and verify exact restored bytes',async()=>{
 const files=new Map();let stale=false;
 const fetcher=async url=>{
  const parsed=new URL(url),pathname=parsed.pathname,missing=pathname==='/__portfolio-release-missing__/';
  const body=/^\/(?:pt-br|en|es)\/$/.test(pathname)?`<link rel="canonical" href="${origin}${pathname}"><meta name="robots" content="index, follow">`:'healthy:'+pathname;
  files.set(pathname,body);return new Response(stale&&parsed.origin===origin?'changed':body,{status:missing?404:200});
 };
 const snapshot=await captureRecovery({id,url:alias},{fetcher});assert.equal(snapshot.samples.length,8);assert.ok(snapshot.samples.every(sample=>sample.hash.length===64));assert.ok(!JSON.stringify(snapshot).includes('healthy:'));
 await verifyRecovery(snapshot,{fetcher});stale=true;await assert.rejects(verifyRecovery(snapshot,{fetcher}),/Recovery bytes differ/);
});
