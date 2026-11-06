import test from 'node:test';
import assert from 'node:assert/strict';
import {renderCareer} from '../src/career.mjs';
import {content} from '../src/content.mjs';
import {renderDirectContent} from '../src/direct-page.mjs';
import {viewerHome} from '../src/viewer-page.mjs';

test('career keeps the approved five-year summary and one native disclosure in each locale',()=>{
 for(const key of ['pt-br','en','es']){
  const html=renderCareer(key);
  assert.ok(html.includes({'pt-br':'+5 anos desenvolvendo software',en:'5+ years developing software',es:'+5 años desarrollando software'}[key]));
  assert.ok(html.includes({'pt-br':'Mais sobre minha trajetória',en:'More about my journey',es:'Más sobre mi trayectoria'}[key]));
  for(const company of ['Stone','Sicredi'])assert.ok(html.includes(`>${company}</span>`));
  assert.doesNotMatch(html,/XProcess|Andréa Sousa Consultoria/);
  assert.equal((html.match(/<details\b/g)||[]).length,1);
  assert.match(html,/<details class="career-details"><summary>/);
  assert.equal((html.match(/class="career-education-item"/g)||[]).length,2);
  for(const institution of ['UFS','IFS'])assert.ok(html.includes(`>${institution}</span>`));
  for(const url of ['https://www.ufs.br','https://www.ifs.edu.br','https://www.stone.com.br','https://www.sicredi.com.br'])assert.ok(html.includes(`href="${url}" target="_blank" rel="noopener noreferrer"`));
  const icons=[...html.matchAll(/<img\b[^>]*>/g)].map(match=>match[0]);
  assert.equal(icons.length,4);
  for(const icon of icons){assert.match(icon,/src="\/career-icons\/[^"]+"/);assert.match(icon,/alt=""/);assert.match(icon,/width="32" height="32"/);}
  assert.ok(html.includes({'pt-br':'Bacharelado · Em andamento',en:'Bachelor’s degree · In progress',es:'Grado universitario · En curso'}[key]));
  assert.ok(html.includes({'pt-br':'Ensino médio técnico · Concluído',en:'Technical secondary education · Completed',es:'Enseñanza media técnica · Finalizada'}[key]));
  assert.doesNotMatch(html,/Full.Stack|Engineer II|Senior|junior|202[0-9]|50%|3x|\$3M|Lighthouse|<script|<form|<dialog/);
  assert.equal((html.match(/id="experience"/g)||[]).length,1);
 }
});

test('reading and both personal cards reuse the career component with distinct accessible ids',()=>{
 for(const [key,c]of Object.entries(content)){
  const reading=renderDirectContent(c,key),viewer=viewerHome(c,key);
  assert.ok(reading.includes(renderCareer(key,{compact:true,id:'experience'})));
  assert.ok(reading.indexOf('id="experience"')>reading.indexOf('id="about"'));
  assert.ok(reading.indexOf('id="technologies"')<reading.indexOf('id="about"'));
  assert.equal((reading.match(/id="experience"/g)||[]).length,1);
  for(const card of ['stack','about'])assert.ok(viewer.includes(renderCareer(key,{compact:true,id:`viewer-career-${card}`})));
  const ids=[...viewer.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: duplicate id`);
 }
});
