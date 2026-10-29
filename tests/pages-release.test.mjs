import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {deployPages} from '../scripts/pages-release.mjs';

const sha='a'.repeat(40),previousId='11111111-1111-4111-8111-111111111111',ownId='22222222-2222-4222-8222-222222222222',otherId='33333333-3333-4333-8333-333333333333';
const deployment=(id,{hash='b'.repeat(40),branch='main',message='previous',status='success'}={})=>({id,url:`https://${id.slice(0,8)}.ojoaovsousa.pages.dev`,environment:branch==='main'?'production':'preview',latest_stage:{name:'deploy',status},deployment_trigger:{metadata:{commit_hash:hash,branch,commit_message:message}}});
function fixture(options={}){
 const calls=[],receipts=[],previous=deployment(previousId);let current=previous,own;
 const list=[previous,...(options.existing||[])];
 const client={
  async project(){calls.push('project');return {name:'ojoaovsousa',subdomain:'ojoaovsousa.pages.dev',production_branch:'main',canonical_deployment:current};},
  async deployments(){calls.push('list');if(options.failReconcile&&own)throw new Error('API unavailable');return list;},
  async deployment(){return own;},
  async rollback(id){calls.push('rollback:'+id);if(!options.rollbackStaysCurrent)current=previous;if(options.rollbackUnknown)throw new Error('network timeout');},
 };
 const input={mode:options.mode||'production',sha,runId:'123',client,sleep:async()=>{},polls:2,
  async upload({branch,message}){calls.push('upload');if(!options.noCandidate){own=deployment(ownId,{hash:sha,branch,message,status:options.pending?'active':'success'});list.push(own);if(branch==='main'&&!options.pending)current=own;}if(options.uploadUnknown)throw new Error('CLI response lost');},
  async captureRecovery(value){calls.push('capture:'+value.id);if(options.precheckFailure)throw new Error('Previous production is unhealthy');return {id:value.id};},
  async health(origin,mode){calls.push('health:'+mode);if(options.superseded)current=deployment(otherId);if(options.healthFailure)throw new Error('wrong artifact');return [origin];},
  async verifyRecovery(snapshot){calls.push('recovery:'+snapshot.id);if(options.recoveryFailure)throw new Error('recovery health failed');},
  record(value){receipts.push(value);},
 };
 return {input,calls,receipts};
}

test('production captures a recovery target before one upload and verifies its exact deployment',async()=>{
 const f=fixture(),result=await deployPages(f.input);
 assert.equal(result.status,'healthy');assert.equal(result.deploymentId,ownId);assert.equal(result.previousDeploymentId,previousId);
 assert.ok(f.calls.indexOf('capture:'+previousId)<f.calls.indexOf('upload'));assert.equal(f.calls.filter(v=>v==='upload').length,1);assert.ok(f.calls.includes('health:production'));assert.ok(!f.calls.some(v=>v.startsWith('rollback:')));
});

test('a pre-publication check failure never uploads or rolls back',async()=>{
 const f=fixture({precheckFailure:true});await assert.rejects(deployPages(f.input),/Previous production/);
 assert.ok(!f.calls.includes('upload'));assert.ok(!f.calls.some(v=>v.startsWith('rollback:')));
});

test('failed post-publication health rolls back only this deployment and proves recovery',async()=>{
 const f=fixture({healthFailure:true});await assert.rejects(deployPages(f.input),/previous deployment restored/);
 assert.equal(f.calls.filter(v=>v==='rollback:'+previousId).length,1);assert.ok(f.calls.includes('recovery:'+previousId));assert.equal(f.receipts.at(-1).status,'rolled-back');
});

test('a lost CLI response is reconciled by revision, branch, marker and deployment ID without retry',async()=>{
 const f=fixture({uploadUnknown:true}),result=await deployPages(f.input);
 assert.equal(result.deploymentId,ownId);assert.equal(result.status,'healthy');assert.equal(f.calls.filter(v=>v==='upload').length,1);
});

