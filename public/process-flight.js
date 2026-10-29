const duration=16*420;

function frames(width){
 const result=[{offset:0,transform:'translate(-80px, 106px) rotate(0deg)'}];
 let time=0;
 for(let loop=0;loop<4;loop++){
  const x=72+(width-144)*loop/3;time+=.064;
  result.push({offset:time,transform:`translate(${x}px, 106px) rotate(${-loop*360}deg)`});
  for(let point=1;point<=40;point++){
   const angle=point/40*Math.PI*2;
   result.push({offset:time+.17*point/40,transform:`translate(${x+30*Math.sin(angle)}px, ${76+30*Math.cos(angle)}px) rotate(${-loop*360-point/40*360}deg)`});
  }
  time+=.17;
 }
 result.push({offset:1,transform:`translate(${width+80}px, 106px) rotate(-1440deg)`});
 return result;
}

export function createProcessFlight(block){
 const lane=block.querySelector('[data-process-flight]'),plane=block.querySelector('[data-process-plane]');
 let animation=null;
 function resize(){
  if(!animation)return;
  const width=block.ownerDocument.documentElement.clientWidth;
  lane.style.setProperty('--flight-width',width+'px');lane.style.setProperty('--flight-left',-block.getBoundingClientRect().left+'px');
  animation.effect.setKeyframes(frames(width));
 }
 if(lane&&plane?.animate){animation=plane.animate(frames(block.ownerDocument.documentElement.clientWidth),{duration,fill:'both',easing:'linear'});animation.pause();resize();}
 return {
  sync({count,active,reduced}){
   if(!animation)return;
   animation.pause();animation.currentTime=Math.min(16,Math.max(0,count))*420;
   const flying=active&&!reduced&&count<16;lane.hidden=!flying;
   if(flying)animation.play();
  },
  resize,
  destroy(){animation?.cancel();animation=null;if(lane)lane.hidden=true;},
 };
}
