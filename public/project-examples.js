export function createProjectExamples(block,random=Math.random){
 const examples=[...block.querySelectorAll('[data-process-example]')],view=block.ownerDocument.defaultView;
 const order=[...examples];
 for(let i=order.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 examples.forEach(example=>{example.hidden=example!==order[0];});
 let timer=null,index=0,active=false;
 function stop(){if(timer!==null)view.clearTimeout(timer);timer=null;}
 function schedule(){if(!active||timer!==null||examples.length<2)return;timer=view.setTimeout(()=>{timer=null;order[index].hidden=true;index=(index+1)%order.length;order[index].hidden=false;schedule();},5000);}
 return {setActive(value){active=value;if(active)schedule();else stop();},destroy(){active=false;stop();examples.forEach((example,i)=>{example.hidden=i!==0;});}};
}
