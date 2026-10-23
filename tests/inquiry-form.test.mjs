import test from 'node:test';
import assert from 'node:assert/strict';
import * as phoneLibrary from 'libphonenumber-js/max';

test('the same-origin phone bundle loads on demand, shares an in-flight request and retries a known failure',async()=>{
 const {loadPhoneLibrary}=await import('../public/phone-library.js');
 const oldDocument=globalThis.document,oldLibrary=globalThis.libphonenumber,scripts=[];
 globalThis.document={createElement:()=>({remove(){this.removed=true;}}),head:{append(script){scripts.push(script);}}};
 delete globalThis.libphonenumber;
 try{
  assert.equal(scripts.length,0);
  const first=loadPhoneLibrary(),duplicate=loadPhoneLibrary();
  assert.equal(first,duplicate);assert.equal(scripts.length,1);
  assert.equal(scripts[0].src,'/vendor/libphonenumber-max.js');
  scripts[0].onerror();await assert.rejects(first);
  assert.equal(scripts[0].removed,true);
  const retry=loadPhoneLibrary();assert.equal(scripts.length,2);
  const {initInquiryForm}=await import('../public/inquiry-form.js');
  const f=fixture(),prepare=initInquiryForm(f.form)();
  f.fields.project.value='Edited before the phone library finishes';f.change('project');
  globalThis.libphonenumber=phoneLibrary;scripts[1].onload();
  assert.equal(await retry,phoneLibrary);await prepare;
  assert.equal(f.fields.phone.value,'(202) 555-0123');assert.equal(f.link.hidden,true);
  assert.equal(await loadPhoneLibrary(),phoneLibrary);assert.equal(scripts.length,2);
 }finally{globalThis.document=oldDocument;globalThis.libphonenumber=oldLibrary;}
});

