# Deprecated / Quarantine

Arquivos movidos para esta pasta sairam do caminho ativo do build, mas foram mantidos para rastreabilidade e seguranca.

## Criterios usados

- nao sao referenciados por templates, layouts, includes, data files ou assets publicos do build atual
- parecem exportacoes antigas, backups, notas internas ou referencias soltas
- possuem duplicatas mais claras dentro da estrutura ativa

## Itens movidos

### `deprecated/exports/bit-system-wordpress-export/`

- snapshot HTML completo do projeto `bit-system`
- pasta auxiliar `_files/` gerada junto do export
- motivo: material exportado, duplicado em relacao aos assets usados no case atual, sem referencia no build

### `deprecated/references/marketing/`

- `glossario_graficos_marketing.html`
- `glossario_metricas_marketing.html`
- motivo: HTMLs de referencia sem uso no site

### `deprecated/notes/design-grafico/`

- `Videos.txt`
- motivo: nota solta sem consumo pelo build

### `deprecated/notes/projetos/bit-system/`

- `infos.txt`
- motivo: anotacao interna sem referencia nos templates

### `deprecated/notes/projetos/web-dev/`

- `infos.txt`
- motivo: anotacao interna sem referencia nos templates

### `deprecated/assets/top-level-unused/`

- `capa-projeto.webp`
- `FarmWell.webp`
- `Mockup-Design-System-1.webp`
- `projeto-olho-vivo-2.webp`
- `quantum-capa-1.webp`
- motivo: imagens soltas na raiz de `assets`, sem referencia no build atual e sem papel semantico claro

### `deprecated/assets/sites-unused/`

- `amarelo.webp`
- `buffet-reuss.webp`
- `choripan.webp`
- `homerinho.webp`
- `quantum-vizz-1.webp`
- `speed.webp`
- `terezan.webp`
- motivo: thumbs de sites nao usados na pagina atual de projetos
