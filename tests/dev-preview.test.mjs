import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { get } from 'node:http';

test('loopback preview rejects a foreign Host and bounds long-lived reload streams', {timeout: 8000}, async t=>{
 const reservation=createServer().listen(0,'127.0.0.1');
 await once(reservation,'listening');
 const {port}=reservation.address();
 await new Promise((resolve,reject)=>reservation.close(error=>error?reject(error):resolve()));
 const preview=spawn(process.execPath,['scripts/dev.mjs'],{
  cwd:new URL('../',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','inherit'],
 });
 const clients=[];
 t.after(async()=>{
  for(const client of clients)client.destroy();
  if(preview.exitCode===null&&preview.signalCode===null){
   const exited=once(preview,'exit');
   preview.kill('SIGTERM');
   await exited;
  }
 });
 await once(preview.stdout,'data');
 function open(host){
  return new Promise((resolve,reject)=>{
   const client=get({hostname:'127.0.0.1',port,path:'/__reload',headers:{Host:host}},resolve);
   clients.push(client);
   client.on('error',reject);
  });
 }
 const foreign=await open(`foreign.example:${port}`);
 foreign.resume();
 const host=`localhost:${port}`;
 for(let i=0;i<16;i++)assert.equal((await open(host)).statusCode,200);
 const overflow=await open(host);
 overflow.resume();
 assert.deepEqual([foreign.statusCode,overflow.statusCode],[403,503]);
});
