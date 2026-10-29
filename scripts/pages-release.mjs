import assert from 'node:assert/strict';
import {setTimeout as delay} from 'node:timers/promises';

export const PRODUCTION_ORIGIN='https://ojoaovsousa.pages.dev';
const trigger=deployment=>deployment?.deployment_trigger?.metadata||{};
const successful=deployment=>deployment?.latest_stage?.name==='deploy'&&deployment.latest_stage.status==='success';

export async function deployPages({mode,sha,runId,client,upload,health,captureRecovery,verifyRecovery,record=()=>{},sleep=delay,polls=12}){
 assert.ok(['production','sandbox'].includes(mode),'Unknown deployment environment');
 assert.match(sha,/^[a-f0-9]{40}$/,'A full reviewed Git SHA is required');assert.match(runId,/^\d+$/,'A GitHub run ID is required');
 const production=mode==='production',branch=production?'main':'sandbox',environment=production?'production':'preview',message=`github-run:${runId}`;
 const receipt={mode,branch,sha,runId,previousDeploymentId:null,deploymentId:null};
 function attention(reason){record({...receipt,status:'needs-attention',reason});throw new Error(reason);}
 const project=await client.project();
 assert.equal(project.name,'ojoaovsousa','Unexpected Pages project');assert.equal(project.subdomain,'ojoaovsousa.pages.dev','Unexpected production hostname');assert.equal(project.production_branch,'main','Unexpected production branch');
 const previous=project.canonical_deployment;
 let recovery;
 if(production){assert.ok(previous?.id&&previous.environment==='production'&&successful(previous),'A successful previous production is required for recoverable deployment');receipt.previousDeploymentId=previous.id;recovery=await captureRecovery(previous);}
 const before=await client.deployments(),existing=before.filter(item=>item.environment===environment&&trigger(item).commit_hash===sha&&trigger(item).branch===branch);
 if(existing.length){receipt.deploymentId=existing[0].id;attention('Revision already has a deployment; reconcile its deployment ID before another upload');}
 const known=new Set(before.map(item=>item.id));
 if(production&&((await client.project()).canonical_deployment?.id!==previous.id))attention('Production changed before upload; another deployment must be reconciled');
 record({...receipt,status:'prepared'});
 // The coordinator makes exactly one upload attempt, even when the CLI response is lost.
 try{await upload({branch,sha,message});}catch{}
 let own;
 try{
  for(let attempt=0;attempt<polls;attempt++){
   const matches=(await client.deployments()).filter(item=>!known.has(item.id)&&item.environment===environment&&trigger(item).commit_hash===sha&&trigger(item).branch===branch&&trigger(item).commit_message===message);
   if(matches.length>1)attention('Deployment result unknown: multiple matching deployment IDs');
   if(matches.length===1){own=matches[0];receipt.deploymentId=own.id;break;}
   if(attempt+1<polls)await sleep(5000);
  }
 }catch(error){if(receipt.deploymentId===null)attention('Deployment reconciliation unavailable; result unknown, do not retry upload');throw error;}
 if(!own)attention('Deployment result unknown: no matching revision, branch and run marker; do not retry upload');
 try{
  for(let attempt=0;!successful(own)&&attempt<polls;attempt++){
   if(['failure','canceled'].includes(own.latest_stage?.status))attention('Deployment failed before confirmed publication; no rollback performed');
   if(attempt)await sleep(5000);own=await client.deployment(own.id);
  }
 }catch{attention('Deployment reconciliation failed; result unknown, do not retry upload');}
 if(!successful(own))attention('Deployment not ready after bounded reconciliation; do not retry upload');
 if(production){
  let current;try{current=(await client.project()).canonical_deployment?.id;}catch{attention('Production publication result unknown; ownership reconciliation unavailable');}
  if(current!==own.id)attention('Production publication not confirmed or superseded by another deployment');
 }
 record({...receipt,status:'published'});
 try{await health(production?PRODUCTION_ORIGIN:own.url,mode);}
 catch{
  if(!production){record({...receipt,status:'failed',reason:'sandbox-health'});throw new Error('Sandbox health failed; production was not rolled back');}
  let current;
  try{current=(await client.project()).canonical_deployment?.id;}catch{attention('Post-publication health failed but ownership is unknown; rollback not attempted');}
  if(current!==own.id)attention('Post-publication health failed after another deployment; rollback refused');
  // A timeout from this mutation is reconciled by reads, never by another POST.
  try{await client.rollback(previous.id);}catch{}
  let restored=false;
  try{
   for(let attempt=0;attempt<polls;attempt++){
    const id=(await client.project()).canonical_deployment?.id;
    if(id===previous.id){restored=true;break;}
    if(id!==own.id)attention('Rollback ownership changed to another deployment; operator action required');
    if(attempt+1<polls)await sleep(5000);
   }
  }catch{attention('Rollback result unknown; reconcile deployment IDs before any retry');}
  if(!restored)attention('Rollback result unknown; previous production is not confirmed');
  try{await verifyRecovery(recovery);}catch{attention('Rollback pointer restored but recovery health failed; operator action required');}
  record({...receipt,status:'rolled-back'});throw new Error('Post-publication health failed; previous deployment restored and verified');
 }
 const result={...receipt,status:'healthy',url:production?PRODUCTION_ORIGIN:own.url};record(result);return result;
}
