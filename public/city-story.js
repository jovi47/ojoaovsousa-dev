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

export function chapterTrackLengths(viewportHeight,overflows={}){
 const height=pixels(viewportHeight);
 return [Math.max(850,height*1.2),pixels(overflows?.stack)+400,
  Math.max(600,height*.9),pixels(overflows?.horagora)+400,
  Math.max(600,height*.9),pixels(overflows?.andrea)+400,Math.max(550,height*.8)];
}

export function readingOffset(within,overflow){
 return Math.min(pixels(overflow),Math.max(0,pixels(within)-160));
}
