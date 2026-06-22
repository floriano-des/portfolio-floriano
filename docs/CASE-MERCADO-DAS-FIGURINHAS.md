# Case Mercado das Figurinhas

## Estado atual

Este case usa uma implementação isolada para preservar os outros projetos enquanto o novo padrão é validado.

Arquivos principais:

* `src/projetos/mercado-das-figurinhas.njk`: conteúdo e estrutura das versões detalhada e TL;DR.
* `src/_includes/layouts/case-study-immersive.njk`: documento HTML, metadados, Schema.org e ausência intencional de cabeçalho e rodapé.
* `src/css/case-study-immersive.css`: layout e componentes visuais, conectados aos tokens globais.
* `src/js/case-study-immersive.js`: troca de versão, zoom, arraste dos carrosséis, fechamento do case e botão de retorno ao topo.

## Decisões consolidadas

* O Eleventy continua responsável pelo build estático e pelo deploy.
* O case abre sem cabeçalho e rodapé globais.
* O botão de fechar retorna ao histórico quando possível e usa `/#projetos` como fallback.
* Os carrosséis aceitam arraste horizontal, mas não bloqueiam a rolagem vertical da página.
* Imagens informativas possuem zoom e navegação por arraste.
* O PDF de pesquisa possui rolagem própria e mantém a prevenção do Lenis.
* As versões detalhada e TL;DR compartilham o mesmo documento e atualizam a URL com `?mode=tldr`.

## Replicação para outros cases

Antes de transformar este template em padrão compartilhado, separar conteúdo, componentes e variações em dados ou macros Nunjucks. Não adicionar regras específicas deste case aos arquivos globais dos cases antigos.

## Validação

Executar:

```bash
npm run build
```

Depois verificar desktop e mobile, incluindo rolagem sobre carrosséis, zoom, troca de versão, vídeo, PDF e botão de fechar.
