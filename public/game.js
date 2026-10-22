import {SIZE,PIECES,EXIT,createGame,move} from './game-state.js';
const dialog=document.querySelector('#game-dialog');
const board=document.querySelector('#game-board');
const text=document.querySelector('#game-data');
if(dialog&&board&&text){
  const copy=JSON.parse(text.textContent);
  const status=document.querySelector('#game-status');
  const count=document.querySelector('#game-count');
  const log=document.querySelector('#game-log');
  const location=document.querySelector('#game-location');
  const coords=(x,y)=>copy.coordinates.replace('{x}',x+1).replace('{y}',y+1);
  let state=createGame();
  function paint(){
    board.replaceChildren();
    for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
      const cell=document.createElement('span');cell.className='game-tile';
      const piece=PIECES.findIndex(p=>p.x===x&&p.y===y);
      if(piece>=0&&!state.collected.includes(piece)){
        cell.classList.add('has-piece',`piece-${piece}`);cell.innerHTML='<i class="collectible"></i>';
      }
      if(x===EXIT.x&&y===EXIT.y){cell.classList.add('exit-tile');cell.innerHTML=`<span>${state.collected.length===3?'↗':'◇'}</span>`;}
      if(x===state.x&&y===state.y){cell.classList.add('player-tile');const player=document.createElement('b');player.className='game-player';const toy=document.querySelector('#tour-guide .brick-person')?.cloneNode(true);if(toy){toy.className='brick-person game-person';toy.dataset.pose='idle';player.append(toy);}else player.textContent='J';cell.append(player);}
      board.append(cell);
    }
    count.textContent=`${state.collected.length} / 3`;
    const remaining=PIECES.map((piece,index)=>state.collected.includes(index)?null:`${copy.pieces[index].name}: ${coords(piece.x,piece.y)}`).filter(Boolean);
    const orientation=`${copy.position}: ${coords(state.x,state.y)}. ${copy.remaining}: ${remaining.length?remaining.join('; '):'0'}. ${copy.exitLabel}: ${coords(EXIT.x,EXIT.y)}.`;
    location.textContent=orientation;
    board.setAttribute('aria-label',orientation);
    log.replaceChildren();
    for(const index of state.collected){const item=document.createElement('li');const title=document.createElement('strong');title.textContent=copy.pieces[index].name;const p=document.createElement('p');p.textContent=copy.pieces[index].body;item.append(title,p);log.append(item);}
    if(state.won){board.classList.add('won');status.textContent=copy.win;}
    else if(state.collected.length===3)status.textContent=copy.exitPrompt;
    else board.classList.remove('won');
  }
  function step(direction){
    const before=state;state=move(state,direction);
    status.textContent=state===before?copy.blocked:state.collected.length>before.collected.length?`${copy.collected} ${copy.pieces[state.collected.at(-1)].name}`:copy.initial;
    paint();
  }
  document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>{state=createGame();status.textContent=copy.initial;paint();dialog.showModal();document.querySelector('[data-move="up"]').focus();}));
  document.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>step(button.dataset.move)));
  document.querySelector('#game-reset').addEventListener('click',()=>{state=createGame();status.textContent=copy.initial;paint();});
  dialog.addEventListener('keydown',event=>{const direction={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[event.key];if(direction){event.preventDefault();step(direction);}});
  paint();
}
