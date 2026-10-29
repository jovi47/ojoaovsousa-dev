const labels={
 pt:{title:'Explore a construção',close:'Fechar visualização',hint:'Arraste para girar · Veja os detalhes abaixo'},
 en:{title:'Explore the building',close:'Close inspection',hint:'Drag to rotate · See details below'},
 es:{title:'Explora la construcción',close:'Cerrar vista',hint:'Arrastra para girar · Mira los detalles abajo'},
};

export function createInspection({canvas,panel,onOpen=()=>{},onClose=()=>{},onResize=()=>{}}){
 const doc=canvas.ownerDocument,view=doc.defaultView,world=canvas.closest('.world-stage');
 const copy=labels[doc.documentElement.lang.split('-')[0]]||labels.en;
 const dialog=doc.createElement('dialog'),top=doc.createElement('div'),heading=doc.createElement('h2'),closeButton=doc.createElement('button'),hint=doc.createElement('p');
 dialog.className='viewer-inspection';dialog.setAttribute('aria-label',copy.title);
 top.className='viewer-inspection-top';heading.textContent=copy.title;
 closeButton.type='button';closeButton.className='icon-button';closeButton.textContent='×';closeButton.setAttribute('aria-label',copy.close);closeButton.autofocus=true;
 hint.className='viewer-inspection-hint';hint.textContent=copy.hint;
 top.append(heading,closeButton);dialog.append(top,hint);doc.body.append(dialog);
 let active=false,disposed=false,frame=0,slots=[],pagePosition={left:0,top:0,behavior:'instant'};
 function resize(){if(frame)view.cancelAnimationFrame(frame);frame=view.requestAnimationFrame(()=>{frame=0;if(!disposed)onResize();});}
 function restore(){
  if(!active)return;active=false;
  for(const {node,marker,hidden} of slots){marker.parentNode.insertBefore(node,marker);marker.remove();if(node===panel)node.hidden=hidden;}
  slots=[];onClose();canvas.focus({preventScroll:true});view.scrollTo?.(pagePosition);resize();
 }
 function close(){if(!active)return;dialog.close();restore();}
 function open(title=copy.title){
  if(disposed||!world)return false;
  heading.textContent=title||copy.title;dialog.setAttribute('aria-label',heading.textContent);
  if(active)return true;
  // Show first so unsupported/failed dialogs leave the live renderer untouched.
  pagePosition={left:view.scrollX||0,top:view.scrollY||0,behavior:'instant'};
  dialog.showModal();active=true;
  for(const node of [world,panel].filter(Boolean)){
   const marker=doc.createComment('inspection-slot');node.parentNode.insertBefore(marker,node);slots.push({node,marker,hidden:node.hidden});dialog.append(node);
  }
  if(panel)panel.hidden=false;
  onOpen();resize();return true;
 }
 closeButton.addEventListener('click',close);dialog.addEventListener('close',restore);
 function dispose(){if(disposed)return;close();disposed=true;if(frame)view.cancelAnimationFrame(frame);frame=0;closeButton.removeEventListener('click',close);dialog.removeEventListener('close',restore);dialog.remove();}
 return {open,close,dispose,get active(){return active;}};
}
