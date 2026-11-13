# Toro Auto Center

A prévia em pt-BR vive em `public/prototypes/toro-auto-center/`. O build estático do portfólio copia a pasta para `dist/`. A rota usa ativos relativos, navegação própria e JavaScript local para o menu e o expositor. HTML, links e conteúdo principal continuam disponíveis sem JavaScript. A folha de estilo compilada é versionada para o build comum continuar sem dependências.

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
- O mapa usa o compartilhamento incorporado da ficha pública da Toro, com carregamento tardio e `no-referrer`. O endereço e o link de rota ficam disponíveis em HTML. A página usa os contatos públicos de WhatsApp, telefone e Instagram. O horário de balcão segue a página Contate-nos do Wix. A página não instala analytics nem envia formulários. O rodapé apresenta marca, contatos e links para privacidade e termos da prévia. Endereço e horários aparecem lado a lado quando há largura suficiente. O mapa abre a rota no Google Maps.
- O JSON-LD `AutoRepair` usa o endereço e o WhatsApp confirmados. O horário de balcão aparece no conteúdo. As dúvidas frequentes ficam no HTML em acordeões nativos. O Open Graph aponta para a URL e a foto planejadas no Cloudflare Pages.
- Para verificar uma revisão, use `npm test`, o build padrão, o build com `INDEXABLE=true` e `SITE_URL` HTTPS confirmado, e `node scripts/audit.mjs`. A validação da rota no emulador Pages verifica uma única CSP, ausência da exceção nos ativos e nas páginas do portfólio, e redirecionamento dos aliases para a URL com barra.
- O procedimento de publicação é o [runbook do Cloudflare Pages](cloudflare-pages.md). Esta entrega está em revisão local.

## Ativos e custo

A imagem de compartilhamento foi gerada com ImageGen. Os pôsteres do carro e da moto vêm de quadros dos modelos vigentes e servem de imagem inicial e de recuperação. As fotos das baterias carregam sob demanda. Seis vêm do Wix e a foto de 12 Ah vem da Heliar. A Geist variável está hospedada na rota com licença SIL OFL. A escala tipográfica segue a referência Tesla. O uso da Universal Sans depende de uma licença web e dos arquivos da família.

## Navegação e catálogo

A página usa rolagem vertical nativa, âncoras e cabeçalho em cápsula. Um único palco acompanha a abertura e o expositor em todas as larguras. O carro começa maior e mais baixo, sobe e diminui com a rolagem, e passa à vista translúcida. A seta e o botão Explorar o veículo levam à cena completa. Um clique numa peça ou no seletor de veículo durante a transição também conclui a cena. Em telas baixas, a parte final das opções entra com a rolagem normal. Com movimento reduzido, a troca de cena é imediata. Sem JavaScript, o conteúdo continua disponível com a foto estática e todas as fichas.