class Field extends EventTarget{
 constructor(value=''){super();this.value=value;this.hidden=false;this.dataset={};this.attrs={};}
 setCustomValidity(message){this.validationMessage=message;}
 setAttribute(name,value){this.attrs[name]=value;}
 removeAttribute(name){delete this.attrs[name];if(name==='href')delete this.href;}
 focus(){this.focused=true;}
 setSelectionRange(start,end){this.selectionStart=start;this.selectionEnd=end;}
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(){
 const form=new EventTarget();form.dataset={emailError:'Invalid email',phoneError:'Invalid phone; no extension',loadingValidation:'Loading',validationUnavailable:'Try again',invalidFields:'Review the fields'};form.setAttribute=()=>{};form.removeAttribute=()=>{};
 const fields={name:new Field('João'),email:new Field('owner@example.com'),phone:new Field('2025550123'),phoneCountry:new Field('US'),project:new Field('A project')};
 const phoneFlag=new Field(),phoneDial=new Field(),link=new Field(),draft=new Field(),text=new Field(),status=new Field(),submit=new Field(),errors={email:new Field(),phone:new Field()};status.dataset.success='Draft ready';link.hidden=true;draft.hidden=true;
 Object.defineProperty(fields.phoneCountry,'selectedOptions',{get:()=>[{dataset:{dial:'+'+phoneLibrary.getCountryCallingCode(fields.phoneCountry.value)}}]});
 form.elements={namedItem:name=>fields[name]};
 form.querySelector=selector=>({'[data-phone-flag]':phoneFlag,'[data-phone-dial]':phoneDial,'#inquiry-email':link,'[data-draft]':draft,'#draft-text':text,'#inquiry-status':status,'[type="submit"]':submit,'#inquiry-email-error':errors.email,'#inquiry-phone-error':errors.phone}[selector]);
 form.reportValidity=()=>Object.values(fields).every(field=>!field.validationMessage);
 const change=(field,type='change',inputType)=>{const event=new Event(type);Object.defineProperty(event,'target',{value:fields[field]});Object.defineProperty(event,'inputType',{value:inputType});form.dispatchEvent(event);};
 const send=async()=>{form.dispatchEvent(new Event('submit',{cancelable:true}));await tick();};
 return{form,fields,phoneFlag,phoneDial,link,draft,text,status,errors,change,send};
}

test('the form normalizes valid contacts and invalidates the old draft on country changes and errors',async()=>{
 const {initInquiryForm}=await import('../public/inquiry-form.js');
 const oldLibrary=globalThis.libphonenumber;globalThis.libphonenumber=phoneLibrary;
 try{
  const f=fixture();initInquiryForm(f.form);
  await f.send();assert.equal(f.link.hidden,false);assert.ok(f.link.href.includes('body='));assert.ok(f.text.value.includes('+12025550123'));
  f.fields.phoneCountry.value='BR';f.change('phoneCountry');
  assert.equal(f.link.hidden,true);assert.equal(f.link.href,undefined);assert.equal(f.text.value,'');
  await f.send();assert.equal(f.link.hidden,true);assert.equal(f.errors.phone.hidden,false);
  f.fields.phone.value='+34 612 345 678';f.change('phone');f.fields.email.value='bad..email@example.com';f.change('email');
  await f.send();assert.equal(f.link.hidden,true);assert.equal(f.errors.email.hidden,false);assert.equal(f.fields.email.attrs['aria-invalid'],'true');
  f.fields.email.value=' valid@example.com ';f.change('email');await f.send();
  assert.equal(f.link.hidden,false);assert.ok(f.text.value.includes('E-mail: valid@example.com'));assert.ok(f.text.value.includes('+34612345678'));
  const preparing=f.send();f.fields.project.value='Changed while awaiting validation';f.change('project');await preparing;
  assert.equal(f.link.hidden,true);assert.equal(f.text.value,'');
 }finally{globalThis.libphonenumber=oldLibrary;}
});

test('live formatting preserves caret edits, deletion and supported international paste with its prefix',async()=>{
 const {initInquiryForm}=await import('../public/inquiry-form.js');
 const oldLibrary=globalThis.libphonenumber;globalThis.libphonenumber=phoneLibrary;
 try{
  const f=fixture(),prepare=initInquiryForm(f.form);await prepare();
  assert.equal(f.fields.phone.value,'(202) 555-0123');assert.equal(f.phoneDial.textContent,'+1');
  f.fields.phone.value='2025';f.fields.phone.selectionStart=4;f.change('phone','input','insertText');
  assert.equal(f.fields.phone.value,'(202) 5');assert.equal(f.fields.phone.selectionStart,7);
  f.fields.phone.value='(202) ';f.fields.phone.selectionStart=6;f.change('phone','input','deleteContentBackward');
  assert.equal(f.fields.phone.value,'(202)');
  f.fields.phone.value='(202';f.fields.phone.selectionStart=4;f.change('phone','input','deleteContentBackward');
  assert.equal(f.fields.phone.value,'20');assert.equal(f.fields.phone.selectionStart,2);
  f.fields.phone.value='(902) 5';f.fields.phone.selectionStart=2;f.change('phone','input','insertText');
  assert.equal(f.fields.phone.value,'(902) 5');assert.equal(f.fields.phone.selectionStart,2);
  f.fields.phone.value='+351912345678';f.fields.phone.selectionStart=13;f.change('phone','input','insertFromPaste');
  assert.equal(f.fields.phoneCountry.value,'PT');assert.equal(f.fields.phone.value,'912 345 678');
  assert.equal(f.phoneFlag.textContent,'🇵🇹');assert.equal(f.phoneDial.textContent,'+351');
  await f.send();assert.ok(f.text.value.includes('+351912345678'));
  f.fields.phoneCountry.value='US';f.change('phoneCountry');assert.equal(f.link.hidden,true);assert.equal(f.phoneDial.textContent,'+1');
  assert.equal(f.fields.phone.value,'(912) 345-678');
 }finally{globalThis.libphonenumber=oldLibrary;}
});
