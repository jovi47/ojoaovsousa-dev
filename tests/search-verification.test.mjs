import test from 'node:test';
import assert from 'node:assert/strict';
import {content} from '../src/content.mjs';
import {document} from '../src/city-page.mjs';

const tag='<meta name="google-site-verification" content="vuTvF5DFY5X67kjwSVe1jgjwuCeywI5I8nzWlJZ9hk8">';
test('Search Console verification is present once in the real production home head only',()=>{
 for(const key of ['pt-br','en','es']){
  const html=document(content[key],key,'<main>Public portfolio</main>',{base:'https://ojoaovsousa.pages.dev',indexable:true});
  const head=html.split('</head>')[0];
  assert.equal(head.split(tag).length-1,1);
  assert.doesNotMatch(html.split('</head>')[1],/google-site-verification/);
 }
 for(const options of [{},{base:'https://preview.example',indexable:true},{base:'https://ojoaovsousa.pages.dev',path:'direct/',canonicalPath:''},{base:'https://ojoaovsousa.pages.dev',path:'privacy/'},{base:'https://ojoaovsousa.pages.dev',path:'terms/'}]){
  assert.doesNotMatch(document(content['pt-br'],'pt-br','<main>Public portfolio</main>',options),/google-site-verification/);
 }
});
