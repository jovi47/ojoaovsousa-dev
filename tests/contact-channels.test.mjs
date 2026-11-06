import test from 'node:test';
import assert from 'node:assert/strict';
import {inquiry,socialIcon} from '../src/city-page.mjs';
import {content} from '../src/content.mjs';
import {initContactChannels} from '../public/contact-channels.js';

test('the localized contact dialog offers three explicit channels without collecting or submitting fields',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=inquiry(c,key);
  assert.match(html,/<dialog\b[^>]*id="inquiry-dialog"[^>]*aria-labelledby="inquiry-title"/);
  assert.match(html,/<button[^>]*data-close[^>]*type="button"|<button[^>]*type="button"[^>]*data-close/);
  assert.doesNotMatch(html,/<(?:form|input|textarea|select)\b|data-draft|type="submit"|captcha|turnstile/i);
  assert.match(html,/<a class="contact-channel button contact-channel-primary" href="https:\/\/wa\.me\/5579998230872" target="_blank" rel="noopener noreferrer"/);
  assert.ok(html.includes('href="mailto:jovi47profissional@gmail.com"'));
  assert.ok(html.includes('href="https://www.linkedin.com/in/jovi47/"'));
  assert.ok(html.includes(socialIcon('whatsapp'))&&html.includes(socialIcon('linkedin')));
  assert.match(html,/data-copy-email="jovi47profissional@gmail.com"/);
  assert.match(html,/data-contact-email tabindex="-1">jovi47profissional@gmail.com<\/span>/);
  assert.match(html,/data-contact-status role="status"/);
  assert.ok(c.privacy.sections.some(section=>/WhatsApp/.test(section.body)&&/LinkedIn/.test(section.body)),`${key}: chosen external channels disclosed`);
 }
});

class CopyButton extends EventTarget{
 disabled=false;
 dataset={copyEmail:'jovi47profissional@gmail.com',copied:'Copied',copyFailed:'Select and copy the email address'};
}
function copyFixture(t,writeText){
 const oldNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator'),oldDocument=globalThis.document,oldSelection=globalThis.getSelection;
 const button=new CopyButton(),status={textContent:''},address={focused:false,focus(){this.focused=true;}},selection={selected:null,removeAllRanges(){},addRange(range){this.selected=range.node;}};
 Object.defineProperty(globalThis,'navigator',{value:{clipboard:{writeText}},configurable:true});
 globalThis.document={createRange:()=>({selectNodeContents(node){this.node=node;}})};
 globalThis.getSelection=()=>selection;
 t.after(()=>{if(oldNavigator)Object.defineProperty(globalThis,'navigator',oldNavigator);else delete globalThis.navigator;globalThis.document=oldDocument;globalThis.getSelection=oldSelection;});
 const dialog={querySelector:selector=>({'[data-copy-email]':button,'[data-contact-status]':status,'[data-contact-email]':address}[selector])};
 initContactChannels(dialog);
 return {button,status,address,selection};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('copy email writes only the public address once and announces completion',async t=>{
 const writes=[];let finish;
 const f=copyFixture(t,value=>{writes.push(value);return new Promise(resolve=>{finish=resolve;});});
 f.button.dispatchEvent(new Event('click'));f.button.dispatchEvent(new Event('click'));
 assert.deepEqual(writes,['jovi47profissional@gmail.com']);assert.equal(f.button.disabled,true);
 finish();await tick();
 assert.equal(f.status.textContent,'Copied');assert.equal(f.button.disabled,false);assert.equal(f.address.focused,false);
});

test('clipboard denial keeps the address available and selects it for manual copying',async t=>{
 const f=copyFixture(t,async()=>{throw new Error('Clipboard permission denied');});
 f.button.dispatchEvent(new Event('click'));await tick();
 assert.equal(f.status.textContent,'Select and copy the email address');assert.equal(f.address.focused,true);
 assert.equal(f.selection.selected,f.address);assert.equal(f.button.disabled,false);
});
