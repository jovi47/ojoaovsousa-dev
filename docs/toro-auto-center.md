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
- O mapa usa o compartilhamento incorporado da ficha pública da Toro, com carregamento tardio e `no-referrer`. O endereço e o link de rota ficam disponíveis em HTML. A página usa os contatos públicos de WhatsApp, telefone e Instagram. O horário de balcão segue a página Contate-nos do Wix. A página não instala analytics nem envia formulários.
- O JSON-LD `AutoRepair` usa o endereço e o WhatsApp confirmados. O horário de balcão aparece no conteúdo. Três espaços de depoimento estão rotulados como placeholders e ficam fora do JSON-LD. O Open Graph aponta para a URL e a foto planejadas no Cloudflare Pages.
- Para verificar uma revisão, use `npm test`, o build padrão, o build com `INDEXABLE=true` e `SITE_URL` HTTPS confirmado, e `node scripts/audit.mjs`. A validação da rota no emulador Pages verifica uma única CSP, ausência da exceção nos ativos e nas páginas do portfólio, e redirecionamento dos aliases para a URL com barra.
- O procedimento de publicação é o [runbook do Cloudflare Pages](cloudflare-pages.md). Esta entrega está em revisão local.

## Ativos e custo

As fotografias ilustrativas e o pôster da moto foram gerados com ImageGen. O pôster do carro vem de um quadro da cena do AMG branco. O WebP de abertura tem variante móvel e o de bateria carrega sob demanda. A Geist variável está hospedada na rota com licença SIL OFL. A escala tipográfica segue a referência Tesla. O uso da Universal Sans depende de uma licença web e dos arquivos da família.

## Navegação e catálogo

Com JavaScript, cada cena ocupa a altura disponível entre o cabeçalho e os controles inferiores. Roda do mouse, gesto de deslizar e teclas de navegação mudam a cena ao chegar ao limite do conteúdo interno. Os botões também mudam a cena diretamente. Âncoras e o histórico do navegador preservam os destinos. Na abertura, o AMG aparece à direita no desktop. O mesmo canvas passa à esquerda em Explore o veículo, com movimento desativado quando o sistema pede redução. Sem JavaScript, o HTML permanece em ordem de leitura, com as imagens e os links.

