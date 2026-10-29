import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
test('the opening scroll cue dismisses after half a viewport of descent and stays dismissed at the top',()=>{
 const source=readFileSync(new URL('../public/city.js',import.meta.url),'utf8');
 const start=source.indexOf(" const more=document.querySelector('[data-more-content]');");
 const end=source.indexOf('syncMore();',start)+'syncMore();'.length;
 assert.ok(start>=0&&end>start);
 const more={},events={};
 const context={document:{querySelector:()=>more,documentElement:{scrollHeight:4000}},window:{scrollBy(){}},innerHeight:897,scrollY:0,reduced:false,mobileEntry:true,assembled:true,on:(_target,name,handler)=>{events[name]=handler;}};
 runInNewContext(source.slice(start,end),context);
 assert.equal(more.hidden,false);
 context.scrollY=40;events.scroll();assert.equal(more.hidden,false);
 context.scrollY=0;events.scroll();assert.equal(more.hidden,false);
 context.scrollY=400;events.scroll();assert.equal(more.hidden,false);
 context.scrollY=500;events.scroll();assert.equal(more.hidden,true);
 context.scrollY=0;events.scroll();assert.equal(more.hidden,true);
 events.resize();assert.equal(more.hidden,true);
});

test('desktop cue starts after assembly and dismisses only after scrolling into the reading content',()=>{
 const source=readFileSync(new URL('../public/city.js',import.meta.url),'utf8');
 const start=source.indexOf(" const more=document.querySelector('[data-more-content]');"),end=source.indexOf('syncMore();',start)+'syncMore();'.length;
 const more={},events={};
 const context={document:{querySelector:()=>more,documentElement:{scrollHeight:6000}},window:{scrollBy(){}},innerHeight:800,scrollY:0,reduced:false,mobileEntry:false,assembled:false,on:(_target,name,handler)=>{events[name]=handler;}};
 runInNewContext(source.slice(start,end),context);assert.equal(more.hidden,true);
 context.scrollY=2600;events.scroll();assert.equal(more.hidden,true);
 context.assembled=true;context.scrollY=0;context.syncMore();assert.equal(more.hidden,false);
 context.scrollY=100;events.scroll();assert.equal(more.hidden,false);
 context.scrollY=420;events.scroll();assert.equal(more.hidden,true);
 context.scrollY=0;events.resize();assert.equal(more.hidden,true);
});
