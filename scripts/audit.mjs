import {execFileSync} from 'node:child_process';
import {readFile,lstat,readdir} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const names=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{encoding:'utf8'}).split('\0').filter(Boolean))];
const vendors=new Set(['BufferGeometryUtils.js','GLTFLoader.js','SkeletonUtils.js','three-LICENSE.txt','three.core.js','three.module.js','libphonenumber-max.js','libphonenumber-max.js.map','libphonenumber-LICENSE.txt']);
const icons=new Set(['LICENSE.txt','elixir.svg','java.svg','javascript.svg','react.svg']);
const careerIcons=new Set(['stone.png','sicredi.svg','ufs.svg','ifs.png']);
const contactIcons=new Set(['whatsapp.svg','linkedin.svg','LICENSE.txt']);
const publicAsset=name=>['_headers','_redirects'].includes(name)||/^[a-zA-Z0-9_-]+\.(?:js|css|jpg|png|webp|glb|woff2|svg|txt)$/.test(name)||name.startsWith('vendor/')&&vendors.has(name.slice(7))||name.startsWith('icons/')&&icons.has(name.slice(6))||name.startsWith('career-icons/')&&careerIcons.has(name.slice(13))||name.startsWith('contact-icons/')&&contactIcons.has(name.slice(14))||/^technology-icons\/[a-z0-9-]+\.svg$/.test(name)||name==='technology-icons/LICENSE.txt';
const allowed=name=>/^(?:\.gitignore|\.dockerignore|package(?:-lock)?\.json|vercel\.json|README\.md|\.openai\/hosting\.json|(?:src|scripts|tests|docs)\/[a-zA-Z0-9./_-]+)$/.test(name)||name.startsWith('public/')&&publicAsset(name.slice(7));
const prohibited=/(?:^|\/)(?:\.private|ACESSOS\.local\.md|\.env(?:\.[^/]*)?|\.vercel|node_modules)(?:\/|$)/i;
const secret=/(?:-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|(?:sk-proj-|ghp_|github_pat_)[a-zA-Z0-9_]{20,}|[?&](?:access_token|refresh_token|api_key)=[a-zA-Z0-9_-]{16,})/;
const publicNames=new Set();let sources=0;
for(const name of names){
 if(prohibited.test(name)||!allowed(name))throw new Error(`Unapproved source path: ${name}`);
 let info;try{info=await lstat(path.join(root,name));}catch(error){if(error.code==='ENOENT')continue;throw error;}
 if(!info.isFile()||info.isSymbolicLink())throw new Error(`Source must be a regular file: ${name}`);
 if((/\.(?:js|mjs|json|md|css|svg|txt)$/.test(name)||/\/(?:_headers|_redirects)$/.test(name))&&secret.test(await readFile(path.join(root,name),'utf8')))throw new Error(`Possible protected value in ${name}`);
 if(name.startsWith('public/'))publicNames.add(name.slice(7));sources++;
}
const generated=new Set(['index.html','404.html','robots.txt','sitemap.xml','llms.txt']);let outputs=0;
async function auditOutput(directory,prefix=''){
 for(const entry of await readdir(directory,{withFileTypes:true})){
  const name=prefix+entry.name,full=path.join(directory,entry.name);
  if(prohibited.test(name))throw new Error(`Protected output path: ${name}`);
  if(entry.isDirectory()&&(/^(pt-br|en|es)(\/(privacy|terms|direct|black))?$/.test(name)||['icons','technology-icons','career-icons','contact-icons','vendor'].includes(name)))await auditOutput(full,name+'/');
  else if(!entry.isFile()||(!publicNames.has(name)&&!generated.has(name)&&!/^(pt-br|en|es)\/(?:(privacy|terms|direct|black)\/)?index\.html$/.test(name)&&!/^(pt-br|en|es)\/index\.md$/.test(name)))throw new Error(`Unapproved artifact path: ${name}`);
  else{
   const bytes=await readFile(full);
   if(publicNames.has(name)&&!bytes.equals(await readFile(path.join(root,'public',name))))throw new Error(`Stale copied asset: ${name}`);
   if((/\.(?:html|js|json|md|css|svg|txt|xml)$/.test(name)||['_headers','_redirects'].includes(name))&&secret.test(bytes.toString('utf8')))throw new Error(`Possible protected output value: ${name}`);
   outputs++;
  }
 }
}
await auditOutput(path.join(root,'dist'));
console.log(`Local artifact audit passed: ${sources} regular source files, ${outputs} output files; no protected paths or detected key material. No upload performed.`);
