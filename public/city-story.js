export const STORY_BANDS=Object.freeze([0,.22,.34,.46,.6,.72,.86,1]);
const pixels=value=>Number.isFinite(value)?Math.max(0,value):0;

export function storyTrackHeight(viewportHeight,headerHeight,boardHeight,lengths=[]){
 return Math.ceil(Math.max(pixels(boardHeight),pixels(viewportHeight)-pixels(headerHeight))+(Array.isArray(lengths)?lengths:[]).reduce((sum,length)=>sum+pixels(length),0));
}

export function storyScrollFrame(offset,lengths=[]){
 let remaining=pixels(offset);
 const spans=Array.isArray(lengths)?lengths:[];
 for(let segment=0;segment<7;segment++){
  const length=pixels(spans[segment]);
  if(remaining<length){
   const progress=STORY_BANDS[segment]+remaining/length*(STORY_BANDS[segment+1]-STORY_BANDS[segment]);
   return {progress,segment,within:remaining,length};
  }
  remaining-=length;
 }
 const length=pixels(spans[6]);
 return {progress:1,segment:6,within:length,length};
}

export function chapterTrackLengths(viewportHeight){
 const height=pixels(viewportHeight);
 return [Math.max(850,height*1.2),0,Math.max(600,height*.9),0,
  Math.max(600,height*.9),0,Math.max(550,height*.8)];
}

export function readingOffset(within,overflow,length){
 return pixels(length)?pixels(overflow)*Math.min(1,pixels(within)/pixels(length)):0;
}

export function storyScrollOffset(progress,lengths=[]){
 const value=Math.min(1,pixels(progress)),spans=Array.isArray(lengths)?lengths:[];
 if(value===1)return spans.reduce((sum,length)=>sum+pixels(length),0);
 const segment=STORY_BANDS.findIndex((band,i)=>i<7&&value>=band&&value<STORY_BANDS[i+1]);
 const before=spans.slice(0,segment).reduce((sum,length)=>sum+pixels(length),0),length=pixels(spans[segment]);
 // Legacy chapter anchors may target a reading band; keep that building visible.
 return length?before+(value-STORY_BANDS[segment])/(STORY_BANDS[segment+1]-STORY_BANDS[segment])*length:Math.max(0,before-1);
}
