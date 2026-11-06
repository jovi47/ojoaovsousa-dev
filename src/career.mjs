import {escape as e} from './city-page.mjs';

const companies=[{name:'Stone',id:'stone',site:'https://www.stone.com.br'},{name:'Sicredi',id:'sicredi',site:'https://www.sicredi.com.br'}];
const schools={UFS:{id:'ufs',site:'https://www.ufs.br'},IFS:{id:'ifs',site:'https://www.ifs.edu.br'}};
const organizationIcon=id=>`<span class="career-mark career-mark--${e(id)}" aria-hidden="true"><img src="/career-icons/${e(id)}.${id==='stone'||id==='ifs'?'png':'svg'}" alt="" width="32" height="32" loading="lazy" decoding="async"></span>`;
const copy={
 'pt-br':{
  title:'+5 anos desenvolvendo software',
  intro:'Experiência para entender o contexto, conectar sistemas e construir soluções úteis.',
  more:'Mais sobre minha trajetória',companies:'Já atuei em',education:'Formação',
  paragraphs:[
   'Minha trajetória reúne sistemas de gestão, serviços de back-end, integrações e automação de rotinas. Participo da implementação, dos testes e da entrega das soluções, com atenção ao contexto de quem vai usar.',
   'Também trabalho com dados, consultas e visibilidade operacional para apoiar o uso e a evolução dos sistemas.',
  ],
  courses:[['UFS','Sistemas de Informação','Bacharelado · Em andamento'],['IFS','Desenvolvimento de Sistemas','Ensino médio técnico · Concluído']],
 },
 en:{
  title:'5+ years developing software',
  intro:'Experience understanding the context, connecting systems and building useful solutions.',
  more:'More about my journey',companies:'Where I’ve contributed',education:'Education',
  paragraphs:[
   'My experience spans management systems, back-end services, integrations and workflow automation. I take part in implementation, testing and delivery, with attention to the people who will use the solution.',
   'I also work with data, queries and operational visibility to support the use and evolution of systems.',
  ],
  courses:[['UFS','Information Systems','Bachelor’s degree · In progress'],['IFS','Systems Development','Technical secondary education · Completed']],
 },
 es:{
  title:'+5 años desarrollando software',
  intro:'Experiencia para entender el contexto, conectar sistemas y construir soluciones útiles.',
  more:'Más sobre mi trayectoria',companies:'He trabajado en',education:'Formación',
  paragraphs:[
   'Mi trayectoria reúne sistemas de gestión, servicios de back-end, integraciones y automatización de procesos. Participo en la implementación, las pruebas y la entrega, teniendo en cuenta a quienes usarán la solución.',
   'También trabajo con datos, consultas y visibilidad operativa para apoyar el uso y la evolución de los sistemas.',
  ],
  courses:[['UFS','Sistemas de Información','Grado universitario · En curso'],['IFS','Desarrollo de Sistemas','Enseñanza media técnica · Finalizada']],
 },
};

export function renderCareer(key,{compact=false,id='experience'}={}){
 const c=Object.hasOwn(copy,key)?copy[key]:copy['pt-br'],heading=compact?'h3':'h2',subheading=compact?'h4':'h3',titleId=`${id}-title`,educationId=`${id}-education`;
 return `<section id="${e(id)}" class="career${compact?' career--compact':' direct-section'}" aria-labelledby="${e(titleId)}"><div class="career-intro"><${heading} id="${e(titleId)}" class="career-title">${e(c.title)}</${heading}>${compact?'':`<p>${e(c.intro)}</p>`}</div><details class="career-details"><summary><span>${e(c.more)}</span><span class="career-symbol" aria-hidden="true">+</span></summary><div class="career-content"><${subheading} class="career-label">${e(c.companies)}</${subheading}><ul class="career-companies">${companies.map(company=>`<li><a class="career-company-link" href="${e(company.site)}" target="_blank" rel="noopener noreferrer">${organizationIcon(company.id)}<span>${e(company.name)}</span></a></li>`).join('')}</ul>${c.paragraphs.map(paragraph=>`<p>${e(paragraph)}</p>`).join('')}<section class="career-education" aria-labelledby="${e(educationId)}"><${subheading} id="${e(educationId)}" class="career-label">${e(c.education)}</${subheading}><dl>${c.courses.map(([institution,course,status])=>`<div class="career-education-item"><dt><a class="career-school-link" href="${e(schools[institution].site)}" target="_blank" rel="noopener noreferrer">${organizationIcon(schools[institution].id)}<span><span class="career-school-name">${e(institution)}</span><span class="career-course-name">${e(course)}</span></span></a></dt><dd class="career-course-status">${e(status)}</dd></div>`).join('')}</dl></section></div></details></section>`;
}
