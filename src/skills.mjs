import {escape as e} from './city-page.mjs';

const technologies=[
 ['elixir','Elixir'],['java','Java'],['javascript','JavaScript'],['react','React'],
 ['phoenix','Phoenix'],['postgresql','PostgreSQL'],['fly','Fly.io'],['aws','AWS'],
 ['docker','Docker'],['github','GitHub'],['git','Git'],['html','HTML'],['css','CSS'],
 ['python','Python'],['spring-boot','Spring Boot'],['domains'],['infrastructure'],
 ['ci-cd','CI/CD'],['ai'],['harnesses','Harnesses'],['agents'],['3d'],['rag','RAG'],
 ['xml','XML'],['mysql','MySQL'],['pl-sql','PL/SQL'],
 ['liveview','LiveView'],['oban','Oban'],['ecto','Ecto'],['nextjs','Next.js'],
 ['typescript','TypeScript'],['rest'],['graphql','GraphQL'],['kafka','Kafka'],
 ['rabbitmq','RabbitMQ'],['mongodb','MongoDB'],['kubernetes','Kubernetes'],
 ['exunit','ExUnit'],['junit','JUnit'],['mockito','Mockito'],['wiremock','WireMock'],
 ['tdd','TDD'],['unit-tests'],['integration-tests'],['ddd','DDD'],['solid','SOLID'],
 ['microservices'],['scrum','Scrum'],['kanban','Kanban'],['tomcat','Tomcat'],
 ['metabase','Metabase'],['bootstrap','Bootstrap'],['ajax','AJAX'],['sql','SQL'],
];
const symbols={liveview:'phoenix',rest:'domains',exunit:'elixir',mockito:'harnesses',wiremock:'harnesses',tdd:'ci-cd','unit-tests':'harnesses','integration-tests':'ci-cd',ddd:'3d',solid:'3d',microservices:'infrastructure',scrum:'agents',kanban:'harnesses',ajax:'xml',sql:'pl-sql'};
const copy={
 'pt-br':{title:'Tecnologias aplicadas em projetos',list:'Tecnologias',hint:'Tecnologias. Foque esta faixa com o teclado para pausar o movimento.',credits:'Créditos dos ícones',domains:'Domínios',infrastructure:'Infraestrutura',ai:'IA',agents:'Agentes','3d':'Modelagem 3D',rest:'APIs REST','unit-tests':'Testes unitários','integration-tests':'Testes de integração',microservices:'Microsserviços'},
 en:{title:'Technologies applied in projects',list:'Technologies',hint:'Technologies. Focus this strip with the keyboard to pause motion.',credits:'Icon credits',domains:'Domains',infrastructure:'Infrastructure',ai:'AI',agents:'Agents','3d':'3D modelling',rest:'REST APIs','unit-tests':'Unit tests','integration-tests':'Integration tests',microservices:'Microservices'},
 es:{title:'Tecnologías aplicadas en proyectos',list:'Tecnologías',hint:'Tecnologías. Enfoca esta franja con el teclado para pausar el movimiento.',credits:'Créditos de los iconos',domains:'Dominios',infrastructure:'Infraestructura',ai:'IA',agents:'Agentes','3d':'Modelado 3D',rest:'API REST','unit-tests':'Pruebas unitarias','integration-tests':'Pruebas de integración',microservices:'Microservicios'},
};
const reused=new Set(['elixir','java','javascript','react']);
function icon(id){
 id=symbols[id]||id;
 const image=(path,classes)=>`<img class="${classes}" src="${path}" alt="" width="36" height="36" loading="lazy" decoding="async">`;
 if(id==='ai')return `<span class="technology-icon technology-openai" aria-hidden="true">${image('/technology-icons/openai-black.svg','technology-icon-light')}${image('/technology-icons/openai-white.svg','technology-icon-dark')}</span>`;
 return image(`/${reused.has(id)?'icons':'technology-icons'}/${id}.svg`,`technology-icon${id==='github'||id==='kafka'?` technology-${id}`:''}`);
}
export function renderSkills(_skills,key){
 const c=Object.hasOwn(copy,key)?copy[key]:copy['pt-br'];
 const row=items=>{
  const content=items.map(([id,name])=>`<li class="technology-item">${icon(id)}<span class="technology-name">${e(name||c[id])}</span></li>`).join('');
  return `<div class="technology-row"><div class="technology-belt"><ul class="technology-set" data-tech-primary aria-label="${e(c.list)}">${content}</ul><ul class="technology-set" data-tech-copy aria-hidden="true" inert>${content}</ul></div></div>`;
 };
 const half=Math.ceil(technologies.length/2);
 return `<section class="skills-section technology-marquee" data-technology-marquee tabindex="0" aria-label="${e(c.hint)}"><div class="technology-marquee-header"><h3 id="skills-title">${e(c.title)}</h3></div>${row(technologies.slice(0,half))}${row(technologies.slice(half))}<a class="technology-credits" href="/technology-icons/LICENSE.txt">${e(c.credits)}</a></section>`;
}
