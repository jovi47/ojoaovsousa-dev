import {viewerHome} from './viewer-page.mjs';

const blackCopy={
 'pt-br':{
  canvas:'Três construções LEGO em 3D',name:'Peça por peça',
  intro:'Role para montar meu repertório e os projetos que já ganharam forma.',
  loading:'Preparando as construções LEGO…',ready:'Role para montar as três construções. Depois, explore.',
  readySea:'Arraste para girar · Use as setas para explorar',
  help:'Role para montar · Depois arraste para girar',
  exploreLocked:'Continue rolando para montar as três construções.',
  constructionStack:'01 · Montando meu castelo…',constructionHoragora:'02 · Montando o HorAgora…',constructionAndrea:'03 · Montando a ASC…',constructionChallenge:'Montando seu próximo desafio…',
  card:'Detalhes da construção',
  rotateLeft:'Girar à esquerda',rotateRight:'Girar à direita',zoomIn:'Aproximar construções',zoomOut:'Afastar construções',
  replayBuild:'Recomeçar montagem',
 },
 en:{
  canvas:'Three LEGO buildings in 3D',name:'Piece by piece',
  intro:'Scroll to assemble my toolkit and the projects already brought to life.',
  loading:'Preparing the LEGO buildings…',ready:'Scroll to assemble the three buildings. Then explore.',
  readySea:'Drag to rotate · Use the arrows to explore',
  help:'Scroll to build · Then drag to rotate',
  exploreLocked:'Keep scrolling to assemble the three buildings.',
  constructionStack:'01 · Building my castle…',constructionHoragora:'02 · Building HorAgora…',constructionAndrea:'03 · Building ASC…',constructionChallenge:'Building your next challenge…',
  card:'Building details',
  rotateLeft:'Rotate left',rotateRight:'Rotate right',zoomIn:'Zoom in on buildings',zoomOut:'Zoom out from buildings',
  replayBuild:'Restart assembly',
 },
 es:{
  canvas:'Tres construcciones LEGO en 3D',name:'Pieza a pieza',
  intro:'Desplázate para montar mi repertorio y los proyectos que ya tomaron forma.',
  loading:'Preparando las construcciones LEGO…',ready:'Desplázate para montar las tres construcciones. Después, explora.',
  readySea:'Arrastra para girar · Usa las flechas para explorar',
  help:'Desplázate para montar · Luego arrastra para girar',
  exploreLocked:'Sigue desplazándote para montar las tres construcciones.',
  constructionStack:'01 · Montando mi castillo…',constructionHoragora:'02 · Montando HorAgora…',constructionAndrea:'03 · Montando ASC…',constructionChallenge:'Montando tu próximo desafío…',
  card:'Detalles de la construcción',
  rotateLeft:'Girar a la izquierda',rotateRight:'Girar a la derecha',zoomIn:'Acercar construcciones',zoomOut:'Alejar construcciones',
  replayBuild:'Reiniciar montaje',
 },
};

export function blackHome(c,key){
 return viewerHome(c,key,{variant:'black',copy:{...blackCopy[key],intro:c.hero.description,projectTitle:c.hero.description}});
}
