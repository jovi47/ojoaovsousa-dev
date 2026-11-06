import test from 'node:test';
import assert from 'node:assert/strict';
import * as page from '../src/city-page.mjs';
import {content} from '../src/content.mjs';

test('404 recovery offers safe localized homes and reading without initializing 3D',()=>{
 const body=page.notFound();
 const links=[...body.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
 const destinations=links.map(([,attributes])=>attributes.match(/\bhref="([^"]+)"/)[1]);
 for(const path of ['/pt-br/','/pt-br/direct/','/en/','/es/'])assert.ok(destinations.includes(path));
 assert.ok(destinations.every(path=>/^\/(pt-br|en|es)\/(?:direct\/)?$/.test(path)));
 for(const [,attributes] of links)assert.match(attributes,/class="[^"]*\b(?:button|text-link)\b/,'all recovery links reuse touch-sized controls');
 assert.match(body,/<main[^>]*aria-labelledby="not-found-title"/);
 assert.match(body,/<h1 id="not-found-title">/);
 assert.equal((body.match(/<h1\b/g)||[]).length,1);
 assert.match(body,/lang="en"/);assert.match(body,/lang="es"/);
 assert.doesNotMatch(body,/<canvas\b|<form\b|data-inquiry|data-retry/);
 const html=page.document(content['pt-br'],'pt-br',body,{indexable:false,title:'404 · João Victor'});
 assert.match(html,/<meta name="robots" content="noindex, nofollow">/);
 assert.doesNotMatch(html,/rel="canonical"|application\/ld\+json/);
});
