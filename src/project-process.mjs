import {renderProjectExamples} from './project-preview.mjs';
import {escape as e} from './city-page.mjs';

const descriptionHtml=text=>e(text).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');

const copy={
 'pt-br':{
  label:'Da ideia à implementação',choose:'Etapas do projeto',preview:'Prévia ilustrativa do processo',window:'Prévia do projeto',
  steps:[
   ['Sua ideia','Você conta o **objetivo**, para quem é o projeto e o que já existe.','Uma ideia começa a ganhar forma.'],
   ['Análise','Organizamos **requisitos**, fluxos e limites para definir um **escopo claro**.','Briefing analisado. Próximos passos definidos.'],
   ['Orçamento','O escopo orienta uma proposta com **estimativa**, prioridades e **critérios de entrega**.','Proposta preparada para revisão.'],
   ['Implementação','Sua **solução sob medida**, pronta para transformar o dia a dia do seu negócio.','Implementando e revisando o projeto.'],
  ],
  terminal:'Processo ilustrativo',logs:[['Recebendo sua ideia','Objetivo e público identificados','Esboço inicial preparado'],['Analisando o briefing','Fluxos e limites organizados','Escopo definido para revisão'],['Preparando a proposta','Estimativa e prioridades a combinar','Critérios de entrega em revisão'],['Implementando por etapas','Revisando conteúdo e navegação','Simulando a publicação aprovada']],
  complete:'Implementação concluída nesta demonstração.',
  siteTitle:'Espaços com intenção',siteText:'Arquitetura e interiores para viver melhor.',siteType:'Estúdio fictício',siteAction:'Conheça o estúdio',siteServices:['Arquitetura','Interiores'],
 },
 en:{
  label:'From idea to implementation',choose:'Project stages',preview:'Illustrative process preview',window:'Project preview',
  steps:[
   ['Your idea','Tell me the **goal**, who the project is for and what already exists.','An idea begins to take shape.'],
   ['Analysis','We organise **requirements**, flows and constraints into a **clear scope**.','Brief reviewed. Next steps defined.'],
   ['Proposal','The scope guides a proposal with an **estimate**, priorities and **delivery criteria**.','Proposal ready for review.'],
   ['Implementation','Your **tailor-made solution**, ready to transform the day-to-day work of your business.','Building and reviewing the project.'],
  ],
  terminal:'Illustrative process',logs:[['Receiving your idea','Goal and audience identified','Initial sketch prepared'],['Reviewing the brief','Flows and constraints organised','Scope ready for review'],['Preparing the proposal','Estimate and priorities to discuss','Delivery criteria under review'],['Building in stages','Reviewing content and navigation','Simulating an approved launch']],
  complete:'Implementation completed in this demonstration.',
  siteTitle:'Spaces with intention',siteText:'Architecture and interiors for better living.',siteType:'Fictional studio',siteAction:'Meet the studio',siteServices:['Architecture','Interiors'],
 },
 es:{
  label:'De la idea a la implementación',choose:'Etapas del proyecto',preview:'Vista ilustrativa del proceso',window:'Vista previa del proyecto',
  steps:[
   ['Tu idea','Cuéntame el **objetivo**, para quién es el proyecto y qué existe ya.','Una idea empieza a tomar forma.'],
   ['Análisis','Organizamos **requisitos**, flujos y límites para definir un **alcance claro**.','Brief analizado. Próximos pasos definidos.'],
   ['Presupuesto','El alcance guía una propuesta con **estimación**, prioridades y **criterios de entrega**.','Propuesta preparada para revisión.'],
   ['Implementación','Tu **solución a medida**, lista para transformar el día a día de tu negocio.','Implementando y revisando el proyecto.'],
  ],
  terminal:'Proceso ilustrativo',logs:[['Recibiendo tu idea','Objetivo y público identificados','Boceto inicial preparado'],['Analizando el brief','Flujos y límites organizados','Alcance listo para revisión'],['Preparando la propuesta','Estimación y prioridades a acordar','Criterios de entrega en revisión'],['Implementando por etapas','Revisando contenido y navegación','Simulando una publicación aprobada']],
  complete:'Implementación terminada en esta demostración.',
  siteTitle:'Espacios con intención',siteText:'Arquitectura e interiores para vivir mejor.',siteType:'Estudio ficticio',siteAction:'Conoce el estudio',siteServices:['Arquitectura','Interiores'],
 },
};

