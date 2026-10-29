const labels={
 'pt-br':['Sistema fictício','Tudo sob controle','Vendas, tarefas e resultados em um só lugar.','Visão geral','Receita','Pedidos','Hoje','Site médico fictício','Cuidado que aproxima','Atendimento humano, do primeiro contato à consulta.','Conheça a clínica','Especialidades','Nossa equipe'],
 en:['Fictional system','Everything in view','Sales, tasks and results in one place.','Overview','Revenue','Orders','Today','Fictional medical site','Care that connects','Personal care, from first contact to your appointment.','Meet the clinic','Specialties','Our team'],
 es:['Sistema ficticio','Todo bajo control','Ventas, tareas y resultados en un solo lugar.','Vista general','Ingresos','Pedidos','Hoy','Sitio médico ficticio','Cuidado que conecta','Atención cercana, del primer contacto a la consulta.','Conoce la clínica','Especialidades','Nuestro equipo']
};

const additionalCopy={
 'pt-br':[
  ['Loja fictícia','Objetos com afeto','Peças simples para uma casa mais sua.','Ver coleção','Casa','Presentes'],
  ['Restaurante fictício','Sabor à mesa','Cozinha da estação, feita para compartilhar.','Conheça o menu','Almoço','Jantar'],
 ],
 en:[
  ['Fictional shop','Everyday objects','Simple pieces that feel like home.','View collection','Home','Gifts'],
  ['Fictional restaurant','Seasonal flavours','Seasonal cooking, made to share.','Explore the menu','Lunch','Dinner'],
 ],
 es:[
  ['Tienda ficticia','Objetos con alma','Piezas sencillas para una casa más tuya.','Ver colección','Hogar','Regalos'],
  ['Restaurante ficticio','Sabor en la mesa','Cocina de temporada para compartir.','Conoce el menú','Almuerzo','Cena'],
 ],
};
const additionalArt=[
 '<rect x="8" y="12" width="164" height="176" rx="14" fill="#e5dff0"/><ellipse cx="93" cy="172" rx="64" ry="10" fill="#c1b3d1"/><path d="M30 85h48v68a20 20 0 0 1-48 0Z" fill="#ae6e50"/><path d="M78 100h9a18 18 0 0 1 0 36h-9" fill="none" stroke="#ae6e50" stroke-width="9"/><path d="M116 45h23v24c0 12 17 22 17 47v41a13 13 0 0 1-13 13h-32a13 13 0 0 1-13-13v-41c0-25 18-35 18-47Z" fill="#f9f3e9"/><path d="M117 47h21M104 126h46" stroke="#d6c7ad" stroke-width="3"/>',
 '<rect x="8" y="12" width="164" height="176" rx="80" fill="#f0dcc5"/><circle cx="90" cy="106" r="65" fill="#faf6ec"/><circle cx="90" cy="106" r="50" fill="none" stroke="#d8c7af" stroke-width="2"/><path d="M62 72c27-8 52 9 50 28s-29 36-46 21-25-41-4-49Z" fill="#d67939"/><path d="M90 78c4-20 25-20 32-10-3 15-20 20-32 10Zm-33 50c-13 0-22 13-15 24 15 5 30-8 15-24Zm45 6c4-18 23-20 29-6-4 15-22 18-29 6Z" fill="#537a45"/><circle cx="74" cy="97" r="7" fill="#f3c975"/><circle cx="92" cy="111" r="6" fill="#f3c975"/>',
];
function renderAdditionalExamples(key){
 const copy=additionalCopy[key]||additionalCopy['pt-br'];
 return copy.map(([type,title,text,action,first,second],i)=>`<div class="project-process-example project-process-${i?'restaurant':'shop'}" data-process-example="${i+3}" hidden><div class="project-process-site-header"><span class="project-process-site-brand">${i?'brasa':'lume'}</span><span class="project-process-site-type">${type}</span></div><div class="project-process-site-hero"><div><h3>${title}</h3><p>${text}</p><span class="project-process-site-cta">${action} →</span></div><svg class="project-process-site-art" viewBox="0 0 180 200" aria-hidden="true" focusable="false">${additionalArt[i]}</svg></div><div class="project-process-site-services"><span>01 ${first}</span><span>02 ${second}</span></div></div>`).join('');
}

export function renderProjectExamples(first,key){
 const c=labels[key]||labels['pt-br'];
 return `<div class="project-process-example" data-process-example="0">${first}</div>
 <div class="project-process-example project-process-management" data-process-example="1" hidden><div class="project-process-site-header"><span class="project-process-site-brand">nexo</span><span class="project-process-site-type">${c[0]}</span></div><div class="project-process-management-main"><span class="project-process-eyebrow">${c[3]}</span><h3>${c[1]}</h3><p>${c[2]}</p><div class="project-process-metrics"><div><small>${c[4]}</small><strong>24.580</strong><span>+18%</span></div><div><small>${c[5]}</small><strong>128</strong><span>+12%</span></div></div><div class="project-process-chart" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div><div class="project-process-site-services"><span>01 ${c[5]}</span><span>02 ${c[6]}</span></div></div>
 <div class="project-process-example project-process-medical" data-process-example="2" hidden><div class="project-process-site-header"><span class="project-process-site-brand">viva<span>+</span></span><span class="project-process-site-type">${c[7]}</span></div><div class="project-process-site-hero"><div><h3>${c[8]}</h3><p>${c[9]}</p><span class="project-process-site-cta">${c[10]} →</span></div><svg class="project-process-site-art" viewBox="0 0 180 200" aria-hidden="true"><rect x="10" y="10" width="160" height="180" rx="80" fill="#d5e7e0"/><circle cx="90" cy="72" r="30" fill="#6d9b89"/><path d="M38 174v-30a52 52 0 0 1 104 0v30" fill="#fff"/><path d="M90 120v35m-17-18h34" stroke="#27654d" stroke-width="9" stroke-linecap="round"/></svg></div><div class="project-process-site-services"><span>01 ${c[11]}</span><span>02 ${c[12]}</span></div></div>${renderAdditionalExamples(key)}`;
}