O catálogo incorpora os produtos e o atendimento em domicílio do [Wix oficial](https://autocenter-bateria.wixsite.com/home/servicos). A seção Revisão e manutenção reúne revisão de carros, manutenção preventiva e inspeção veicular em três cards, cada um com uma mensagem de WhatsApp própria. Óleo, freios, faróis, alinhamento e bateria são apresentados no expositor. O fluxo de domicílio tem quatro etapas na horizontal. O carrinho percorre a linha em cerca de cinco segundos, reinicia ao voltar à tela e troca a explicação no card ao chegar a cada marco. Os números também podem ser selecionados manualmente. Com movimento reduzido, só a seleção manual atualiza o card. O atalho abaixo do aviso sobre peças em geral abre a consulta de horários no WhatsApp. A seção Baterias reúne teste, troca e socorro em domicílio. Sete botões trocam a ficha à esquerda e a foto do produto à direita nas larguras a partir de 390 px. Em telas mais estreitas, a foto vem depois da ficha. Os ícones ao lado da capacidade indicam carro, moto ou linha leve e pesada. As fotos têm a mesma área de exibição e usam os recortes das imagens originais. Nas fichas de 40, 48, 60 e 70 Ah, os logotipos das montadoras abrem a lista de modelos, com as versões agrupadas. A marca selecionada fica amarela. As fichas de 100 e 150 Ah usam um link de compatibilidade que solicita modelo, ano e motor por WhatsApp. Cada capacidade tem um link próprio de consulta. A ficha de 12 Ah usa como referência a foto da [Heliar HE12E](https://www.heliar.com/produtos/detalhes-do-produto/he12e---12ah---garantia-6-meses), sem confirmação de estoque. Dimensões, polaridade, corrente de partida e garantia dependem da referência confirmada com a oficina. [Catálogo de baterias](https://autocenter-bateria.wixsite.com/home/loja-2-1)

## Expositor 3D

O módulo `public/prototypes/toro-auto-center/vehicle-stage.js` carrega sob demanda e reaproveita Three.js r186 e GLTFLoader locais. A moto baixa somente quando selecionada. A animação pausa fora da tela e em abas ocultas. O traçado é calculado no primeiro uso e reaproveitado. A resolução do canvas tem limite de 1,3× e de aproximadamente um milhão de pixels. Com movimento reduzido, o quadro muda diretamente e a rotação automática fica desativada. Sem WebGL, os botões exibem a explicação e aproximam o pôster estático do veículo selecionado.

- **Carro.** Mercedes-AMG GT de Yan Carvalho, obtido pelo catálogo [carros](https://github.com/pedrosoandre/carros) e adaptado no Blender. O capô e as rodas foram separados, a geometria otimizada com mais detalhe em faróis, rodas e painéis e a pintura refeita em branco perolado. O motor esquemático é uma adaptação do [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) de Eric Chadwick / Darmstadt Graphics Group. A bateria e os componentes didáticos são ilustrativos. As posições representam regiões aproximadas.
- **Moto.** Modelo [Three Cylinder Naked Street Bike](https://sketchfab.com/3d-models/three-cylinder-naked-street-bike-0897a975845647919728095d117a6255) de Jamie Hamel-Smith, inspirado na Yamaha MT-09, reduzido no Blender e pintado em grafite. Tem somente o botão de bateria, conforme o catálogo público da Toro. As fontes têm licença CC BY 4.0 e os créditos estão no rodapé.
- **Apresentação.** A abertura mostra o AMG branco em rotação lenta. No expositor, a vista geral do carro gira com a carroceria translúcida em Raio X. Selecionar uma peça amplia o palco até as bordas da cena e destaca o componente animado no carro em traçado. Alinhamento, faróis e escapamento têm enquadramento mais próximo. Selecionar o mesmo botão novamente volta à vista geral. Os ícones de carro e moto indicam a seleção em amarelo. Em telas largas, Produtos e Serviços ficam à esquerda e o palco à direita. Em desktops intermediários, cada grupo usa duas colunas abaixo do palco. Os créditos dos modelos estão recolhidos no rodapé.

Os 12 exemplos do carro e a bateria da moto são construídos sob demanda em `vehicle-parts.js`. A câmera mostra o eixo traseiro com as duas rodas e os dois faróis em conjunto. Todas as demonstrações seguem a preferência de movimento reduzido. A bateria da moto tem formato próprio e terminais de parafuso. As duas baterias demonstram conexão e carga, o óleo flui e sobe em um reservatório didático, as rodas se alinham e giram, a injeção pulveriza, o compressor gira, os faróis acendem e apagam, a pastilha freia o disco e a suspensão comprime e retorna. Correias, palhetas, velas e escapamento demonstram giro, varredura, ignição e vibração, respectivamente. A escolha do eixo traseiro acompanha a arquitetura do [Mercedes-AMG GT de primeira geração](https://media.mbusa.com/news/my2016-mercedes-amg-gt-gt-s-quick-reference-guide).

### Adaptar outro veículo

1. Importe uma malha licenciada no Blender. Remova o cenário e detalhes que a câmera nunca vê. Use o chão em Y=0 no GLB, frente em +Z e comprimento próximo de duas unidades. Inspecione a silhueta depois de reduzir a malha.
2. Separe as peças que vão se mover em nós nomeados. Ajuste a origem do capô para a dobradiça e mantenha motor, roda e carroceria em nós próprios. Se a malha só tiver o exterior, use um componente ilustrativo identificado. Preserve material distinto para as áreas que participarão do raio X.
3. Adicione a configuração em `vehicles`: GLB, enquadramento geral, nós animados, deslocamentos e posição, escala, orientação e ângulo de câmera por serviço. O carregador, as transições e a interface não dependem do modelo. Atualize os rótulos e créditos do HTML e permita explicitamente o GLB na auditoria de saída.
4. Confira visibilidade das peças, fechamento da dobradiça, retorno à vista geral, alternância de veículo, movimento reduzido, ausência de WebGL, teclado e celular.

### Referências estudadas

- [EV Anatomy](https://github.com/Phoenix0415/ev-anatomy), `src/interactions.js`: separa enquadramento da câmera, restauração das peças e opacidade da carroceria. A Toro usa botões de peças fora do modelo e Raio X na vista geral do carro.
- [Otherlife Labs Virtual Car Showroom](https://labs.otherlife.xyz/virtual-car-showroom): palco amplo, sombra de piso, controles discretos e acendimento dos faróis com brilho nas lentes. A sombra da Toro é uma textura pequena, gerada no navegador.
- [APEX Stradale](https://github.com/ravi-arnan/apex-stradale), `src/CameraRig.jsx`: enquadramento por componente com destino para posição e ponto de interesse.
- [Car Concept](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept): hierarquia, pivôs, materiais e redução de geometria. [Car Commercial Site Scrolling](https://dribbble.com/shots/11914664-Car-Commercial-Site-Scrolling) orientou a composição e a abertura progressiva.

A Meshy web apresentou 10 créditos por geração, 20 para os dois modelos. A primeira tentativa pela API retornou 402 no plano gratuito e não criou tarefa. A picape Meshy ficou fora da saída vigente após a escolha do cupê. O uso ocorreu no plano Free, sem contratação. Em 12/11/2026, o GLB branco tem 2.905.564 bytes, um acréscimo de 745.124 bytes por carregamento sem cache. O módulo das peças acrescenta cerca de 15 kB antes de compressão e usa a biblioteca existente. A referência bruta de acréscimo para 1.000 carregamentos sem cache é aproximadamente 0,76 GB por mês (diferença do GLB e do módulo vezes 1.000). Os efeitos acrescentam cerca de 6 kB de JavaScript bruto, cerca de 6 MB a cada 1.000 carregamentos sem cache. A textura de brilho é gerada no navegador. O custo contratado adicional é R$ 0. O mesmo canvas é usado na abertura e no expositor, e o GLB é carregado uma vez por página. Por visita que antes não entrava em Serviços, isso representa até 2,91 MB brutos de GLB antes do cache, ou cerca de 2,91 GB para 1.000 visitas nessas condições. O tráfego real depende de quantas sessões chegam à seção, da seleção da moto e do cache do navegador.

Em 12/11/2026, o catálogo carrega seis fotos WebP do Wix sob demanda, totalizando 107.154 bytes. São cerca de 107 MB brutos por 1.000 visitas que carregarem todas sem cache. O novo GLB da moto tem 2.624.128 bytes, um acréscimo de 2.334.384 bytes por seleção sem cache, ou 2,33 GB para 1.000 seleções nessas condições. A foto de 12 Ah acrescenta 18.482 bytes, cerca de 18,5 MB por 1.000 seleções sem cache. Custo contratado incremental de R$ 0.

O seletor de baterias usa as fotos existentes e elimina o download da imagem ilustrativa de oficina. Não há custo contratado adicional.

As seções estáticas usam entradas leves que se repetem ao voltar à tela. Em Revisão e manutenção, os cards invertem para amarelo e grafite ao passar o mouse ou focar pelo teclado. O atendimento em domicílio usa um carro decorativo no canto superior direito e uma chave de oficina no inferior esquerdo. Os efeitos são locais e não acrescentam serviços ou custo contratado.