export function renderProjectProcess(key){
 const c=copy[key]||copy['pt-br'];
 return `<div class="project-process" data-project-process data-process-current="3" data-process-phase="4" aria-label="${e(c.label)}"><div class="project-process-pin" data-process-pin><div class="project-process-steps"><ol aria-label="${e(c.choose)}">${c.steps.map(([title,body,status],i)=>`<li><button type="button" data-process-step="${i}" data-process-status-text="${e(status)}" aria-pressed="${i===3}"${i===3?' aria-current="step"':''}><span class="project-process-number" aria-hidden="true">0${i+1}</span><span><strong>${e(title)}</strong><span class="project-process-description">${descriptionHtml(body)}</span></span></button></li>`).join('')}</ol><p class="project-process-active-description" data-process-description hidden>${descriptionHtml(c.steps[3][1])}</p></div><figure class="project-process-preview" aria-label="${e(c.preview)}"><div class="project-process-browser"><div class="project-process-toolbar" aria-hidden="true"><span class="project-process-dots"><i></i><i></i><i></i></span><span>${e(c.window)}</span></div><div class="project-process-screen"><section class="project-process-panel project-process-terminal" data-process-panel="terminal" hidden aria-label="${e(c.terminal)}"><div class="project-process-terminal-heading" aria-hidden="true"><span>${e(c.terminal)}</span><i></i></div><div class="project-process-output" aria-hidden="true">${c.logs.map((lines,i)=>`<div data-process-log="${i}" hidden><p class="project-process-command" data-process-line>$ ${e(c.steps[i][0].toLocaleLowerCase(key))}</p>${lines.map(line=>`<p data-process-line><span>✓</span>${e(line)}</p>`).join('')}</div>`).join('')}<p class="project-process-cursor">_</p></div></section><section class="project-process-panel project-process-site" data-process-panel="site" data-process-complete="${e(c.complete)}" aria-label="${e(c.steps[3][0])}">${renderProjectExamples(`<div class="project-process-site-header"><span class="project-process-site-brand">forma</span><span class="project-process-site-type">${e(c.siteType)}</span></div><div class="project-process-site-hero"><div><h3>${e(c.siteTitle)}</h3><p>${e(c.siteText)}</p><span class="project-process-site-cta">${e(c.siteAction)}<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></span></div><svg class="project-process-site-art" viewBox="0 0 180 200" fill="none" aria-hidden="true"><path d="M10 186V70a30 30 0 0 1 60 0v116Z" fill="#ff6b24"/><path d="M70 186V14h86v172Z" fill="#e4ded2"/><path d="M88 186V98a25 25 0 0 1 50 0v88Z" fill="#19191b"/><path d="M0 186h174M70 40h86M70 58h86" stroke="#19191b" stroke-width="2"/><path d="M24 186V76a16 16 0 0 1 32 0v110" stroke="#19191b" stroke-width="2"/><circle cx="151" cy="30" r="23" fill="#f7f4ed"/><path d="M151 14v32m-16-16h32" stroke="#19191b" stroke-width="1.5"/></svg></div><div class="project-process-site-services">${c.siteServices.map((service,i)=>`<span><i aria-hidden="true">0${i+1}</i>${e(service)}</span>`).join('')}</div>`,key)}<div class="project-process-success" aria-hidden="true"><span class="project-process-success-check"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 16 5 5 11-11"/></svg></span></div></section></div></div><p class="sr-only" data-process-status role="status" aria-live="polite" aria-atomic="true">${e(c.complete)}</p></figure></div></div>`;
}
