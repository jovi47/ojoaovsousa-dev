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

As duas imagens ilustrativas são originais gerados com ImageGen. O WebP de abertura tem variante móvel e o de bateria carrega sob demanda. A Barlow Condensed está hospedada na própria rota com a licença SIL OFL. A pasta de saída contém aproximadamente 353 KiB brutos, incluindo ambas as variantes, a fonte e a licença. Não houve nova contratação ou configuração de chave de API para o mapa. Consumo de geração, hospedagem e tráfego real não foi medido.
