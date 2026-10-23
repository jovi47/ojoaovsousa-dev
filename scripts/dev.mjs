import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {watch} from 'node:fs';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const port=Number(process.env.PORT||3000),clients=new Set();
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.woff2':'font/woff2','.webp':'image/webp','.webm':'video/webm','.mov':'video/quicktime','.glb':'model/gltf-binary'};
const server=http.createServer(async(req,res)=>{
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end();return;}
 const legacy=pathname.match(/^\/(pt-br|en|es)\/black\/?$/);if(legacy){res.writeHead(308,{Location:`/${legacy[1]}/${new URL(req.url,'http://localhost').search}`});res.end();return;}
 if(pathname==='/__reload'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
 let filename=path.resolve(dist,`.${pathname}`);
 if(filename!==dist&&!filename.startsWith(dist+path.sep)){res.writeHead(403);res.end();return;}
 let code=200;
 try{if((await stat(filename)).isDirectory())filename=path.join(filename,'index.html');await stat(filename);}catch{filename=path.join(dist,'404.html');code=404;}
 try{
  let bytes=await readFile(filename);const extension=path.extname(filename);
  if(extension==='.html')bytes=Buffer.from(bytes.toString().replace('</body>','<script type="module" src="/__hmr.js"></script></body>'));
  res.writeHead(code,{'Content-Type':mime[extension]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(bytes);
 }catch{res.writeHead(503,{'Content-Type':'text/plain'});res.end('Preview rebuilding. Reload shortly.');}
});
const original=server.listeners('request')[0];server.removeAllListeners('request');
server.on('request',(req,res)=>{
 if(req.url==='/__hmr.js'){res.writeHead(200,{'Content-Type':'text/javascript'});res.end("const events=new EventSource('/__reload');events.onmessage=()=>location.reload();");return;}
 original(req,res);
});
let child=null,queued=false,timer=null;
function rebuild(){
 if(child){queued=true;return;}
 child=spawn(process.execPath,['scripts/build.mjs'],{cwd:root,stdio:['ignore','inherit','inherit']});
 child.once('exit',code=>{child=null;if(code===0)for(const client of clients)client.write('data: reload\n\n');if(queued){queued=false;rebuild();}});
}
const watchers=['src','public'].map(folder=>watch(path.join(root,folder),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(rebuild,90);}));
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio preview http://localhost:${port} (watch enabled)`));
function stop(){for(const watcher of watchers)watcher.close();clearTimeout(timer);child?.kill('SIGTERM');for(const client of clients)client.end();server.close(()=>process.exit(0));}
process.once('SIGTERM',stop);process.once('SIGINT',stop);
