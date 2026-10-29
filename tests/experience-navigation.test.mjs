import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
test('experience navigation opens the career on clicks and direct fragment entry only',()=>{
 const source=readFileSync(new URL('../public/city-app.js',import.meta.url),'utf8'),start=source.indexOf('function openExperience(){'),end=source.indexOf('for(const details',start);
 assert.ok(start>=0&&end>start);
 let opened=0,click;const events={},location=new URL('http://localhost:3000/pt-br/direct/#contact');
 const link={href:'#experience',addEventListener(_event,fn){click=fn;}};
 const ctx={URL,location,document:{querySelector:()=>({setAttribute(name){assert.equal(name,'open');opened++;}}),querySelectorAll:()=>[link]},window:{addEventListener:(name,fn)=>{events[name]=fn;}}};
 runInNewContext(source.slice(start,end),ctx);assert.equal(opened,0);click();assert.equal(opened,1);
 location.hash='#experience';events.hashchange();assert.equal(opened,2);
 location.hash='#contact';events.hashchange();assert.equal(opened,2);
 location.hash='#experience';runInNewContext(source.slice(start,end),ctx);assert.equal(opened,3);
});
