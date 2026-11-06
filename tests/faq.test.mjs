import test from 'node:test';
import assert from 'node:assert/strict';
import {renderFaq} from '../src/faq.mjs';

test('each locale renders eight independently expandable native answers under one accessible FAQ section',()=>{
 for(const [key,title] of [['pt-br','Dúvidas frequentes'],['en','Frequently asked questions'],['es','Preguntas frecuentes']]){
  const html=renderFaq(key);
  assert.match(html,/<section\b[^>]*id="faq"[^>]*aria-labelledby="faq-title"/);
  assert.ok(html.includes(`<h2 id="faq-title">${title}</h2>`));
  const items=[...html.matchAll(/<details\b([^>]*)>([\s\S]*?)<\/details>/g)];
  assert.equal(items.length,8);
  for(const [,attributes,body] of items){
   assert.doesNotMatch(attributes,/\b(?:open|name)=?/);
   assert.match(body,/^<summary><span>[^<]+<\/span><span[^>]*aria-hidden="true"[^>]*>\+<\/span><\/summary>/);
   assert.match(body,/<div class="faq-answer"><p>[^<]+<\/p><\/div>$/);
  }
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length);
  assert.doesNotMatch(html,/<(?:script|iframe|form)\b|\bon\w+=|https?:\/\/|application\/ld\+json/);
 }
});

test('unsupported locale keys retain the Portuguese FAQ without interpolating untrusted input',()=>{
 const expected=renderFaq('pt-br');
 for(const key of [undefined,null,'fr','<script>alert(1)</script>','__proto__'])assert.equal(renderFaq(key),expected);
 assert.notEqual(renderFaq('en'),expected);
 assert.notEqual(renderFaq('es'),expected);
});

test('the localized introduction reuses the inquiry action and technology advice keeps the stack open',()=>{
 for(const [key,cta,answer] of [
  ['pt-br','Ainda tem uma dúvida? Fale comigo','A tecnologia acompanha a necessidade do projeto. Avalio objetivo, integrações, orçamento e evolução para escolher a solução mais adequada, aproveitando a estrutura existente quando faz sentido.'],
  ['en','Still have a question? Talk to me','Technology follows the needs of the project. I assess the goal, integrations, budget and future development to choose the most suitable solution, making use of the existing setup when it makes sense.'],
  ['es','¿Todavía tienes una duda? Hablemos','La tecnología acompaña las necesidades del proyecto. Evalúo el objetivo, las integraciones, el presupuesto y la evolución para elegir la solución más adecuada, aprovechando la estructura existente cuando tiene sentido.'],
 ]){
  const html=renderFaq(key);
  assert.match(html,/<div class="faq-intro"><h2 id="faq-title">[^<]+<\/h2><p>[^<]+<\/p><button\b[^>]*type="button"[^>]*data-inquiry[^>]*>/);
  assert.ok(html.includes(`>${cta}</button></div><div class="faq-list">`));
  assert.ok(html.includes(`<p>${answer}</p>`));
  assert.doesNotMatch(html,/Elixir|Java|<form\b/);
 }
});
