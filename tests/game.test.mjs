import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, move, SIZE, PIECES, EXIT } from '../public/game-state.js';

test('moves stay inside the board and ignore unsupported directions',()=>{
  const initial=createGame();
  assert.deepEqual(move(initial,'left'),initial);
  assert.deepEqual(move(initial,'up'),initial);
  assert.deepEqual(move(initial,'unsupported'),initial);
  let state=initial;
  for(let i=0;i<20;i++) state=move(state,'right');
  assert.equal(state.x,SIZE-1);
  assert.equal(initial.x,0);
});

test('pieces collect once and exit only completes after all pieces',()=>{
  let state=createGame();
  const go=(x,y)=>{
    while(state.x<x) state=move(state,'right');
    while(state.x>x) state=move(state,'left');
    while(state.y<y) state=move(state,'down');
    while(state.y>y) state=move(state,'up');
  };
  go(EXIT.x,EXIT.y); assert.equal(state.won,false);
  for(const piece of PIECES) go(piece.x,piece.y);
  assert.equal(state.collected.length,3);
  go(PIECES[0].x,PIECES[0].y); assert.equal(state.collected.length,3);
  go(EXIT.x,EXIT.y); assert.equal(state.won,true);
  assert.deepEqual(move(state,'left'),state);
  assert.deepEqual(createGame().collected,[]);
});
