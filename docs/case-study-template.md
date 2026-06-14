# Template dos estudos de caso

Os seis cases principais usam arquivos Markdown em `src/projetos/` e o layout compartilhado `case-study-md.njk`.

## Estrutura

O frontmatter controla:

* hero e metadados
* resumo do projeto
* métricas principais
* aprendizados
* papel, competências, ferramentas e métodos
* navegação entre projetos

O corpo usa os shortcodes compartilhados:

* `caseSection` para seções com ID e entrada no índice lateral
* `objectiveBlock` para objetivo e gargalos
* `caseFigure` para figuras com legenda e zoom
* `caseQuote` para citações em destaque
* `dataStats`, `caseMetrics`, `comparisonList` e `conversionFormula` para dados e comparações

Galerias usam `.cs-gallery` com os modificadores `.cs-gallery--1`, `.cs-gallery--2` ou `.cs-gallery--3`. Mídia ampla pode usar `.cs-fullbleed`.

## Regras

* preservar texto, métricas e URLs
* manter `layout: case-study-md.njk`
* usar `caseSection` para que o TOC seja montado automaticamente
* adicionar `data-animate` aos novos blocos visuais
* validar build, zoom, mobile e ausência de overflow antes de publicar
