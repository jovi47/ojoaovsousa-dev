export function createProjectExamples(block){
 const examples=[...block.querySelectorAll('[data-process-example]')],view=block.ownerDocument.defaultView;
 let timer=null,index=0,active=false;
 function stop(){if(timer!==null)view.clearTimeout(timer);timer=null;}
 function schedule(){if(!active||timer!==null||examples.length<2)return;timer=view.setTimeout(()=>{timer=null;examples[index].hidden=true;index=(index+1)%examples.length;examples[index].hidden=false;schedule();},5000);}
 return {setActive(value){active=value;if(active)schedule();else stop();},destroy(){active=false;stop();examples.forEach((example,i)=>{example.hidden=i!==0;});}};
}
