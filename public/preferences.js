/* Browser language and theme preferences. */
(()=>{
 const html=document.documentElement,themeKey='portfolio-theme',languageKey='portfolio-language';
 const locales=new Map([['pt','pt-br'],['en','en'],['es','es']]);
 const locale=value=>typeof value==='string'?locales.get(value.toLowerCase().split('-')[0]):undefined;
 function read(key){try{return localStorage.getItem(key);}catch{return null;}}
 function save(key,value){try{localStorage.setItem(key,value);}catch{}}
 let manualTheme=read(themeKey);
 if(!['light','dark'].includes(manualTheme))manualTheme=null;
 const systemTheme=matchMedia('(prefers-color-scheme: dark)');
 function syncThemeButtons(){
  const dark=html.dataset.theme==='dark';
  for(const button of document.querySelectorAll('[data-theme-toggle]')){
   const label=dark?button.dataset.themeLight:button.dataset.themeDark;
   button.setAttribute('aria-pressed',String(dark));
   if(label){button.setAttribute('aria-label',label);button.title=label;}
  }
 }
 function applyTheme(theme){html.dataset.theme=theme;syncThemeButtons();document.dispatchEvent(new Event('themechange'));}
 applyTheme(manualTheme||(systemTheme.matches?'dark':'light'));
 systemTheme.addEventListener('change',()=>{if(!manualTheme)applyTheme(systemTheme.matches?'dark':'light');});

 const savedLanguage=read(languageKey);
 const deviceLanguages=navigator.languages?.length?navigator.languages:[navigator.language];
 const preferredLanguage=['pt-br','en','es'].includes(savedLanguage)?savedLanguage:deviceLanguages.map(locale).find(Boolean)||'pt-br';
 if(location.pathname==='/'||location.pathname==='/index.html')location.replace(`/${preferredLanguage}/${location.search}${location.hash}`);

 function bindChoices(){
  syncThemeButtons();
  for(const button of document.querySelectorAll('[data-theme-toggle]'))button.addEventListener('click',()=>{
   manualTheme=html.dataset.theme==='dark'?'light':'dark';save(themeKey,manualTheme);applyTheme(manualTheme);
  });
  for(const link of document.querySelectorAll('.language-picker a[lang]'))link.addEventListener('click',()=>{
   const chosen=locale(link.getAttribute('lang'));if(chosen)save(languageKey,chosen);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindChoices,{once:true});else bindChoices();
})();
