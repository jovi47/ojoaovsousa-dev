export const SIZE=5;
export const PIECES=[{x:2,y:0},{x:4,y:2},{x:1,y:3}];
export const EXIT={x:4,y:4};
export const createGame=()=>({x:0,y:0,collected:[],won:false,moves:0});
export function move(state,direction){
  const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];
  if(!delta||state.won) return state;
  const x=state.x+delta[0],y=state.y+delta[1];
  if(x<0||y<0||x>=SIZE||y>=SIZE) return state;
  const found=PIECES.findIndex(p=>p.x===x&&p.y===y);
  const collected=found>=0&&!state.collected.includes(found)?[...state.collected,found]:state.collected;
  return {x,y,collected,won:x===EXIT.x&&y===EXIT.y&&collected.length===PIECES.length,moves:state.moves+1};
}
