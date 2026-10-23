export function inquiryDraft({name,email,project}){
 const fields=[name,email,project].map(value=>typeof value==='string'?value.trim():'');
 if(!fields[0]||fields[0].length>120||!/^\S+@\S+\.\S+$/.test(fields[1])||fields[1].length>254||!fields[2]||fields[2].length>3000)throw new Error('Invalid inquiry');
 const body=`Nome / Name: ${fields[0]}\nE-mail: ${fields[1]}\n\nProjeto / Project:\n${fields[2]}`;
 return `mailto:jovi47profissional@gmail.com?subject=${encodeURIComponent('Novo projeto · João Victor')}&body=${encodeURIComponent(body)}`;
}
