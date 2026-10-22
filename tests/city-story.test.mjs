import test from 'node:test';
import assert from 'node:assert/strict';
import {STORY_BANDS,storyScrollFrame,chapterTrackLengths,readingOffset,storyTrackHeight} from '../public/city-story.js';

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

test('track lengths reserve viewport-based building distances and measured text overflow plus its reading buffers',()=>{
 assert.deepEqual(chapterTrackLengths(600,{stack:900,horagora:0,andrea:200}),[850,1300,600,400,600,600,550]);
 assert.deepEqual(chapterTrackLengths(1000),[1200,400,900,400,900,400,800]);
});

test('each text reaches its last line with 240 pixels remaining before the next construction segment',()=>{
 const lengths=chapterTrackLengths(600,{stack:900,horagora:0,andrea:200});
 for(const {start,overflow,end,segment} of [
  {start:850,overflow:900,end:2150,segment:1},
  {start:2750,overflow:0,end:3150,segment:3},
  {start:3750,overflow:200,end:4350,segment:5},
 ]){
  const lastLine=storyScrollFrame(start+160+overflow,lengths);
  assert.equal(lastLine.segment,segment);
  assert.equal(readingOffset(lastLine.within,overflow),overflow);
  assert.equal(storyScrollFrame(end-1,lengths).segment,segment);
  assert.equal(storyScrollFrame(end,lengths).segment,segment+1);
 }
});

test('reading starts after its initial hold and never scrolls beyond the measured overflow',()=>{
 for(const [within,overflow,want] of [[0,900,0],[159,900,0],[160,900,0],[161,900,1],[610,900,450],[1060,900,900],[1300,900,900],[400,0,0],[-20,50,0]]){
  assert.equal(readingOffset(within,overflow),want);
 }
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
  assert.deepEqual(chapterTrackLengths(value,{stack:value,horagora:value,andrea:value}),[850,400,600,400,600,400,550]);
  assert.equal(readingOffset(value,900),0);
  assert.equal(readingOffset(900,value),0);
  assert.deepEqual(storyScrollFrame(value,[100,200,300,400,500,600,700]),{progress:0,segment:0,within:0,length:100});
 }
 for(const lengths of [undefined,null,{},[],[0,0,0,0,0,0,0],[NaN,-1,Infinity,null,undefined,'2',-Infinity]]){
  assert.deepEqual(storyScrollFrame(400,lengths),{progress:1,segment:6,within:0,length:0});
 }
 assert.deepEqual(chapterTrackLengths(0,null),[850,400,600,400,600,400,550]);
});
