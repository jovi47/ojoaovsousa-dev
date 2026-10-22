import {inquiryDraft,normalizeEmail,normalizePhone} from './inquiry-state.js';
import {loadPhoneLibrary} from './phone-library.js';

export function initInquiryForm(form){
 if(!form)return()=>{};
 const fields=Object.fromEntries(['name','email','phone','phoneCountry','project'].map(name=>[name,form.elements.namedItem(name)]));
 const link=form.querySelector('#inquiry-email'),draft=form.querySelector('[data-draft]'),text=form.querySelector('#draft-text'),status=form.querySelector('#inquiry-status'),submit=form.querySelector('[type="submit"]');
 const errors={email:form.querySelector('#inquiry-email-error'),phone:form.querySelector('#inquiry-phone-error')};
 let revision=0;
 form.noValidate=true;
 function clearDraft(){revision++;link.hidden=true;link.removeAttribute('href');draft.hidden=true;text.value='';status.textContent='';}
 function fieldError(name,invalid){
  const message=invalid?form.dataset[name+'Error']:'';
  fields[name].setCustomValidity(message);fields[name].setAttribute('aria-invalid',String(invalid));
  errors[name].hidden=!invalid;errors[name].textContent=message;
 }
 function validateEmail(){try{fields.email.value=normalizeEmail(fields.email.value);fieldError('email',false);return true;}catch{fieldError('email',true);return false;}}
 function validatePhone(library){try{normalizePhone(fields.phone.value,fields.phoneCountry.value,library.parsePhoneNumberFromString);fieldError('phone',false);return true;}catch{fieldError('phone',true);return false;}}
 function changed(event){
  clearDraft();
  if(event.target===fields.email)fieldError('email',false);
  if(event.target===fields.phone||event.target===fields.phoneCountry)fieldError('phone',false);
 }
 form.addEventListener('input',changed);form.addEventListener('change',changed);
 fields.email.addEventListener('blur',validateEmail);
 fields.phone.addEventListener('blur',async()=>{const current=revision;try{const library=await loadPhoneLibrary();if(current===revision)validatePhone(library);}catch{if(current===revision)status.textContent=form.dataset.validationUnavailable;}});
 form.addEventListener('submit',async event=>{
  event.preventDefault();clearDraft();const current=revision;
  submit.disabled=true;form.setAttribute('aria-busy','true');status.textContent=form.dataset.loadingValidation;
  try{
   const library=await loadPhoneLibrary();if(current!==revision)return;
   const emailValid=validateEmail(),phoneValid=validatePhone(library);
   status.textContent='';if(!form.reportValidity()||!emailValid||!phoneValid)return;
   link.href=inquiryDraft(Object.fromEntries(Object.entries(fields).map(([name,field])=>[name,field.value])),library.parsePhoneNumberFromString);
   text.value=new URL(link.href).searchParams.get('body');link.hidden=false;draft.hidden=false;status.textContent=status.dataset.success;
   link.focus({preventScroll:true});
  }catch(error){if(current===revision)status.textContent=error.message==='phone-unavailable'?form.dataset.validationUnavailable:form.dataset.invalidFields;}
  finally{submit.disabled=false;form.removeAttribute('aria-busy');}
 });
 return async()=>{
  const current=revision;status.textContent=form.dataset.loadingValidation;
  try{await loadPhoneLibrary();if(current===revision&&status.textContent===form.dataset.loadingValidation)status.textContent='';}
  catch{if(current===revision)status.textContent=form.dataset.validationUnavailable;}
 };
}
