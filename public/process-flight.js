const duration=16*420;

function frames(width,centers){
 const anchors=[{offset:0,x:-80,y:centers[0].y},...centers.map(({x,y},i)=>({offset:i/4+.125,x,y:y+(i%2?34:-34)})),{offset:1,x:width+80,y:centers[3].y}];
 const result=[{offset:0,transform:`translate(-80px, ${centers[0].y}px) rotate(0deg)`}];
 for(let segment=1;segment<anchors.length;segment++){
  const from=anchors[segment-1],to=anchors[segment],dx=to.x-from.x,dy=to.y-from.y;
  for(let point=1;point<=40;point++){
   const progress=point/40,eased=(1-Math.cos(Math.PI*progress))/2;
   const angle=point===40?0:Math.max(-45,Math.min(45,Math.atan2(dy*Math.PI/2*Math.sin(Math.PI*progress),dx)*180/Math.PI));
   result.push({offset:from.offset+(to.offset-from.offset)*progress,transform:`translate(${from.x+dx*progress}px, ${from.y+dy*eased}px) rotate(${angle}deg)`});
  }
 }
 return result;
}

export function createProcessFlight(block){
 const lane=block.querySelector('[data-process-flight]'),plane=block.querySelector('[data-process-plane]');
 const numbers=[...block.querySelectorAll?.('.project-process-number')||[]];
 let animation=null,observer=null;
 function route(){
  const root=block.getBoundingClientRect(),width=block.ownerDocument.documentElement.clientWidth;
  const centers=numbers.map(number=>{const rect=number.getBoundingClientRect();return {x:rect.left+rect.width/2,y:rect.top+rect.height/2-root.top};});
  lane.style.setProperty('--flight-width',width+'px');lane.style.setProperty('--flight-left',-root.left+'px');
  lane.style.setProperty('--flight-height',Math.max(...centers.map(({y})=>y))+80+'px');
  return frames(width,centers);
 }
 function resize(){
  if(!animation)return;
  animation.effect.setKeyframes(route());
 }
 if(lane&&plane?.animate&&numbers.length===4){
  animation=plane.animate(route(),{duration,fill:'both',easing:'linear'});animation.pause();
  const Resize=block.ownerDocument.defaultView?.ResizeObserver;
  if(Resize){observer=new Resize(resize);observer.observe(block);}
 }
 return {
  sync({count,active,reduced}){
   if(!animation)return;
   animation.pause();animation.currentTime=Math.min(16,Math.max(0,count))*420;
   const flying=active&&!reduced&&count<16;lane.hidden=!flying;
   if(flying)animation.play();
  },
  resize,
  destroy(){observer?.disconnect();animation?.cancel();animation=null;if(lane)lane.hidden=true;},
 };
}
