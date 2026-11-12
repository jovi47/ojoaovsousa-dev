# Toro Auto Center

A prévia em pt-BR vive em `public/prototypes/toro-auto-center/`. O build estático do portfólio copia a pasta para `dist/`. A rota usa ativos relativos, navegação própria e JavaScript local para a cápsula, o menu e as entradas. HTML, links e conteúdo principal continuam disponíveis sem JavaScript. A folha de estilo compilada é versionada para o build comum continuar sem dependências.

## Editar e conferir localmente

Para revisar a versão compilada, execute `npm run build` e `PORT=3001 npm run dev` na worktree. A página fica em [localhost:3001/prototypes/toro-auto-center/](http://localhost:3001/prototypes/toro-auto-center/). O servidor observa `public/` e `src/` e recarrega a página após reconstruir.

Para editar `src/prototypes/toro-auto-center.css` ou alterar as classes Tailwind no HTML, compile novamente:

```sh
npm install --no-save --package-lock=false --ignore-scripts tailwindcss@4.3.5 @tailwindcss/cli@4.3.5
npx --no-install tailwindcss -i src/prototypes/toro-auto-center.css -o public/prototypes/toro-auto-center/style.css --minify
```

Use `--watch=always` no segundo comando para recompilar durante a edição. A descoberta de classes se limita ao HTML da Toro.

## Descoberta, mapa e release

- A página tem meta robots `noindex, nofollow`. O Cloudflare Pages envia o mesmo cabeçalho na rota e nos seus ativos. A navegação, o sitemap e o índice Markdown do portfólio excluem a rota.
- A CSP da URL com barra final permite somente o frame de `https://www.google.com`. As demais políticas permanecem sob as regras existentes. O servidor local lê a mesma política dessa rota em `public/_headers`.
- O mapa usa o compartilhamento incorporado da ficha pública da Toro, com carregamento tardio e `no-referrer`. O endereço e o link de rota ficam disponíveis em HTML. A página usa os destinos públicos de WhatsApp e Instagram e não instala analytics nem envia formulários.
- O JSON-LD `AutoRepair` usa o endereço e o WhatsApp confirmados. Horário e três espaços de depoimento estão rotulados como placeholders e ficam fora do JSON-LD. O Open Graph aponta para a URL e a foto planejadas no Cloudflare Pages.
- Para verificar uma revisão, use `npm test`, o build padrão, o build com `INDEXABLE=true` e `SITE_URL` HTTPS confirmado, e `node scripts/audit.mjs`. A validação da rota no emulador Pages verifica uma única CSP, ausência da exceção nos ativos e nas páginas do portfólio, e redirecionamento dos aliases para a URL com barra.
- O procedimento de publicação é o [runbook do Cloudflare Pages](cloudflare-pages.md). Esta entrega está em revisão local.

## Ativos e custo

As fotografias ilustrativas e os pôsteres de recuperação foram gerados com ImageGen. O WebP de abertura tem variante móvel e o de bateria carrega sob demanda. A Geist variável está hospedada na rota com licença SIL OFL. A escala tipográfica segue a referência Tesla. O uso da Universal Sans depende de uma licença web e dos arquivos da família.

## Expositor 3D

O módulo `public/prototypes/toro-auto-center/vehicle-stage.js` carrega sob demanda e reaproveita Three.js r186 e GLTFLoader locais. A moto baixa somente quando selecionada. A animação pausa fora da tela e em abas ocultas. Com movimento reduzido, o quadro muda diretamente e a rotação automática fica desativada. Sem WebGL, os mesmos botões exibem a explicação e aproximam a imagem estática.

- **Carro.** Mercedes-AMG GT de Yan Carvalho, obtido pelo catálogo [carros](https://github.com/pedrosoandre/carros) e adaptado no Blender. O capô e as rodas foram separados, a geometria reduzida e a pintura refeita. O motor esquemático é uma adaptação do [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) de Eric Chadwick / Darmstadt Graphics Group. A bateria é ilustrativa. As posições representam regiões aproximadas, sem pretensão de documentação técnica da AMG.
- **Moto.** Modelo Meshy 6 Lite reduzido no Blender e colorido na cena. Tem somente o botão de bateria, conforme o catálogo público da Toro. As duas fontes têm licença CC BY 4.0 e o crédito fica visível na interface.
- **Raio X.** Capô abre e a pintura da carroceria se torna translúcida. **Vista explodida.** Capô, motor, rodas esquerdas e bateria se deslocam em conjunto. Os botões de serviço podem abrir o capô, deslocar a roda ou aproximar a câmera conforme a região.

### Adaptar outro veículo

1. Importe uma malha licenciada no Blender. Remova o cenário e detalhes que a câmera nunca vê. Use o chão em Y=0 no GLB, frente em +Z e comprimento próximo de duas unidades. Inspecione a silhueta depois de reduzir a malha.
2. Separe as peças que vão se mover em nós nomeados. Ajuste a origem do capô para a dobradiça e mantenha motor, roda e carroceria em nós próprios. Se a malha só tiver o exterior, use um componente ilustrativo identificado. Preserve material distinto para as áreas que participarão do raio X.
3. Adicione a configuração em `vehicles`: GLB, enquadramento geral, nós animados, deslocamentos e ponto de câmera por serviço. O carregador, as transições e a interface não dependem do modelo. Atualize os rótulos e créditos do HTML e permita explicitamente o GLB na auditoria de saída.
4. Confira visibilidade das peças, fechamento da dobradiça, retorno da vista explodida, alternância de veículo, movimento reduzido, ausência de WebGL, teclado e celular.

### Referências estudadas

- [EV Anatomy](https://github.com/Phoenix0415/ev-anatomy), `src/interactions.js`: separa enquadramento da câmera, restauração das peças e opacidade da carroceria. A Toro usa botões fora do modelo e os modos Raio X e Vista explodida.
- [APEX Stradale](https://github.com/ravi-arnan/apex-stradale), `src/CameraRig.jsx`: enquadramento por componente com destino para posição e ponto de interesse.
- [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept): hierarquia, pivôs, materiais e redução de geometria. [Car Commercial Site Scrolling](https://dribbble.com/shots/11914664-Car-Commercial-Site-Scrolling) orientou a composição e a abertura progressiva.

A Meshy web apresentou 10 créditos por geração, 20 para os dois modelos. A primeira tentativa pela API retornou 402 no plano gratuito e não criou tarefa. A picape Meshy ficou fora da saída vigente após a escolha do cupê. O uso ocorreu no plano Free, sem contratação. O custo de tráfego depende das sessões que chegam à seção, das que alternam para moto e do cache do navegador.
