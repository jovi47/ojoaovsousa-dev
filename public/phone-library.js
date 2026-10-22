let pending;
export function loadPhoneLibrary(){
 if(globalThis.libphonenumber?.parsePhoneNumberFromString)return Promise.resolve(globalThis.libphonenumber);
 if(!pending)pending=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src='/vendor/libphonenumber-max.js';script.async=true;
  let finished=false;
  const finish=error=>{
   if(finished)return;finished=true;clearTimeout(timeout);script.onload=script.onerror=null;
   if(error){script.remove();reject(error);}else resolve(globalThis.libphonenumber);
  };
  script.onload=()=>finish(globalThis.libphonenumber?.parsePhoneNumberFromString?null:new Error('phone-unavailable'));
  script.onerror=()=>finish(new Error('phone-unavailable'));
  const timeout=setTimeout(()=>finish(new Error('phone-unavailable')),10000);
  document.head.append(script);
 }).catch(error=>{pending=null;throw error;});
 return pending;
}
