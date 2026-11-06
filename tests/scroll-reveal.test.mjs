import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

test('scroll entries replay after leaving either edge and preserve existing contact visibility',()=>{
 const source=readFileSync(new URL('../public/city-app.js',import.meta.url),'utf8');
 const start=source.indexOf("if('IntersectionObserver' in window){"),end=source.indexOf("document.addEventListener('visibilitychange'",start);
 assert.ok(start>=0&&end>start);
 function node(id=''){const classes=new Set();return{id,dataset:{},classes,entries:0,classList:{add(name){classes.add(name);},remove(name){classes.delete(name);},toggle(name,value){if(value)classes.add(name);else classes.delete(name);}},matches:()=>false};}
 const targets=Array.from({length:4},()=>node()),contact=node('contact'),body=node(),events={},observers=[];
 class Observer{constructor(callback,options){this.callback=callback;this.options=options;this.targets=[];observers.push(this);}observe(target){this.targets.push(target);}disconnect(){this.disconnected=true;}}
 runInNewContext(source.slice(start,end),{document:{querySelectorAll:selector=>selector.startsWith('.viewer-intro')?targets:[contact]},window:{IntersectionObserver:Observer,addEventListener:(name,fn)=>{events[name]=fn;}},IntersectionObserver:Observer,body});
 assert.deepEqual(targets.map(n=>n.dataset.scrollReveal),['up','left','down','right']);
 const observer=observers[0],enter=(target,visible,ratio=1)=>observer.callback([{target,isIntersecting:visible,intersectionRatio:ratio}]);
 enter(targets[0],true);assert.ok(targets[0].classes.has('is-revealed'));
 enter(targets[0],true,.01);assert.ok(targets[0].classes.has('is-revealed'),'partial exit does not flicker');
 enter(targets[0],false,0);assert.equal(targets[0].classes.has('is-revealed'),false);
 enter(targets[0],true);assert.ok(targets[0].classes.has('is-revealed'),'return from either edge re-arms the entrance');
 enter(contact,true);assert.ok(body.classes.has('contact-visible'));enter(contact,false,0);assert.equal(body.classes.has('contact-visible'),false);
 events.pagehide({persisted:true});assert.equal(observer.disconnected,undefined);events.pagehide({persisted:false});assert.equal(observer.disconnected,true);
});
