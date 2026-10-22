export function buildMotion(progress,from,to){
 let t=0;
 if(Number.isFinite(progress)&&Number.isFinite(from)&&Number.isFinite(to)){
  const ratio=to>from?(progress-from)/(to-from):Number(progress>=to);
  t=Number.isNaN(ratio)?0:Math.min(1,Math.max(0,ratio));
 }
 const eased=t*t*(3-2*t);
 return {yaw:(eased-1)*Math.PI*.75,zoom:1.18-.18*eased,complete:t>=1};
}

export function coastStep(velocity,dt){
 const speed=Number.isFinite(velocity)?velocity:0;
 if(!Number.isFinite(dt)||dt<=0||speed===0)return {deltaYaw:0,velocity:speed};
 const exponent=-1.6*dt;
 return {deltaYaw:speed*-Math.expm1(exponent)/1.6,velocity:speed*Math.exp(exponent)};
}
