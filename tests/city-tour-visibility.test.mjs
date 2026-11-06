import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createMobileTour} from '../public/city-autoplay.js';

test('manual choice stays paused until the entire phone section exits, then returns with a fresh dwell',()=>{
 const source=readFileSync(new URL('../public/city.js',import.meta.url),'utf8');
 const start=source.indexOf('const visibility=new IntersectionObserver('),end=source.indexOf('const themeObserver=',start);
 assert.ok(start>=0&&end>start);
 const visits=[],tour=createMobileTour((id)=>visits.push(id)),board={},canvas={},cleanups=[];let callback;
 const context={board,canvas,cleanups,mobileEntry:true,inspection:{active:false},mobileTour:tour,landmarkIdleTime:30,inView:true,last:12,raf:4,invalidate(){},cancelAnimationFrame(){},IntersectionObserver:class{constructor(fn){callback=fn;}observe(){}disconnect(){}}};
 runInNewContext(source.slice(start,end),context);
 tour.choose('horagora');assert.equal(tour.running,false);
 const entry=(target,visible,ratio)=>callback([{target,isIntersecting:visible,intersectionRatio:ratio}]);
 entry(canvas,false,0);assert.equal(tour.running,false,'canvas exit alone is not section exit');
 entry(board,true,.01);assert.equal(tour.running,false,'a partly visible section preserves manual choice');
 context.inspection.active=true;entry(board,false,0);assert.equal(tour.running,false,'opening the inspector does not restart the tour');
 context.inspection.active=false;entry(board,false,0);assert.equal(tour.running,true);assert.equal(context.landmarkIdleTime,0);
 entry(canvas,true,.5);tour.tick(0,true);tour.tick(9.99,true);assert.deepEqual(visits,['horagora']);
 tour.tick(10,true);assert.deepEqual(visits,['horagora','andrea']);
 tour.pause();context.mobileEntry=false;entry(board,false,0);assert.equal(tour.running,false,'desktop exit does not change mobile tour state');
});
