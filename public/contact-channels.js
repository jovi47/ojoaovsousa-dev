export function initContactChannels(dialog){
 const button=dialog?.querySelector('[data-copy-email]'),status=dialog?.querySelector('[data-contact-status]'),address=dialog?.querySelector('[data-contact-email]');
 if(!button||!status||!address)return;
 button.addEventListener('click',async()=>{
  if(button.disabled)return;
  button.disabled=true;
  try{
   await navigator.clipboard.writeText(button.dataset.copyEmail);
   status.textContent=button.dataset.copied;
  }catch{
   status.textContent=button.dataset.copyFailed;
   address.focus({preventScroll:true});
   const selection=globalThis.getSelection?.();
   if(selection){const range=document.createRange();range.selectNodeContents(address);selection.removeAllRanges();selection.addRange(range);}
  }finally{button.disabled=false;}
 });
}
