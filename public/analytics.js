const consentKey='portfolio.analytics.v1',lifetime=90*24*60*60*1000;

export function setupAnalytics(){
 const panel=document.querySelector('#analytics-consent');
 if(!panel)return;
 const {location}=window;
 const production=location.origin==='https://ojoaovsousa.pages.dev';
 const local=location.protocol==='http:'&&['localhost','127.0.0.1'].includes(location.hostname);
 const preview=panel.dataset.preview==='true'&&local;
 if(!production&&!local)return;
 const home=()=>/^\/(pt-br|en|es)\/$/.test(location.pathname)&&!location.search&&!location.hash;
 const protectedBrowser=()=>navigator.doNotTrack==='1'||navigator.doNotTrack==='yes'||window.doNotTrack==='1'||navigator.globalPrivacyControl===true;
 const safeReferrer=()=>{
  if(!document.referrer)return true;
  try{
   const ref=new URL(document.referrer);
   if(!['http:','https:'].includes(ref.protocol)||ref.username||ref.password||ref.search||ref.hash)return false;
   return ref.origin===location.origin?/^\/(pt-br|en|es)\/(?:direct\/|privacy\/|terms\/)?$/.test(ref.pathname):ref.pathname==='/';
  }catch{return false;}
 };
 let enabled=false,choice='';
 try{
  const stored=JSON.parse(localStorage.getItem(consentKey)||'null'),age=Date.now()-stored?.at;
  if(stored&&typeof stored.at==='number'&&age>=0&&age<lifetime&&['granted','denied'].includes(stored.choice))choice=stored.choice;
 }catch{/* Storage is optional; no remembered grant means no SDK. */}

 function clearCookies(){
  try{for(const name of ['_clck','_clsk'])for(const domain of production?['','; Domain=ojoaovsousa.pages.dev']:['']){
   document.cookie=`${name}=; Max-Age=0; Path=/; SameSite=Lax${location.protocol==='https:'?'; Secure':''}${domain}`;
  }}catch{/* A browser cookie restriction must not interrupt recovery. */}
 }
 function start(){
  if(enabled||(!production&&!preview)||protectedBrowser()||!home()||!safeReferrer())return;
  enabled=true;
  try{
   window.clarity=function(...args){(window.clarity.q||=[]).push(args);};
   window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});
   const script=document.createElement('script');
   script.async=true;script.referrerPolicy='no-referrer';script.src='https://www.clarity.ms/tag/z43jc8necn';
   document.head.append(script);
  }catch{/* Analytics failure must not interrupt the portfolio or its controls. */}
 }
 const deny=panel.querySelector('[data-consent="denied"]'),accept=panel.querySelector('[data-consent="granted"]');
 function show(){
  panel.hidden=false;
  deny.textContent=enabled?panel.dataset.denyReload:panel.dataset.deny;
  accept.disabled=protectedBrowser();
  panel.querySelector('[data-privacy-signal]').hidden=!protectedBrowser();
 }
 for(const button of document.querySelectorAll('[data-analytics-preferences]')){
  button.hidden=false;
  button.addEventListener('click',()=>{show();panel.scrollIntoView({block:'start'});deny.focus({preventScroll:true});});
 }
 for(const button of [deny,accept])button.addEventListener('click',()=>{
  const accepted=button===accept&&!protectedBrowser();
  try{localStorage.setItem(consentKey,JSON.stringify({choice:accepted?'granted':'denied',at:Date.now()}));}
  catch{if(!accepted)try{localStorage.removeItem(consentKey);}catch{/* Browser storage controls remain available. */}}
  panel.hidden=true;
  if(accepted)start();
  else{
   clearCookies();
   // Reload ends an already loaded SDK; consent denied alone still collects without cookies.
   if(enabled)window.location.reload();
  }
 });
 // This is a static site, with no History API router. Fragment/history entry stops this page.
 for(const event of ['hashchange','popstate'])window.addEventListener(event,()=>{if(enabled&&!home())window.location.reload();});
 window.addEventListener('storage',event=>{if(enabled&&(event.key===consentKey||event.key===null))window.location.reload();});
 if(choice==='granted'&&!protectedBrowser())start();
 else clearCookies();
 accept.disabled=protectedBrowser();
 panel.querySelector('[data-privacy-signal]').hidden=!protectedBrowser();
 if(!choice&&home()&&!protectedBrowser())show();
}
setupAnalytics();
