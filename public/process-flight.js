const duration=16*420;

function frames(width,centers){
 const radius=34,result=[{offset:0,transform:`translate(-80px, ${centers[0].y+radius}px) rotate(0deg)`}];
 for(let loop=0;loop<4;loop++){
  const {x,y}=centers[loop],time=loop/4+.025;
  result.push({offset:time,transform:`translate(${x}px, ${y+radius}px) rotate(${-loop*360}deg)`});
  for(let point=1;point<=40;point++){
   const angle=point/40*Math.PI*2;
   result.push({offset:time+.2*point/40,transform:`translate(${x+radius*Math.sin(angle)}px, ${y+radius*Math.cos(angle)}px) rotate(${-loop*360-point/40*360}deg)`});
  }
 }
 result.push({offset:1,transform:`translate(${width+80}px, ${centers[3].y+radius}px) rotate(-1440deg)`});
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
