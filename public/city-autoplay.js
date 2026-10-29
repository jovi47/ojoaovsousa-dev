const ORDER=['challenge','stack','horagora','andrea'];
export function createMobileTour(select){
 const seen=new Set();let running=true,started=false,index=0;
 function visit(){const id=ORDER[index],building=!seen.has(id);seen.add(id);select(id,building);}
 return {
  get running(){return running;},
  pause(){running=false;},
  resume(){running=true;},
  choose(id){const next=ORDER.indexOf(id);if(next<0)return;running=false;started=true;index=next;visit();},
  tick(idleSeconds,active){
   if(!running||!active)return;
   if(!started){started=true;visit();return;}
   if(idleSeconds<10)return;
   index=(index+1)%ORDER.length;visit();
  }
 };
}
