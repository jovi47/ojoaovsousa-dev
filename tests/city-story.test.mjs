import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY_BANDS,storyScrollFrame,chapterTrackLengths,readingOffset,storyTrackHeight,storyScrollOffset} from '../public/city-story.js';

test('a height-capped scene still reserves enough page scroll to finish the last construction on tall screens',()=>{
 const lengths=chapterTrackLengths(1323),span=lengths.reduce((sum,n)=>sum+n,0);
 for(const [viewport,header,board] of [[1323,64,1000],[700,64,636],[700,60,640]]){
  const height=storyTrackHeight(viewport,header,board,lengths);
  const availableScroll=header+height-viewport;
  assert.ok(availableScroll>=span);
  assert.equal(storyScrollFrame(availableScroll,lengths).progress,1);
 }
 assert.equal(storyTrackHeight(NaN,undefined,-1,[NaN,-2]),0);
});

test('pixel distances map continuously to the existing story bands and exact boundaries enter the next segment',()=>{
 const lengths=[100,200,300,400,500,600,700];
 assert.deepEqual(storyScrollFrame(0,lengths),{progress:0,segment:0,within:0,length:100});
 assert.deepEqual(storyScrollFrame(50,lengths),{progress:.11,segment:0,within:50,length:100});
 assert.deepEqual(storyScrollFrame(100,lengths),{progress:.22,segment:1,within:0,length:200});
 assert.deepEqual(storyScrollFrame(200,lengths),{progress:.28,segment:1,within:100,length:200});
 assert.deepEqual(storyScrollFrame(600,lengths),{progress:.46,segment:3,within:0,length:400});
 assert.equal(storyScrollFrame(2800,lengths).progress,STORY_BANDS.at(-1));
});

test('building distances no longer add a separate reading interval for overflowing panels',()=>{
 assert.deepEqual(chapterTrackLengths(600,{stack:900,horagora:0,andrea:200}),[850,0,600,0,600,0,550]);
 assert.deepEqual(chapterTrackLengths(1000),[1200,0,900,0,900,0,800]);
 assert.equal(chapterTrackLengths(600).reduce((sum,n)=>sum+n,0),2600);
});

test('each panel scrolls proportionally while its building advances and finishes at the same segment end',()=>{
 const lengths=chapterTrackLengths(600),overflows=[900,0,200];let start=0;
 for(const [index,overflow] of overflows.entries()){
  const segment=index*2,length=lengths[segment];
  for(const fraction of [0,.25,.5,.75,.999]){
   const frame=storyScrollFrame(start+fraction*length,lengths);
   assert.equal(frame.segment,segment);
   assert.ok(Math.abs(readingOffset(frame.within,overflow,frame.length)-fraction*overflow)<1e-8);
  }
  assert.equal(readingOffset(length,overflow,length),overflow);
  assert.equal(storyScrollFrame(start+length,lengths).segment,segment+2);
  start+=length;
 }
});

test('reading follows the same normalized span in either scroll direction and clamps at both edges',()=>{
 for(const [within,overflow,length,want] of [[0,900,850,0],[425,900,850,450],[850,900,850,900],[1000,900,850,900],[212.5,900,850,225],[400,0,600,0],[-20,50,600,0],[100,50,0,0]]){
  assert.equal(readingOffset(within,overflow,length),want);
 }
});

test('hash navigation into a removed reading interval stays on that building instead of skipping ahead',()=>{
 const lengths=chapterTrackLengths(600);
 for(const [progress,segment] of [[.12,0],[.28,0],[.4,2],[.47,2],[.62,4],[.8,4],[.93,6]]){
  assert.equal(storyScrollFrame(storyScrollOffset(progress,lengths),lengths).segment,segment);
 }
 assert.equal(storyScrollOffset(-1,lengths),0);
 assert.equal(storyScrollOffset(1,lengths),2600);
 assert.equal(storyScrollOffset(10,lengths),2600);
 assert.equal(storyScrollOffset(NaN,lengths),0);
 assert.equal(storyScrollOffset(.5,[]),0);
});

test('negative offsets clamp to the beginning and past-end offsets settle at the final segment',()=>{
 const lengths=[100,200,300,400,500,600,700];
 assert.deepEqual(storyScrollFrame(-100,lengths),{progress:0,segment:0,within:0,length:100});
 for(const offset of [2800,5000])assert.deepEqual(storyScrollFrame(offset,lengths),{progress:1,segment:6,within:700,length:700});
 assert.deepEqual(storyScrollFrame(50,[0,100,0,0,0,0,0]),{progress:.28,segment:1,within:50,length:100});
});

test('zero or invalid dimensions stay finite without DOM access, including tracks reduced to zero distance',()=>{
 assert.equal(typeof document,'undefined');
 const invalid=[undefined,null,NaN,Infinity,-Infinity,-1,'600'];
 for(const value of invalid){
  assert.deepEqual(chapterTrackLengths(value,{stack:value,horagora:value,andrea:value}),[850,0,600,0,600,0,550]);
  assert.equal(readingOffset(value,900,600),0);
  assert.equal(readingOffset(900,value,600),0);
  assert.deepEqual(storyScrollFrame(value,[100,200,300,400,500,600,700]),{progress:0,segment:0,within:0,length:100});
 }
 for(const lengths of [undefined,null,{},[],[0,0,0,0,0,0,0],[NaN,-1,Infinity,null,undefined,'2',-Infinity]]){
  assert.deepEqual(storyScrollFrame(400,lengths),{progress:1,segment:6,within:0,length:0});
 }
 assert.deepEqual(chapterTrackLengths(0,null),[850,0,600,0,600,0,550]);
});
