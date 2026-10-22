import {inquiryDraft,normalizeEmail,normalizePhone,formatPhoneInput} from './inquiry-state.js';
import {loadPhoneLibrary} from './phone-library.js';
import {phoneCountryFlag} from './phone-countries.js';

export function initInquiryForm(form){
 if(!form)return()=>{};
 const fields=Object.fromEntries(['name','email','phone','phoneCountry','project'].map(name=>[name,form.elements.namedItem(name)]));
 const link=form.querySelector('#inquiry-email'),draft=form.querySelector('[data-draft]'),text=form.querySelector('#draft-text'),status=form.querySelector('#inquiry-status'),submit=form.querySelector('[type="submit"]');
 const errors={email:form.querySelector('#inquiry-email-error'),phone:form.querySelector('#inquiry-phone-error')};
 const phoneFlag=form.querySelector('[data-phone-flag]'),phoneDial=form.querySelector('[data-phone-dial]');
 let revision=0,library,previousPhoneValue=fields.phone.value,countryChanged=false;
 function updatePrefix(){
  if(phoneFlag)phoneFlag.textContent=phoneCountryFlag(fields.phoneCountry.value);
  const code=fields.phoneCountry.selectedOptions?.[0]?.dataset.dial;
  if(phoneDial)phoneDial.textContent=code||(library?'+'+library.getCountryCallingCode(fields.phoneCountry.value):'');
 }
 function formatPhone(event){
  if(!library)return;
  let raw=fields.phone.value,caret=fields.phone.selectionStart;
  const deleting=event?.inputType?.startsWith('deleteContent');
  if(deleting&&/^\+?[\d ().-]*$/.test(previousPhoneValue.trim())&&raw!==previousPhoneValue&&raw.replace(/\D/g,'')===previousPhoneValue.replace(/\D/g,'')){
   const backwards=event.inputType==='deleteContentBackward';
   let index=backwards?caret-1:caret;
   while(index>=0&&index<raw.length&&!/\d/.test(raw[index]))index+=backwards?-1:1;
   if(index>=0&&index<raw.length){raw=raw.slice(0,index)+raw.slice(index+1);if(index<caret)caret--;}
  }
  const formatted=formatPhoneInput(raw,fields.phoneCountry.value,library,{countryChanged});
  fields.phone.value=formatted.value;fields.phoneCountry.value=formatted.country;countryChanged=false;updatePrefix();
  if(Number.isInteger(caret)&&event?.target===fields.phone){
   const after=raw.slice(caret).replace(/\D/g,'').length,wanted=formatted.value.replace(/\D/g,'').length-after;
   let position=formatted.value.length;
   if(after){let digits=0;position=0;while(position<formatted.value.length&&digits<wanted)if(/\d/.test(formatted.value[position++]))digits++;}
   fields.phone.setSelectionRange(position,position);
  }
  previousPhoneValue=fields.phone.value;
 }
 async function preparePhone(current,event){
  try{library=await loadPhoneLibrary();if(current===revision){formatPhone(event);if(status.textContent===form.dataset.loadingValidation)status.textContent='';}}
  catch{if(current===revision)status.textContent=form.dataset.validationUnavailable;}
 }
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
  if(event.target===fields.phone||event.target===fields.phoneCountry){
   fieldError('phone',false);countryChanged=event.target===fields.phoneCountry;updatePrefix();
   if(library)formatPhone(event);else void preparePhone(revision,event);
  }
 }
 form.addEventListener('input',changed);form.addEventListener('change',changed);
 fields.email.addEventListener('blur',validateEmail);
 fields.phone.addEventListener('blur',async()=>{const current=revision;try{const library=await loadPhoneLibrary();if(current===revision)validatePhone(library);}catch{if(current===revision)status.textContent=form.dataset.validationUnavailable;}});
 form.addEventListener('submit',async event=>{
  event.preventDefault();clearDraft();const current=revision;
  submit.disabled=true;form.setAttribute('aria-busy','true');status.textContent=form.dataset.loadingValidation;
  try{
   library=await loadPhoneLibrary();if(current!==revision)return;formatPhone();
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
  await preparePhone(current);
 };
}
