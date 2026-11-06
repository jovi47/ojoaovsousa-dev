import test from 'node:test';
import assert from 'node:assert/strict';
import {createMobileTour} from '../public/city-autoplay.js';

test('starts with your project and cycles with ten seconds for every model, building only the first visit',()=>{
 const visits=[],tour=createMobileTour((id,build)=>visits.push([id,build]));
 tour.tick(5,false);assert.deepEqual(visits,[]);
 tour.tick(0,true);assert.deepEqual(visits,[['challenge',true]]);
 tour.tick(9.99,true);assert.equal(visits.length,1);
 tour.tick(10,true);for(let i=0;i<3;i++)tour.tick(10,true);
 assert.deepEqual(visits,[['challenge',true],['stack',true],['horagora',true],['andrea',true],['challenge',false]]);
 assert.equal(tour.running,true);
});

test('inactive and manually paused tours do not advance; manual selection builds unseen landmarks only',()=>{
 const visits=[],tour=createMobileTour((id,build)=>visits.push([id,build]));
 tour.tick(0,true);tour.tick(5,false);assert.equal(visits.length,1);
 tour.pause();tour.tick(10,true);assert.equal(visits.length,1);
 tour.resume();tour.tick(10,true);assert.deepEqual(visits.at(-1),['stack',true]);
 tour.choose('challenge');assert.equal(tour.running,false);assert.deepEqual(visits.at(-1),['challenge',false]);
 tour.choose('andrea');assert.deepEqual(visits.at(-1),['andrea',true]);
 tour.choose('andrea');assert.deepEqual(visits.at(-1),['andrea',false]);const held=visits.length;tour.tick(100,true);assert.equal(visits.length,held,'a chosen model never auto-advances');
 tour.choose('unknown');assert.deepEqual(visits.at(-1),['andrea',false]);
});
