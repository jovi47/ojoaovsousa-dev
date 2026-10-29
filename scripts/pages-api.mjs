import assert from 'node:assert/strict';

export function deploymentURL(value){
 const url=new URL(value);assert.equal(url.protocol,'https:');assert.match(url.hostname,/^[a-z0-9-]+\.ojoaovsousa\.pages\.dev$/);
 assert.ok(!url.username&&!url.password&&!url.port&&url.pathname==='/'&&!url.search&&!url.hash,'Unexpected deployment URL');return url.origin;
}
function deployment(value){
 assert.match(value?.id||'',/^[a-f0-9-]{36}$/,'Invalid deployment ID');
 return {id:value.id,url:deploymentURL(value.url),environment:value.environment,latest_stage:{name:value.latest_stage?.name,status:value.latest_stage?.status},deployment_trigger:{metadata:{branch:value.deployment_trigger?.metadata?.branch,commit_hash:value.deployment_trigger?.metadata?.commit_hash,commit_message:value.deployment_trigger?.metadata?.commit_message}}};
}

export function createPagesClient({accountId,project,token,fetcher=fetch}){
 assert.match(accountId||'',/^[a-f0-9]{32}$/,'Configure CLOUDFLARE_ACCOUNT_ID');assert.equal(project,'ojoaovsousa','Configure CLOUDFLARE_PAGES_PROJECT=ojoaovsousa');assert.ok(token,'Configure CLOUDFLARE_API_TOKEN');
 const base=`https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${project}`;
 async function request(suffix='',method='GET'){
  let response;try{response=await fetcher(base+suffix,{method,redirect:'error',headers:{Authorization:`Bearer ${token}`},signal:AbortSignal.timeout(15000)});}catch{throw new Error(`Cloudflare ${method} response unknown`);}
  if(!response.ok)throw new Error(`Cloudflare ${method} failed with HTTP ${response.status}`);
  let data;try{data=await response.json();}catch{throw new Error(`Cloudflare ${method} returned an unreadable response`);}
  assert.equal(data.success,true,`Cloudflare ${method} was not confirmed`);return data;
 }
 const id=value=>{assert.match(value,/^[a-f0-9-]{36}$/);return value;};
 return {
  async project(){const {result}=await request();return {name:result.name,subdomain:result.subdomain,production_branch:result.production_branch,canonical_deployment:result.canonical_deployment?deployment(result.canonical_deployment):null};},
  async deployments(){
   const values=[];
   for(let page=1;page<=20;page++){
    const data=await request(`/deployments?per_page=100&page=${page}`);assert.ok(Array.isArray(data.result));values.push(...data.result.map(deployment));
    if(data.result_info?.total_pages?page>=data.result_info.total_pages:data.result.length<100)return values;
   }
   throw new Error('Deployment history exceeds bounded reconciliation; operator action required');
  },
  async deployment(value){return deployment((await request(`/deployments/${id(value)}`)).result);},
  async rollback(value){await request(`/deployments/${id(value)}/rollback`,'POST');},
 };
}
