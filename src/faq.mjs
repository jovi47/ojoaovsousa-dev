import {escape as e} from './city-page.mjs';

const copy={
 'pt-br':{
  title:'Dúvidas frequentes',
  intro:'Algumas respostas para ajudar a planejar seu próximo projeto.',
  cta:'Ainda tem uma dúvida? Fale comigo',
  items:[
   ['Ainda não sei exatamente do que preciso. Podemos conversar?','Sim. Começamos pelo seu objetivo, pela rotina de quem vai usar e pelos limites do projeto. A partir dessa conversa, definimos juntos um escopo claro.'],
   ['Quanto custa um projeto?','O investimento depende do escopo, da complexidade e das integrações necessárias. Após a análise, preparo uma proposta com o que será entregue e os custos combinados.'],
   ['Qual é o prazo de entrega?','O prazo depende do escopo e da disponibilidade. Se a demanda pedir uma equipe maior, essa possibilidade é alinhada na proposta. As etapas e os prazos são combinados antes do início.'],
   ['Quais tecnologias você utiliza?','A tecnologia acompanha a necessidade do projeto. Avalio objetivo, integrações, orçamento e evolução para escolher a solução mais adequada, aproveitando a estrutura existente quando faz sentido.'],
   ['Você oferece manutenção e suporte?','Sim. Manutenção é um serviço combinado na proposta, com escopo, frequência, atualizações e suporte definidos para a necessidade do projeto.'],
   ['Como acompanho o andamento?','Você acompanha versões de trabalho e revisões por etapas. Assim, pode avaliar o que foi construído, esclarecer dúvidas e alinhar os próximos passos.'],
   ['Você trabalha com sites e sistemas que já existem?','Sim. Primeiro avalio o que já existe e o objetivo da mudança. O trabalho pode envolver melhorias, integrações ou automações, aproveitando o que ainda atende ao projeto.'],
   ['Você ajuda com domínio e hospedagem?','Posso orientar a configuração do domínio e da hospedagem, com titularidade e acessos sob seu controle. A estrutura necessária e os custos são combinados na proposta.'],
  ],
 },
 en:{
  title:'Frequently asked questions',
  intro:'A few answers to help you plan your next project.',
  cta:'Still have a question? Talk to me',
  items:[
   ['I am not sure what I need yet. Can we talk?','Yes. We start with your goal, the everyday work of the people using the project and its constraints. That conversation helps us define a clear scope together.'],
   ['How much does a project cost?','The cost depends on the scope, complexity and integrations needed. After the analysis, I prepare a proposal describing the deliverables and the agreed costs.'],
   ['How long will the project take?','Timing depends on scope and availability. If the work calls for a larger team, we discuss that possibility in the proposal. Stages and timelines are agreed before work begins.'],
   ['Which technologies do you use?','Technology follows the needs of the project. I assess the goal, integrations, budget and future development to choose the most suitable solution, making use of the existing setup when it makes sense.'],
   ['Do you offer maintenance and support?','Yes. Maintenance is a service agreed in the proposal, with its scope, frequency, updates and support defined around the project needs.'],
   ['How can I follow the work?','You review working versions and progress in stages. This gives you opportunities to assess the work, ask questions and agree on the next steps.'],
   ['Can you work on an existing website or system?','Yes. I first assess what already exists and the goal of the change. The work can include improvements, integrations or automation, keeping what still serves the project.'],
   ['Can you help with a domain and hosting?','I can guide domain and hosting configuration while ownership and access stay under your control. The required setup and its costs are agreed in the proposal.'],
  ],
 },
 es:{
  title:'Preguntas frecuentes',
  intro:'Algunas respuestas para ayudarte a planificar tu próximo proyecto.',
  cta:'¿Todavía tienes una duda? Hablemos',
  items:[
   ['Todavía no sé exactamente qué necesito. ¿Podemos hablar?','Sí. Empezamos por tu objetivo, la rutina de quienes usarán el proyecto y sus límites. A partir de esa conversación, definimos juntos un alcance claro.'],
   ['¿Cuánto cuesta un proyecto?','El coste depende del alcance, la complejidad y las integraciones necesarias. Después del análisis, preparo una propuesta con las entregas y los costes acordados.'],
   ['¿Cuál es el plazo de entrega?','El plazo depende del alcance y la disponibilidad. Si el trabajo requiere un equipo mayor, acordamos esa posibilidad en la propuesta. Las etapas y los plazos se definen antes de empezar.'],
   ['¿Qué tecnologías utilizas?','La tecnología acompaña las necesidades del proyecto. Evalúo el objetivo, las integraciones, el presupuesto y la evolución para elegir la solución más adecuada, aprovechando la estructura existente cuando tiene sentido.'],
   ['¿Ofreces mantenimiento y soporte?','Sí. El mantenimiento es un servicio acordado en la propuesta, con alcance, frecuencia, actualizaciones y soporte definidos según las necesidades del proyecto.'],
   ['¿Cómo sigo el avance del trabajo?','Puedes revisar versiones de trabajo y avances por etapas. Así puedes evaluar lo construido, plantear dudas y acordar los próximos pasos.'],
   ['¿Trabajas con sitios y sistemas que ya existen?','Sí. Primero evalúo lo que ya existe y el objetivo del cambio. El trabajo puede incluir mejoras, integraciones o automatizaciones, aprovechando lo que todavía sirve al proyecto.'],
   ['¿Ayudas con el dominio y el alojamiento?','Puedo orientar la configuración del dominio y el alojamiento, manteniendo la titularidad y los accesos bajo tu control. La estructura necesaria y los costes se acuerdan en la propuesta.'],
  ],
 },
};

export function renderFaq(key){
 const c=Object.hasOwn(copy,key)?copy[key]:copy['pt-br'];
 return `<section id="faq" class="faq" aria-labelledby="faq-title"><div class="faq-intro"><h2 id="faq-title">${e(c.title)}</h2><p>${e(c.intro)}</p><button type="button" class="button" data-inquiry>${e(c.cta)}</button></div><div class="faq-list">${c.items.map(([question,answer])=>`<details class="faq-item"><summary><span>${e(question)}</span><span class="faq-symbol" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${e(answer)}</p></div></details>`).join('')}</div></section>`;
}
