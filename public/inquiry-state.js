import {isPhoneCountry} from './phone-countries.js';

const controls=/[\u0000-\u001f\u007f-\u009f]/;
export function normalizeEmail(value){
 if(typeof value!=='string'||controls.test(value))throw new Error('email');
 const email=value.trim(),parts=email.split('@'),[local,domain]=parts;
 if(parts.length!==2||email.length>254||!local||local.length>64||!domain||!/^[-A-Za-z0-9!#$%&'*+/=?^_`{|}~.]+$/.test(local)||local.startsWith('.')||local.endsWith('.')||local.includes('..'))throw new Error('email');
 const labels=domain.split('.');
 if(labels.length<2||labels.some(label=>!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))||!/^(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/.test(labels.at(-1)))throw new Error('email');
 return email;
}
export function normalizePhone(value,phoneCountry,library){
 if(typeof value!=='string'||value.length>64||controls.test(value)||!/^\+?[\d ().-]+$/.test(value.trim())||!isPhoneCountry(phoneCountry))throw new Error('phone');
 if(typeof library?.parsePhoneNumberFromString!=='function')throw new Error('phone-unavailable');
 let phone;try{phone=library.parsePhoneNumberFromString(value.trim(),{defaultCountry:phoneCountry||undefined,extract:false});}catch{throw new Error('phone');}
 if(!phone||!phone.isValid()||phone.ext||!isPhoneCountry(phone.country)||phone.countryCallingCode!==library.getCountryCallingCode(phoneCountry))throw new Error('phone');
 return phone.number;
}
export function formatPhoneInput(value,country,library,{countryChanged=false}={}){
 if(!isPhoneCountry(country)||!/^\+?[\d ().-]*$/.test(value.trim()))return {value,country};
 let national=value.trim();
 if(national.startsWith('+')){
  const international=new library.AsYouType();international.input(national);
  const detected=international.getCountry();
  if(!detected||!isPhoneCountry(detected))return {value,country};
  if(!countryChanged)country=detected;
  const number=international.getNumber();
  national=number&&!countryChanged?number.formatNational():international.getNationalNumber();
 }
 const formatter=new library.AsYouType(country),formatted=formatter.input(national),number=formatter.getNumber();
 return {value:number?.isValid()?number.formatNational():formatted,country};
}
export function inquiryDraft({name,email,phone,phoneCountry,project},library){
 if(typeof name!=='string'||controls.test(name)||!name.trim()||name.trim().length>120)throw new Error('name');
 if(typeof project!=='string'||/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/.test(project)||!project.trim()||project.trim().length>3000)throw new Error('project');
 const address=normalizeEmail(email),number=normalizePhone(phone,phoneCountry,library);
 const body=`Nome / Name: ${name.trim()}\nE-mail: ${address}\nTelefone / Phone: ${number}\n\nProjeto / Project:\n${project.trim()}`;
 return `mailto:jovi47profissional@gmail.com?subject=${encodeURIComponent('Novo projeto · João Victor')}&body=${encodeURIComponent(body)}`;
}
