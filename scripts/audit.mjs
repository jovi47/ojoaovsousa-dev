import {execFileSync} from 'node:child_process';
import {readFile,lstat,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const names=execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const allowed=/^(?:\.gitignore|\.dockerignore|package\.json|vercel\.json|README\.md|\.openai\/hosting\.json|(?:src|scripts|tests|docs)\/[a-zA-Z0-9./_-]+|public\/[a-zA-Z0-9._-]+)$/;
const prohibited=/(?:^|\/)(?:\.private|ACESSOS\.local\.md|\.env(?:\.[^/]*)?|\.vercel|node_modules)(?:\/|$)/i;
const secret=/(?:-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|(?:sk-proj-|ghp_|github_pat_)[a-zA-Z0-9_]{20,}|[?&](?:access_token|refresh_token|api_key)=[a-zA-Z0-9_-]{16,})/;
for(const name of names){
 if(prohibited.test(name)||!allowed.test(name))throw new Error(`Unapproved source path: ${name}`);
 const info=await lstat(path.join(root,name));if(!info.isFile()||info.isSymbolicLink())throw new Error(`Source must be a regular file: ${name}`);
 if(/\.(?:js|mjs|json|md|css|svg)$/.test(name)&&secret.test(await readFile(path.join(root,name),'utf8')))throw new Error(`Possible protected value in ${name}`);
}
const assets=new Set(['index.html','404.html','robots.txt','sitemap.xml','app.js','game.js','game-state.js','guide.js','style.css','character.css','portrait.jpg','horagora.jpg','andrea.jpg','hori.webp','favicon.svg','og.svg','og.jpg']);
async function auditOutput(directory,prefix=''){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const name=prefix+entry.name,full=path.join(directory,entry.name);
  if(entry.isDirectory()&&/^(pt-br|en|es)(\/(privacy|terms))?$/.test(name))await auditOutput(full,name+'/');
  else if(!entry.isFile()||(!assets.has(name)&&!/^(pt-br|en|es)\/(?:(privacy|terms)\/)?index\.html$/.test(name)))throw new Error(`Unapproved deploy path: ${name}`);
 }
}
await auditOutput(path.join(root,'dist'));
console.log(`Upload audit passed: ${names.length} regular source files; output paths allowlisted; no protected paths or detected key material.`);