test('an upload with no confirmed deployment or unavailable reconciliation stops without mutation retry',async()=>{
 for(const options of [{uploadUnknown:true,noCandidate:true},{uploadUnknown:true,failReconcile:true},{pending:true}]){
  const f=fixture(options);await assert.rejects(deployPages(f.input),/unknown|reconciliation|not ready/i);
  assert.equal(f.calls.filter(v=>v==='upload').length,1);assert.ok(!f.calls.some(v=>v.startsWith('rollback:')));assert.equal(f.receipts.at(-1).status,'needs-attention');
 }
});

test('an already deployed revision is reconciled before allowing any new upload',async()=>{
 const f=fixture({existing:[deployment(ownId,{hash:sha})]});await assert.rejects(deployPages(f.input),/already has a deployment/);
 assert.ok(!f.calls.includes('upload'));assert.equal(f.receipts.at(-1).deploymentId,ownId);
});

test('the same SHA on another branch does not masquerade as this release',async()=>{
 const f=fixture({existing:[deployment(otherId,{hash:sha,branch:'sandbox'})]});assert.equal((await deployPages(f.input)).deploymentId,ownId);
});

test('health failure never rolls back over another writer or a later deployment',async()=>{
 const f=fixture({healthFailure:true,superseded:true});await assert.rejects(deployPages(f.input),/another deployment/);
 assert.ok(!f.calls.some(v=>v.startsWith('rollback:')));assert.equal(f.receipts.at(-1).status,'needs-attention');
});

test('a lost rollback response is read-reconciled without sending another rollback',async()=>{
 const f=fixture({healthFailure:true,rollbackUnknown:true});await assert.rejects(deployPages(f.input),/previous deployment restored/);
 assert.equal(f.calls.filter(v=>v.startsWith('rollback:')).length,1);assert.ok(f.calls.includes('recovery:'+previousId));
 const unknown=fixture({healthFailure:true,rollbackUnknown:true,rollbackStaysCurrent:true});await assert.rejects(deployPages(unknown.input),/rollback.*unknown/i);
 assert.equal(unknown.calls.filter(v=>v.startsWith('rollback:')).length,1);assert.ok(!unknown.calls.includes('recovery:'+previousId));assert.equal(unknown.receipts.at(-1).status,'needs-attention');
});

test('sandbox verifies the noindex deployment alias without mutating production recovery',async()=>{
 const f=fixture({mode:'sandbox'}),result=await deployPages(f.input);assert.equal(result.status,'healthy');assert.equal(result.branch,'sandbox');assert.ok(f.calls.includes('health:sandbox'));assert.ok(!f.calls.some(v=>v.startsWith('capture:')||v.startsWith('rollback:')));
 const failed=fixture({mode:'sandbox',healthFailure:true});await assert.rejects(deployPages(failed.input),/Sandbox health failed/);assert.ok(!failed.calls.some(v=>v.startsWith('rollback:')));
});

test('the workflow runs checks only for deployment, serializes production and does not expose checkout credentials',async()=>{
 const workflow=await readFile(new URL('../.github/workflows/deploy-pages.yml',import.meta.url),'utf8');
 assert.match(workflow,/branches: \[main\]/);assert.doesNotMatch(workflow,/pull_request|schedule:/);assert.match(workflow,/workflow_dispatch:/);assert.match(workflow,/options: \[sandbox, production\]/);assert.match(workflow,/cancel-in-progress: false/);assert.match(workflow,/queue: max/);assert.match(workflow,/persist-credentials: false/);
 assert.ok(workflow.indexOf('run: npm run build')<workflow.indexOf('run: npm test'));assert.match(workflow,/INDEXABLE:/);assert.match(workflow,/CLOUDFLARE_API_TOKEN: \$\{\{ secrets.CLOUDFLARE_API_TOKEN \}\}/);assert.doesNotMatch(workflow,/upload-artifact|cache:/);
});
