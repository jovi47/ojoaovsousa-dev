const instances=new WeakMap();
const labels={pt:'Mais conteúdo abaixo ↓',en:'More content below ↓',es:'Más contenido abajo ↓'};

export function initViewerOverflow(root=document){
 const card=root.querySelector('#viewer-card'),board=card?.closest('.viewer-board');
 if(!card||!board||instances.has(card))return ()=>{};
 const doc=card.ownerDocument,view=doc.defaultView,hint=doc.createElement('div');
 hint.className='viewer-overflow-hint';hint.setAttribute('aria-hidden','true');hint.hidden=true;board.append(hint);
 let frame=0,disposed=false;
 function update(){
  frame=0;if(disposed)return;
  const visible=!doc.hidden&&!card.hidden&&card.getClientRects().length>0&&view.getComputedStyle(card).visibility!=='hidden';
  hint.hidden=!(visible&&card.clientHeight>0&&card.scrollHeight-card.clientHeight-Math.max(0,card.scrollTop)>2);
  if(hint.hidden)return;
  hint.textContent=labels[doc.documentElement.lang.toLowerCase().split('-')[0]]||labels.pt;
  const rect=card.getBoundingClientRect(),parent=board.getBoundingClientRect();
  hint.style.left=(rect.left-parent.left-board.clientLeft+board.scrollLeft)+'px';
  hint.style.top=(rect.bottom-parent.top-board.clientTop+board.scrollTop)+'px';
  hint.style.width=rect.width+'px';
 }
 function schedule(){if(!disposed&&!frame)frame=view.requestAnimationFrame(update);}
 card.addEventListener('scroll',schedule,{passive:true});
 card.addEventListener('load',schedule,true);card.addEventListener('error',schedule,true);card.addEventListener('toggle',schedule,true);
 view.addEventListener('resize',schedule);doc.addEventListener('visibilitychange',schedule);
 const resize=view.ResizeObserver?new view.ResizeObserver(schedule):null;
 resize?.observe(card);resize?.observe(board);for(const panel of card.querySelectorAll('[data-viewer-card]'))resize?.observe(panel);
 const changes=view.MutationObserver?new view.MutationObserver(schedule):null;
 changes?.observe(card,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','open','class','style','data-active']});
 changes?.observe(board,{attributes:true,attributeFilter:['class','data-chapter-phase']});
 changes?.observe(doc.body,{attributes:true,attributeFilter:['class']});
 changes?.observe(doc.documentElement,{attributes:true,attributeFilter:['lang']});
 doc.fonts?.ready.then(schedule);update();
 const cleanup=()=>{
  if(disposed)return;disposed=true;view.cancelAnimationFrame(frame);resize?.disconnect();changes?.disconnect();
  card.removeEventListener('scroll',schedule);card.removeEventListener('load',schedule,true);card.removeEventListener('error',schedule,true);card.removeEventListener('toggle',schedule,true);
  view.removeEventListener('resize',schedule);doc.removeEventListener('visibilitychange',schedule);hint.remove();instances.delete(card);
 };
 instances.set(card,cleanup);return cleanup;
}
