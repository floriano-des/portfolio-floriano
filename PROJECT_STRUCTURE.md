# Project Structure

## Objetivo

Esta reorganizacao separa com clareza:

- o que faz parte da fonte ativa do site
- o que e material interno de apoio
- o que foi isolado como legado ou aparentemente sem uso

A prioridade foi manter o comportamento atual do build do Eleventy com o menor risco possivel.

## Estrutura atual

```text
.
|-- src/
|   |-- _data/
|   |-- _includes/
|   |-- assets/
|   |-- css/
|   |-- js/
|   |-- projetos/
|   |-- 404.njk
|   |-- index.njk
|   |-- page-sitemap.njk
|   |-- politica-de-privacidade.njk
|   |-- post-sitemap.njk
|   |-- projetos.njk
|   |-- reflexoes.njk
|   |-- sitemap_index.njk
|   `-- sobre.njk
|-- docs/
|   `-- projetos/mercado-das-figurinhas/
|-- deprecated/
|   |-- assets/
|   |-- exports/
|   |-- notes/
|   `-- references/
|-- .github/workflows/
|-- .eleventy.js
|-- .eleventyignore
|-- .gitignore
|-- package.json
`-- README.md
```

## Logica da organizacao

### `src/`

Tudo que entra no build do Eleventy fica dentro de `src/`. Isso reduz a ambiguidade entre codigo-fonte, arquivos de apoio e lixo historico.

- `src/_data/`: dados globais consumidos pelos templates.
- `src/_includes/`: layouts e partials.
- `src/assets/`: arquivos publicos copiados para `/assets`.
- `src/css/`: arquivos publicos copiados para `/css`.
- `src/js/`: arquivos publicos copiados para `/js`.
- `src/projetos/`: paginas de projetos/case studies.
- `src/*.njk`: paginas principais e sitemaps.

### `docs/`

Material interno de trabalho que nao participa do build e nao deve ficar dentro de `assets/`, para nao parecer conteudo publico.

### `deprecated/`

Quarentena para arquivos movidos por alta suspeita de nao uso atual. Nada foi apagado. Se algum item ainda for necessario, ele pode ser restaurado com historico claro no Git.

Categorias usadas:

- `deprecated/assets/`: imagens e thumbs sem referencia no build atual.
- `deprecated/exports/`: exportacoes antigas completas, mantidas apenas por seguranca.
- `deprecated/notes/`: notas soltas sem consumo pelo site.
- `deprecated/references/`: HTMLs de referencia nao conectados ao build.

## Regras adotadas

- URLs publicas permaneceram iguais (`/assets`, `/css`, `/js`, paginas e cases).
- Layouts, includes, data files e templates foram mantidos.
- O build continua saindo em `_site/`.
- Nenhum arquivo com duvida relevante foi apagado.

## Quarentena

Veja a lista e a justificativa em [deprecated/README.md](./deprecated/README.md).
