import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('three locales provide real HTML, language navigation, exact contact and preview robots',async()=>{
  for(const [path,lang] of [['pt-br','pt-BR'],['en','en-GB'],['es','es']]){
    const html=await readFile(new URL(`../dist/${path}/index.html`,import.meta.url),'utf8');
    assert.ok(html.includes(`lang="${lang}"`));
    assert.match(html,/mailto:jovi47profissional@gmail\.com/);
    assert.match(html,/https:\/\/wa\.me\/5579998230872/);
    assert.match(html,/name="robots" content="noindex, nofollow"/);
    assert.match(html,/id="main"/);
    assert.match(html,/prefers-color-scheme|data-theme="(?:dark|light)"/);
    for(const locale of ['pt-br','en','es']) assert.ok(html.includes(`href="/${locale}/"`));
    assert.ok(html.includes('https://www.linkedin.com/in/jovi47/'));
    assert.ok(html.includes('https://github.com/jovi47'));
    assert.ok(html.includes('andreasousaconsultoria.com.br'));
    assert.ok(html.includes('https://horagora.com.br'));
    for(const policy of ['privacy','terms']){
      const text=await readFile(new URL(`../dist/${path}/${policy}/index.html`,import.meta.url),'utf8');
      assert.ok(text.includes(`lang="${lang}"`));
      assert.ok(text.includes('jovi47profissional@gmail.com'));
    }
  }
});
