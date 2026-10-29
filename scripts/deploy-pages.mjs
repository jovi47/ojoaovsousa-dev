import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {appendFile,cp,lstat,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createPagesClient} from './pages-api.mjs';
import {deployPages} from './pages-release.mjs';
import {captureRecovery,verifyRecovery,verifyRelease} from './pages-health.mjs';

const exec=promisify(execFile),root=fileURLToPath(new URL('../',import.meta.url));
export async function runDeployment(mode,env=process.env){
 assert.equal(env.GITHUB_ACTIONS,'true','Use the reviewed GitHub deployment workflow');
 if(mode==='production')assert.equal(env.GITHUB_REF,'refs/heads/main','Production requires the main branch');
 const client=createPagesClient({accountId:env.CLOUDFLARE_ACCOUNT_ID,project:env.CLOUDFLARE_PAGES_PROJECT,token:env.CLOUDFLARE_API_TOKEN});
 const sha=(await exec('git',['rev-parse','HEAD'],{cwd:root})).stdout.trim();assert.equal(sha,env.GITHUB_SHA,'Checkout does not match the workflow revision');
 if(mode==='production'){
  const main=(await exec('git',['ls-remote','--exit-code','origin','refs/heads/main'],{cwd:root})).stdout.split(/\s/)[0];
  assert.equal(sha,main,'A newer main revision exists; do not publish an older queued revision');
 }
 assert.equal((await exec('git',['status','--porcelain'],{cwd:root})).stdout.trim(),'','Deploy only a clean reviewed source revision');
 await exec(process.execPath,['scripts/audit.mjs'],{cwd:root});
 for(const name of ['_worker.js','functions']){let exists=false;try{await lstat(path.join(root,'dist',name));exists=true;}catch(error){if(error.code!=='ENOENT')throw error;}assert.ok(!exists,'This pipeline uploads static assets only');}
 const receipts=[];
 const record=value=>{receipts.push(value);console.log(JSON.stringify(value));};
 try{
  return await deployPages({mode,sha,runId:env.GITHUB_RUN_ID,client,captureRecovery,verifyRecovery,record,
   async health(origin,target){
    for(let attempt=0;attempt<3;attempt++){
     try{return await verifyRelease(origin,target);}catch(error){if(attempt===2)throw error;await new Promise(resolve=>setTimeout(resolve,5000));}
    }
   },
   async upload({branch,message}){
    const temporary=await mkdtemp(path.join(tmpdir(),'portfolio-pages-'));
    try{
     // Wrangler sees only the audited artifact, with no parent checkout/config/functions.
     await cp(path.join(root,'dist'),path.join(temporary,'assets'),{recursive:true});
     await exec('npx',['--yes','wrangler@4.155.0','pages','deploy','assets','--project-name','ojoaovsousa','--branch',branch,'--commit-hash',sha,'--commit-message',message,'--commit-dirty=false'],{cwd:temporary,env:{...env,CI:'true',WRANGLER_SEND_METRICS:'false'},timeout:300000,maxBuffer:1024*1024});
    }finally{await rm(temporary,{recursive:true,force:true});}
   },
  });
 }finally{
  const last=receipts.at(-1);
  if(last&&env.GITHUB_STEP_SUMMARY)await appendFile(env.GITHUB_STEP_SUMMARY,`\n### Cloudflare Pages\n\nStatus: ${last.status}\n\nRevision: ${sha}\n\nDeployment: ${last.deploymentId||'unconfirmed'}\n\nPrevious production: ${last.previousDeploymentId||'not applicable'}\n\n${last.reason||''}\n`);
 }
}

if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1])){
 try{await runDeployment(process.argv[2]);}catch(error){console.error(error.message);process.exitCode=1;}
}