O catálogo incorpora os produtos, a lista completa de mecânica e o atendimento em domicílio do [Wix oficial](https://autocenter-bateria.wixsite.com/home/servicos). Os links de óleo, freios, faróis, eixo e bateria reaproveitam as demonstrações do carro. A seção Baterias reúne teste, troca e socorro em domicílio. O catálogo usa painéis nativos expansíveis para as sete capacidades, com as aplicações divulgadas para 40, 48, 60 e 70 Ah e consulta por capacidade. A imagem de moto do Wix indica 6 Ah, enquanto o título indica 12 Ah, por isso a ficha sinaliza a divergência. Dimensões, polaridade, corrente de partida e garantia dependem da referência confirmada com a oficina. [Catálogo de baterias](https://autocenter-bateria.wixsite.com/home/loja-2-1)

## Expositor 3D

O módulo `public/prototypes/toro-auto-center/vehicle-stage.js` carrega sob demanda e reaproveita Three.js r186 e GLTFLoader locais. A moto baixa somente quando selecionada. A animação pausa fora da tela e em abas ocultas. Com movimento reduzido, o quadro muda diretamente e a rotação automática fica desativada. Sem WebGL, os botões exibem a explicação e aproximam o pôster estático do AMG branco.

- **Carro.** Mercedes-AMG GT de Yan Carvalho, obtido pelo catálogo [carros](https://github.com/pedrosoandre/carros) e adaptado no Blender. O capô e as rodas foram separados, a geometria otimizada com mais detalhe em faróis, rodas e painéis e a pintura refeita em branco perolado. O motor esquemático é uma adaptação do [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) de Eric Chadwick / Darmstadt Graphics Group. A bateria e os componentes didáticos são ilustrativos. As posições representam regiões aproximadas.
- **Moto.** Modelo Meshy 6 Lite reduzido no Blender e colorido na cena. Tem somente o botão de bateria, conforme o catálogo público da Toro. As duas fontes têm licença CC BY 4.0 e o crédito fica visível na interface.
- **Raio X.** Capô abre e a pintura da carroceria se torna translúcida. **Vista explodida.** Capô, motor, rodas esquerdas e bateria se deslocam em conjunto. A seleção de produto ou serviço abre um detalhe no mesmo expositor e move a câmera para a região correspondente. A malha do carro vira um contorno discreto e a peça fica visível no local, com profundidade própria. Próximo e Anterior percorrem os itens sem sair da cena. O expositor ocupa a segunda seção, em grafite de ponta a ponta com controles amarelos. A moldura do site fica fixa, com rolagem interna quando a lista excede a altura disponível.

Os 12 exemplos do carro e a bateria da moto são construídos sob demanda em `vehicle-parts.js`. A câmera mostra o eixo traseiro com as duas rodas e os dois faróis em conjunto. Todos têm demonstrações que podem ser pausadas e seguem a preferência de movimento reduzido. A bateria conecta os terminais e indica carga, o óleo flui e sobe em um reservatório didático, as rodas se alinham e giram, a injeção pulveriza, o compressor gira, os faróis acendem e apagam, a pastilha freia o disco e a suspensão comprime e retorna. Correias, palhetas, velas e escapamento demonstram giro, varredura, ignição e vibração, respectivamente. A escolha do eixo traseiro acompanha a arquitetura do [Mercedes-AMG GT de primeira geração](https://media.mbusa.com/news/my2016-mercedes-amg-gt-gt-s-quick-reference-guide).

### Adaptar outro veículo

1. Importe uma malha licenciada no Blender. Remova o cenário e detalhes que a câmera nunca vê. Use o chão em Y=0 no GLB, frente em +Z e comprimento próximo de duas unidades. Inspecione a silhueta depois de reduzir a malha.
2. Separe as peças que vão se mover em nós nomeados. Ajuste a origem do capô para a dobradiça e mantenha motor, roda e carroceria em nós próprios. Se a malha só tiver o exterior, use um componente ilustrativo identificado. Preserve material distinto para as áreas que participarão do raio X.
3. Adicione a configuração em `vehicles`: GLB, enquadramento geral, nós animados, deslocamentos e posição, escala, orientação e ângulo de câmera por serviço. O carregador, as transições e a interface não dependem do modelo. Atualize os rótulos e créditos do HTML e permita explicitamente o GLB na auditoria de saída.
4. Confira visibilidade das peças, fechamento da dobradiça, retorno da vista explodida, alternância de veículo, movimento reduzido, ausência de WebGL, teclado e celular.

### Referências estudadas

- [EV Anatomy](https://github.com/Phoenix0415/ev-anatomy), `src/interactions.js`: separa enquadramento da câmera, restauração das peças e opacidade da carroceria. A Toro usa botões fora do modelo e os modos Raio X e Vista explodida.
- [Otherlife Labs Virtual Car Showroom](https://labs.otherlife.xyz/virtual-car-showroom): palco amplo, sombra de piso, controles discretos e acendimento dos faróis com brilho nas lentes. A sombra da Toro é uma textura pequena, gerada no navegador.
- [APEX Stradale](https://github.com/ravi-arnan/apex-stradale), `src/CameraRig.jsx`: enquadramento por componente com destino para posição e ponto de interesse.
- [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept): hierarquia, pivôs, materiais e redução de geometria. [Car Commercial Site Scrolling](https://dribbble.com/shots/11914664-Car-Commercial-Site-Scrolling) orientou a composição e a abertura progressiva.

A Meshy web apresentou 10 créditos por geração, 20 para os dois modelos. A primeira tentativa pela API retornou 402 no plano gratuito e não criou tarefa. A picape Meshy ficou fora da saída vigente após a escolha do cupê. O uso ocorreu no plano Free, sem contratação. Em 12/11/2026, o GLB branco tem 2.905.564 bytes, um acréscimo de 745.124 bytes por carregamento sem cache. O módulo das peças acrescenta cerca de 15 kB antes de compressão e usa a biblioteca existente. A referência bruta de acréscimo para 1.000 carregamentos sem cache é aproximadamente 0,76 GB por mês (diferença do GLB e do módulo vezes 1.000). Os efeitos acrescentam cerca de 6 kB de JavaScript bruto, cerca de 6 MB a cada 1.000 carregamentos sem cache. A textura de brilho é gerada no navegador. O custo contratado adicional é R$ 0. A navegação em cenas reaproveita o canvas e o GLB; o carro passa a carregar na abertura. Por visita que antes não entrava em Serviços, isso representa até 2,91 MB brutos de GLB antes do cache, ou cerca de 2,91 GB para 1.000 visitas nessas condições. O tráfego real depende de quantas sessões chegam à seção, da seleção da moto e do cache do navegador.

Em 12/11/2026, o catálogo adiciona seis fotos WebP do Wix com carregamento tardio, totalizando 107.154 bytes. São cerca de 107 MB brutos por 1.000 visitas que carregarem todas sem cache. Custo contratado incremental de R$ 0.
