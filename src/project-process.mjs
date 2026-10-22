import {escape as e} from './city-page.mjs';

const copy={
 'pt-br':{
  label:'Da ideia à implementação',choose:'Etapas do projeto',preview:'Prévia ilustrativa do processo',caption:'Exemplo ilustrativo das etapas de um projeto.',window:'Prévia do projeto',
  note:'Escopo, estimativas e publicação são combinados para cada projeto.',
  steps:[
   ['Sua ideia','Você conta o objetivo, para quem é o projeto e o que já existe.','Uma ideia começa a ganhar forma.'],
   ['Análise','Organizamos requisitos, fluxos e limites para definir um escopo claro.','Briefing analisado. Próximos passos definidos.'],
   ['Orçamento','O escopo orienta uma proposta com estimativa, prioridades e critérios de entrega.','Proposta preparada para revisão.'],
   ['Implementação','Construímos e revisamos por etapas. A publicação vem após validação e aprovação.','Implementando e revisando o projeto.'],
  ],
  terminal:'Processo ilustrativo',logs:[['Recebendo sua ideia','Objetivo e público identificados','Esboço inicial preparado'],['Analisando o briefing','Fluxos e limites organizados','Escopo definido para revisão'],['Preparando a proposta','Estimativa e prioridades a combinar','Critérios de entrega em revisão'],['Implementando por etapas','Revisando conteúdo e navegação','Simulando a publicação aprovada']],
  complete:'Implementação concluída nesta demonstração.',
  siteTitle:'Seu site implementado',siteText:'Da ideia à experiência pronta para revisão.',
 },
 en:{
  label:'From idea to implementation',choose:'Project stages',preview:'Illustrative process preview',caption:'An illustrative example of the stages of a project.',window:'Project preview',
  note:'Scope, estimates and publication are agreed for each project.',
  steps:[
   ['Your idea','Tell me the goal, who the project is for and what already exists.','An idea begins to take shape.'],
   ['Analysis','We organise requirements, flows and constraints into a clear scope.','Brief reviewed. Next steps defined.'],
   ['Proposal','The scope guides a proposal with an estimate, priorities and delivery criteria.','Proposal ready for review.'],
   ['Implementation','We build and review in stages. Publication follows validation and approval.','Building and reviewing the project.'],
  ],
  terminal:'Illustrative process',logs:[['Receiving your idea','Goal and audience identified','Initial sketch prepared'],['Reviewing the brief','Flows and constraints organised','Scope ready for review'],['Preparing the proposal','Estimate and priorities to discuss','Delivery criteria under review'],['Building in stages','Reviewing content and navigation','Simulating an approved launch']],
  complete:'Implementation completed in this demonstration.',
  siteTitle:'Your website implemented',siteText:'From an idea to an experience ready for review.',
 },
 es:{
  label:'De la idea a la implementación',choose:'Etapas del proyecto',preview:'Vista ilustrativa del proceso',caption:'Ejemplo ilustrativo de las etapas de un proyecto.',window:'Vista previa del proyecto',
  note:'El alcance, las estimaciones y la publicación se acuerdan para cada proyecto.',
  steps:[
   ['Tu idea','Cuéntame el objetivo, para quién es el proyecto y qué existe ya.','Una idea empieza a tomar forma.'],
   ['Análisis','Organizamos requisitos, flujos y límites para definir un alcance claro.','Brief analizado. Próximos pasos definidos.'],
   ['Presupuesto','El alcance guía una propuesta con estimación, prioridades y criterios de entrega.','Propuesta preparada para revisión.'],
   ['Implementación','Construimos y revisamos por etapas. La publicación sigue a la validación y aprobación.','Implementando y revisando el proyecto.'],
  ],
  terminal:'Proceso ilustrativo',logs:[['Recibiendo tu idea','Objetivo y público identificados','Boceto inicial preparado'],['Analizando el brief','Flujos y límites organizados','Alcance listo para revisión'],['Preparando la propuesta','Estimación y prioridades a acordar','Criterios de entrega en revisión'],['Implementando por etapas','Revisando contenido y navegación','Simulando una publicación aprobada']],
  complete:'Implementación terminada en esta demostración.',
  siteTitle:'Tu sitio web implementado',siteText:'De la idea a una experiencia lista para revisar.',
 },
};

export function renderProjectProcess(key){
 const c=copy[key]||copy['pt-br'];
 return `<div class="project-process" data-project-process data-process-current="3" data-process-phase="4" aria-label="${e(c.label)}"><div class="project-process-pin" data-process-pin><div class="project-process-steps"><ol aria-label="${e(c.choose)}">${c.steps.map(([title,body,status],i)=>`<li><button type="button" data-process-step="${i}" data-process-status-text="${e(status)}" aria-pressed="${i===3}"${i===3?' aria-current="step"':''}><span class="project-process-number" aria-hidden="true">0${i+1}</span><span><strong>${e(title)}</strong><span class="project-process-description">${e(body)}</span></span></button></li>`).join('')}</ol><p class="project-process-active-description" data-process-description hidden>${e(c.steps[3][1])}</p><p class="project-process-note">${e(c.note)}</p></div><figure class="project-process-preview" aria-label="${e(c.preview)}"><div class="project-process-browser"><div class="project-process-toolbar" aria-hidden="true"><span class="project-process-dots"><i></i><i></i><i></i></span><span>${e(c.window)}</span></div><div class="project-process-screen"><section class="project-process-panel project-process-terminal" data-process-panel="terminal" hidden aria-label="${e(c.terminal)}"><div class="project-process-terminal-heading" aria-hidden="true"><span>${e(c.terminal)}</span><i></i></div><div class="project-process-output" aria-hidden="true">${c.logs.map((lines,i)=>`<div data-process-log="${i}" hidden><p class="project-process-command" data-process-line>$ ${e(c.steps[i][0].toLocaleLowerCase(key))}</p>${lines.map(line=>`<p data-process-line><span>✓</span>${e(line)}</p>`).join('')}</div>`).join('')}<p class="project-process-cursor">_</p></div></section><section class="project-process-panel project-process-site" data-process-panel="site" data-process-complete="${e(c.complete)}" aria-label="${e(c.steps[3][0])}"><div class="project-process-delivery"><span class="project-process-delivery-mark" aria-hidden="true">👍</span><h3>${e(c.siteTitle)}</h3><p>${e(c.siteText)}</p></div><div class="project-process-runner" aria-hidden="true"><svg viewBox="0 0 96 56" fill="currentColor"><path d="M4 26h8v5h12v-8h10v-9h12V6h24v7h9v13H59v9H47v7H25v-5H14v-5H4z"/><path class="project-process-dino-leg" d="M28 39h8v9h-12v-4h4z"/><path class="project-process-dino-leg project-process-dino-leg-back" d="M44 37h8v14H40v-4h4z"/><path d="M58 12h4v4h-4z" class="project-process-dino-eye"/></svg></div><div class="project-process-ground" aria-hidden="true"></div></section></div></div><p class="project-process-status" data-process-status role="status" aria-live="polite" aria-atomic="true">${e(c.complete)}</p><figcaption>${e(c.caption)}</figcaption></figure></div></div>`;
}
