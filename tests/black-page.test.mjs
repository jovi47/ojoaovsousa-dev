import test from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../src/content.mjs';
import {viewerHome} from '../src/viewer-page.mjs';
import {blackHome} from '../src/black-page.mjs';

test('the single 3D presentation reuses the viewer contracts and factual content in each locale',()=>{
 for(const [key,c] of Object.entries(content)){
  const html=blackHome(c,key);
  assert.match(html,/<canvas[^>]+data-world-variant="black"/);
  assert.match(html,/<div[^>]+class="viewer-page"[^>]+data-world-variant="black"/);
  assert.equal((html.match(/class="viewer-tour"/g)||[]).length,1);
  assert.equal((html.match(/class="viewer-board"/g)||[]).length,1);
  assert.equal((html.match(/data-select-building="/g)||[]).length,4);
  assert.deepEqual([...html.matchAll(/data-viewer-card="([^"]+)"/g)].map(match=>match[1]).sort(),['about','andrea','challenge','horagora','stack']);
  assert.equal((html.match(/id="inquiry-dialog"/g)||[]).length,1);
  for(const item of c.work.cases){assert.ok(html.includes(item.name));assert.ok(html.includes(item.url));assert.ok(html.includes(item.description));}
  for(const token of ['data-question','data-inquiry','data-skip-build','data-replay-landmark','viewer-contact-fab','viewer-reading','jovi47profissional@gmail.com'])assert.ok(html.includes(token),`${key}: ${token}`);
  assert.equal((html.match(/data-technology-marquee/g)||[]).length,3);
  assert.doesNotMatch(html,/data-view-landmark|data-board|data-car|data-walk|world-2d|\.glb|<script[^>]+src=|skill-(?:gauge|ring|value)|skills-note|stroke-dasharray/);
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,`${key}: duplicated DOM id`);
 }
});

test('presentation copy preserves the shared renderer and contains no retired island navigation',()=>{
 for(const [key,c] of Object.entries(content)){
  const before=viewerHome(c,key);
  const html=blackHome(c,key);
  const labels=JSON.parse(html.match(/<script type="application\/json" id="world-data">([\s\S]*?)<\/script>/)[1]);
  assert.ok(labels.exploreLocked);
  assert.ok(labels.constructionStack);
  assert.equal(labels.intro,c.hero.description);
  assert.equal(labels.projectTitle,c.hero.description);
  assert.doesNotMatch(labels.canvas+' '+labels.intro+' '+labels.card,/ilha|island|isla|boat|barco/i);
  assert.equal(Object.hasOwn(labels,'closeCard'),false);
  assert.match(labels.help,/Role|Scroll|Desplázate/);
  assert.equal(labels.readySea,{'pt-br':'Arraste para girar · Use as setas para explorar',en:'Drag to rotate · Use the arrows to explore',es:'Arrastra para girar · Usa las flechas para explorar'}[key]);
  assert.doesNotMatch(html,/href="\/[^"]*\/black\/|version-picker|mobile-versions/);
  assert.equal(viewerHome(c,key),before);
 }
});
