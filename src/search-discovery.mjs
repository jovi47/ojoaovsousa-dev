import {isIP} from 'node:net';

export function searchConfig(siteUrl='',indexable=''){
 if(!siteUrl)return {base:'',indexable:false};
 let url;
 try{url=new URL(siteUrl);}catch{throw new Error('SITE_URL must be an HTTPS origin');}
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw new Error('SITE_URL must be an HTTPS origin');
 const host=url.hostname.replace(/^\[|\]$/g,'').replace(/\.$/,'');
 const local=isIP(host)||!host.includes('.')||/(?:^|\.)(?:localhost|local|internal)$/.test(host);
 return {base:local?'':url.origin,indexable:!local&&indexable==='true'};
}

export function structuredData(c,role,base,url){
 const person={'@type':'Person','@id':`${base}/#person`,name:'João Victor',alternateName:'ojoaovsousa',url:`${base}/pt-br/`,jobTitle:role,sameAs:['https://github.com/jovi47','https://www.linkedin.com/in/jovi47/']};
 const service={'@type':'Service','@id':`${url}#service`,name:c.hero.titleBottom,description:c.hero.description,url,serviceType:c.expertise.items.map(item=>item.title),provider:{'@id':person['@id']}};
 return JSON.stringify({'@context':'https://schema.org','@graph':[person,service]}).replace(/</g,'\\u003c');
}

const md=text=>text.replace(/[\\`*_[\]<>]/g,'\\$&');
export function localizedMarkdown(c,key,base){
 return `# João Victor · ojoaovsousa\n\n> ${md(c.description)}\n\n${md(c.hero.description)}\n\n## ${md(c.expertise.title)}\n\n${c.expertise.items.map(item=>`### ${md(item.title)}\n\n${md(item.body)}`).join('\n\n')}\n\n## ${md(c.work.title)}\n\n${c.work.cases.map(item=>`### [${md(item.name)}](${item.url})\n\n${md(item.description)}`).join('\n\n')}\n\n[${md(c.hero.titleBottom)}](${base}/${key}/)\n`;
}

export function llmsIndex(content,base){
 return `# João Victor · ojoaovsousa\n\n> ${md(content.en.description)}\n\n## Languages\n\n${Object.entries(content).map(([key,c])=>`- [${c.lang}: ${md(c.hero.titleBottom)}](${base}/${key}/index.md): ${md(c.description)}`).join('\n')}\n\n## Projects\n\n${content.en.work.cases.map(item=>`- [${md(item.name)}](${item.url}): ${md(item.description)}`).join('\n')}\n`;
}
