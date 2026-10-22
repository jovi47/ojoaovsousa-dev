import test from 'node:test';
import assert from 'node:assert/strict';
import {parsePhoneNumberFromString,getCountries} from 'libphonenumber-js/max';
import {inquiryDraft} from '../public/inquiry-state.js';
import {inquiry,document} from '../src/city-page.mjs';
import {content} from '../src/content.mjs';

const fields={name:' João Victor ',email:' owner+project@example.com ',phone:'(11) 98765-4321',phoneCountry:'BR',project:' Um projeto\ncom duas linhas. '};
const draft=changes=>inquiryDraft({...fields,...changes},parsePhoneNumberFromString);

test('the local draft validates supported national numbers and uses E.164 without guessing a country',()=>{
 for(const [phoneCountry,phone,canonical] of [['BR','(11) 98765-4321','+5511987654321'],['US','202 555 0123','+12025550123'],['ES','612 345 678','+34612345678'],['PT','912 345 678','+351912345678'],['','+1 202 555 0123','+12025550123'],['BR','+34 612 345 678','+34612345678']]){
  const url=new URL(draft({phoneCountry,phone}));
  assert.equal(url.pathname,'jovi47profissional@gmail.com');
  assert.equal(url.searchParams.get('subject'),'Novo projeto · João Victor');
  assert.ok(url.searchParams.get('body').includes(`Telefone / Phone: ${canonical}`));
  assert.ok(url.searchParams.get('body').includes('E-mail: owner+project@example.com'));
  assert.ok(url.searchParams.get('body').includes('Nome / Name: João Victor'));
 }
 for(const changes of [{phone:''},{phone:'123'},{phone:'Ligue +55 11 98765-4321'},{phone:'202 555 0123',phoneCountry:''},{phoneCountry:'XX'},{phone:'+1 202 555 0123 ext. 5'},{phone:'+1\n2025550123'}])assert.throws(()=>draft(changes),/phone/i);
});

test('email checks common address syntax and rejects controls and header-injection input',()=>{
 for(const email of ['person@example.com','first.last+brief@sub.example.co.uk',"o'connor@example.com"]){const url=new URL(draft({email}));assert.ok(url.searchParams.get('body').includes(`E-mail: ${email}`));}
 for(const email of ['','a..b@example.com','.a@example.com','a.@example.com','a@@example.com','a@localhost','a@-example.com','a@example_.com','a@example..com','a@example.com\r\nBcc:other@example.com','a@example.com\0','a'.repeat(65)+'@example.com','a'.repeat(255)+'@example.com'])assert.throws(()=>draft({email}),/email/i);
 assert.throws(()=>draft({name:'João\r\nBcc: other@example.com'}));
 assert.throws(()=>draft({name:'a'.repeat(121)}));
 assert.throws(()=>draft({project:'\0'}));
 assert.throws(()=>draft({project:'a'.repeat(3001)}));
});

test('all locales have required accessible phone/email controls and no eager validation bundle',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=inquiry(c,key),page=document(c,key,html);
  assert.match(html,/<label for="inquiry-phone">[^<]+<\/label>/);
  assert.match(html,/<input[^>]*id="inquiry-phone"[^>]*name="phone"[^>]*type="tel"[^>]*inputmode="tel"[^>]*autocomplete="tel"[^>]*required/);
  assert.match(html,/<label for="inquiry-country">[^<]+<\/label>/);
  assert.match(html,/<select[^>]*id="inquiry-country"[^>]*name="phoneCountry"/);
  const options=[...html.matchAll(/<option value="([A-Z]{2})">/g)].map(match=>match[1]);
  assert.deepEqual(new Set(options),new Set(getCountries()));
  assert.match(html,/<option value="">[^<]+<\/option>/);
  assert.doesNotMatch(html,/<option[^>]*\bselected/);
  for(const field of ['email','phone'])assert.ok(html.includes(`id="inquiry-${field}-error"`));
  assert.doesNotMatch(page,/<script[^>]*libphonenumber|<link[^>]*libphonenumber/);
  assert.ok(c.privacy.sections.some(section=>/telefone|phone|teléfono/i.test(section.body)),`${key}: phone disclosed in local-form privacy copy`);
 }
});
