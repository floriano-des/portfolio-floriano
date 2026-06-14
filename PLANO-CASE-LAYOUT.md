# Plano de Layout dos Cases — Quantum Vizz como template

> **Para:** ChatGPT Codex.
> **Objetivo:** corrigir e refinar o layout da página `/projetos/quantum-vizz/` para que ela se leia como um case de UX de verdade (referências abaixo) e, no mesmo movimento, transformar o Quantum Vizz no **template** dos demais cases — colocando as melhorias na camada compartilhada (CSS + layout) e documentando a migração dos outros 6 cases.
> **Nível pedido pelo Floriano:** refino nível-referência (corrigir bugs + adotar ritmo das referências, **sem** reescrever textos/métricas) + 4 recursos: galerias com zoom, índice lateral fixo, citações em destaque e ritmo por blocos full-bleed.
>
> **Referências visuais (somente linguagem de layout, não copiar conteúdo):**
> - lolajiang.com/teambition.html — índice lateral fixo, medida de leitura confortável, grids de artefatos.
> - glorialo.design/work/rokt — respiro, tints de seção, citações centralizadas.
> - pratibhajoshi.com/project/narendra-modi-bjp-connect — blocos full-bleed (claro ↔ navy).
> - moritzoesterlau.de/portfolio/building-a-website-concept-through-fast-paced-workshops.html — grids de 3 colunas com legenda.
>
> **Este documento manda no layout/estrutura visual. Em caso de conflito com `PLANO-REDESIGN.md` ou `README`, eles vencem em conteúdo/posicionamento; aqui vence em layout dos cases.**

---

## 0. Contexto técnico e regras invioláveis

**Stack:** 11ty (Eleventy) + Nunjucks + CSS puro + JS vanilla. Sem React, sem Tailwind, sem bundler. Libs novas só via CDN ou vendored em `src/js/vendor/`.

**Como rodar / pré-visualizar:**
```bash
npm run dev      # eleventy --serve  → http://localhost:8080/projetos/quantum-vizz/
npm run build    # gera _site/
```

**Regras (herdadas do `PLANO-REDESIGN.md`, valem aqui também):**
1. **Não alterar o texto interno dos cases** (corpo, métricas, números, legendas). Este plano mexe em **estrutura e CSS**, não em copy. Se uma mudança exigir mover texto, mova **sem reescrever**.
2. **URLs preservadas:** `/projetos/<slug>/` etc. Nada de quebrar permalinks/SEO.
3. **GTM (GTM-K738G4S2), Schema.org, sitemap, robots, `llms.njk`:** intactos.
4. **Acessibilidade:** todo efeito respeita `prefers-reduced-motion` (fallback estático visível, sem scroll-jacking). Foco visível em tudo que é interativo.
5. **Progressive enhancement:** a página funciona com JS desligado (conteúdo e navegação visíveis). Animações/TOC são camada extra.
6. **Mobile-first e sem regressão de Lighthouse** (meta: performance mobile ≥ 85).

**Mapa dos arquivos que importam aqui:**

| Arquivo | Papel |
|---|---|
| `src/projetos/quantum-vizz.md` | **Conteúdo** do Quantum (frontmatter + corpo com shortcodes). É o case-modelo. |
| `src/_includes/layouts/case-study-md.njk` | Layout do Quantum (hero, overview, resumo, bignums, learnings, role, nav). **Camada compartilhável.** |
| `src/_includes/layouts/case-study.njk` | Layout dos outros 6 cases (apenas renderiza `{{ content }}` — HTML escrito à mão em cada `.njk`). |
| `.eleventy.js` | Shortcodes: `caseSection` (~L62), `caseFigure` (~L77), `dataStats` (~L89), `objectiveBlock` (~L100), `comparisonList` (~L120), `caseMetrics` (~L144), `conversionFormula` (~L155). |
| `src/css/style.case-redesign.css` | **Tokens dos cases + regras do Quantum** (`--case-*` no topo ~L7; `case-overview`; `cs-quantum-v2__*`; figuras; lightbox). Maior alvo. |
| `src/css/case-study.core.css` | `cs-hero`, **`cs-summary` (acordeão, ~L679–765)**, blocos base. |
| `src/css/case-study.projects.css` | **`cs-md-content` (~L465–493)**, `cs-container` (~L4), `cs-figure-frame` (~L1412), `cs-data-grid` (~L1438), regras por projeto (`cs-olho-*`, `cs-bit-*`, etc.). |
| `src/css/style.tokens.css` | Cores/escala. `--color-brand-500:#ee782e`, `--color-dark-900:#01071d`, `--color-neutral-050:#f7f7f7`, `--clr-orange`, escala `--space-*`. |
| `src/js/main.js` | **Lightbox já existe** (`.case-lightbox`, classe `.case-lightbox-trigger`, ~L270+). Reaproveitar. |
| `src/js/motion/reveals.js` | Revela elementos com `[data-animate]` (adiciona `.visible` via IntersectionObserver). Novos blocos devem usar `data-animate`. |

**Valores atuais relevantes (medidos na página):** container do case = `--case-container: 1120px`; medida de texto padrão = `--case-text: 760px`, **mas o Quantum sobrescreve `.cs-quantum-v2 .cs-md-content` para `max-width: 860px`**; grids de mídia do Quantum usam `--quantum-media-width` (≈1072px) alinhados à esquerda. As imagens de persona/jornada são PNG de **8614×4872 (2,1 MB)** e **15860×7864 (4,1 MB)**.

---

## 1. Diagnóstico — o que faz a página parecer "bugada" hoje

> Cada item abaixo é referenciado pelas tarefas da seção 4.

- **B1 — Ritmo vertical inconsistente (o bug principal).** `.cs-md-content` só espaça `p + p`, `li + li` e `ul/ol` (margin-top). Não há espaçamento entre **figura → parágrafo**, **lista → parágrafo** ou **antes de headings**. Resultado visível: na seção *Processo*, a lista de hipóteses **cola** no parágrafo "Tive acesso ao protótipo…"; na *Solução*, a **legenda** da figura antes/depois encosta no parágrafo "Textos reescritos…". Arquivo: `case-study.projects.css` ~L465–493.
- **B2 — Acordeão "Resumo do projeto" em laranja gritante.** `.cs-summary__toggle` usa `background: var(--clr-orange)` com texto navy (`case-study.core.css` ~L692). O redesign troca o fundo do contêiner para `#efeee9` mas **não** o botão, que destoa de toda a paleta sóbria. Parece widget de template, não case.
- **B3 — Figura "antes/depois" com `aspect-ratio` forçado.** `.cs-quantum-v2__wide-figure img` força `aspect-ratio: 868 / 548` + `object-fit: contain` (`style.case-redesign.css` ~L518). Combinado com a falta de margem inferior (B1), a legenda colide com o texto seguinte. O `aspect-ratio` fixo é frágil e desnecessário.
- **B4 — Vídeos sem poster.** Em `quantum-vizz.md` (~L200–208) os `<video preload="metadata">` não têm `poster`. Renderizam como **retângulos pretos** até dar play — parece quebrado/vazio.
- **B5 — Imagens de persona/jornada espremidas e pesadíssimas.** Documentos enormes (8614 px / 15860 px de largura, 2–4 MB) exibidos a ~1072 px → texto interno minúsculo e ilegível. Ironia: o case fala de performance/WebP, mas serve PNGs gigantes. (Já são clicáveis no lightbox, mas não há affordance visível de "ampliar".)
- **B6 — Medida de leitura larga e layout assimétrico.** Texto a 860 px, mídia a ~1072 px, **ambos alinhados à esquerda** → a mídia "vaza" ~210 px só para a direita, criando borda direita irregular. As referências usam medida ~620–720 px e mídia **centralizada** ou **full-bleed** — nunca esse meio-termo torto.
- **B7 — Pouca variação de ritmo.** Quase tudo é o mesmo bloco de texto à esquerda. Falta o que as referências usam para respirar: citações em destaque, blocos full-bleed bem espaçados, grids de artefatos organizados.

---

## 2. Princípios das referências (o alvo)

1. **Hero calmo e arejado** — título grande, subtítulo de uma linha, muito respiro. (Quantum já está bom; só ajustar respiro.)
2. **Medida de leitura única e confortável** (~620–720 px), o corpo **centralizado** na coluna do case — não grudado à esquerda. (todas)
3. **Respiro vertical generoso e CONSISTENTE** entre todo bloco; nada se toca. (todas)
4. **Ritmo por fundo de seção** — alternância claro ↔ navy em blocos full-bleed para marcar as fases. (Pratibha, Gloria)
5. **Grids de artefatos organizados (2–3 colunas) com legenda + ampliar** — nunca uma imagem gigante espremida. (Lola, Moritz)
6. **Citações / declarações em destaque** centralizadas para quebrar o texto. (Gloria, Pratibha)
7. **Índice lateral fixo (TOC) com scroll-spy** acompanhando o scroll. (Lola)
8. **Legendas em tipo pequeno e discreto**, sempre na mesma posição sob a mídia. (todas)

---

## 3. Arquitetura: por que o Quantum vira o template

Hoje há **duas formas** de montar um case:

- **Quantum (`quantum-vizz.md` + `case-study-md.njk`):** dirigido a dados. Todo o "esqueleto" (hero, overview, resumo, bignums, learnings, papel, navegação) mora **no layout**, alimentado pelo frontmatter; o corpo usa **shortcodes** (`caseSection`, `caseFigure`, `dataStats`…). Limpo, sem repetição.
- **Outros 6 (`*.njk` + `case-study.njk`):** cada arquivo reescreve **todo o HTML à mão** (o acordeão inteiro, os bignums com SVG inline, etc.) e usa classes específicas por projeto (`cs-olho-*`, `cs-bit-*`, `cs-webdev-*`, `cs-mercado-*`, `cs-farm-*`). Repetitivo e difícil de manter.

**Consequência prática para este plano:** quase tudo que corrige/refina o Quantum deve ser feito na **camada compartilhada** (`style.case-redesign.css`, `case-study.projects.css`, `case-study.core.css`, `case-study-md.njk` e os shortcodes do `.eleventy.js`). Como **todos os cases usam `<body class="case-redesign">` e os mesmos CSS**, as correções de espaçamento, acordeão, figuras, citações e ritmo **passam a valer para os 6 outros automaticamente**. O passo final da replicação (seção 5) é **migrar cada `.njk` para o formato `.md`** do Quantum, um de cada vez, preservando o texto.

**Regra de ouro de implementação:** prefira mexer em **classes compartilhadas** (`.cs-md-content`, `.cs-summary`, `.cs-figure-frame`, `.cs-data-grid`) a criar regras presas a `.cs-quantum-v2`. Só use `.cs-quantum-v2__*` para o que é genuinamente específico deste case. Tudo que for padrão de case deve nascer reutilizável (de preferência com classe genérica nova, ex.: `.cs-gallery`, `.cs-quote`, `.cs-toc`).

---

## 4. Tarefas de execução (na página Quantum Vizz)

> Formato de cada tarefa: **Arquivos · Problema · Mudança · Aceite.** Faça em ordem (A → F). Cada fase pode ser 1 commit/PR.

### FASE A — Fundação compartilhada (afeta todos os cases)

#### A1 · Sistema de larguras e medida de leitura
**Arquivos:** `style.case-redesign.css` (tokens ~L7–10 e regra `.cs-quantum-v2 .cs-md-content` ~L437–440).
**Problema:** B6 — medida larga (860) e mídia alinhada à esquerda, sem padrão.
**Mudança:** padronizar 3 larguras e **centralizar** tudo na coluna do case:
```css
:root {
  --case-container: 1120px;   /* mantém */
  --case-wide-container: 1240px;
  --case-text: 720px;         /* era 760 — medida mais próxima das referências */
  --case-media: 980px;        /* NOVO: largura "confortável" de mídia, centralizada */
  /* full-bleed usa 100vw, ver D1 */
}
/* corpo de texto centralizado na coluna, medida única */
.cs-md-content { max-width: var(--case-text); margin-inline: auto; }
/* remover override que deixava o Quantum a 860 e alinhado à esquerda */
.cs-quantum-v2 .cs-md-content { max-width: var(--case-text); }
/* mídia do case centralizada (não mais "margin: … 0 0") */
.cs-quantum-v2__media-grid,
.cs-quantum-v2__video-grid,
.cs-quantum-v2__wide-figure { margin-inline: auto; }
```
**Aceite:** em desktop, texto e mídia compartilham o mesmo eixo central; a borda direita do texto não fica "torta" em relação à mídia; medida de leitura ~720 px.

#### A2 · Ritmo vertical do conteúdo (corrige o bug principal)
**Arquivos:** `case-study.projects.css` (`.cs-md-content` ~L465–493).
**Problema:** B1 — só há espaçamento entre `p+p`/`li+li`; figuras, listas→parágrafo e headings colam.
**Mudança:** trocar as regras pontuais por **espaçamento de fluxo** entre irmãos, com respiro maior antes de títulos e ao redor de mídia:
```css
/* espaçamento base entre QUALQUER bloco irmão do corpo */
.cs-md-content > * + * { margin-top: var(--space-6); }          /* 24px */
/* respiro maior antes de subtítulos dentro do corpo */
.cs-md-content > * + h3 { margin-top: var(--space-12); }        /* 48px */
/* mídia (figure/grids/tabelas/vídeos) respira mais acima E abaixo */
.cs-md-content > figure,
.cs-md-content > .cs-quantum-v2__media-grid,
.cs-md-content > .cs-quantum-v2__video-grid,
.cs-md-content > .cs-quantum-v2__table-wrap,
.cs-md-content > .cs-quantum-v2__wide-figure {
  margin-block: var(--space-12);                                /* 48px em cima e embaixo */
}
.cs-md-content ul, .cs-md-content ol { padding-left: 1.25rem; } /* mantém recuo */
.cs-md-content li + li { margin-top: var(--space-2); }
```
Remover as regras antigas que viraram redundantes (`p + p` isolado, `ul/ol margin-top` isolado).
**Aceite:** nas seções *Processo* e *Solução*, a lista e a legenda **não** colam mais no parágrafo seguinte; o espaçamento entre blocos é uniforme em todo o corpo.

---

### FASE B — Correções de bug

#### B-tarefa 1 · Acordeão "Resumo do projeto" (tirar o laranja)
**Arquivos:** `case-study.core.css` (`.cs-summary__toggle` ~L692–713); ajustes em `style.case-redesign.css` (`.cs-summary*` ~L193–220).
**Problema:** B2 — botão laranja gritante.
**Mudança:** estilo discreto, navy/contorno, com o laranja só como acento mínimo (ícone). Sugerido (no `style.case-redesign.css`, para não quebrar outros temas):
```css
.case-redesign .cs-summary__toggle {
  background: transparent;
  color: var(--color-dark-900);
  border: 1px solid rgba(1, 7, 29, 0.16);
  border-radius: 12px;
}
.case-redesign .cs-summary__toggle:hover {
  background: rgba(1, 7, 29, 0.04);
  opacity: 1;
}
.case-redesign .cs-summary__toggle svg:first-child { color: var(--color-brand-500); } /* ícone = único acento */
```
**Aceite:** o bloco "Resumo do projeto" combina com a paleta sóbria; nenhum retângulo laranja sólido; estado aberto/fechado e foco continuam claros.

#### B-tarefa 2 · Figura antes/depois
**Arquivos:** `style.case-redesign.css` (`.cs-quantum-v2__wide-figure img` ~L518–526).
**Problema:** B3 — `aspect-ratio` forçado + (já resolvido por A2) colisão da legenda.
**Mudança:** remover o `aspect-ratio` fixo e deixar a imagem fluir na proporção natural; manter `width:100%` e o fundo claro. A margem agora vem de A2.
```css
.case-redesign .cs-quantum-v2__wide-figure img {
  width: 100%; height: auto; display: block;
  /* aspect-ratio: 868 / 548;  ← REMOVER */
  background: #f7f7f3;
}
```
**Aceite:** a imagem aparece inteira, sem letterbox nem corte; legenda com respiro abaixo; nenhuma barra de rolagem interna.

#### B-tarefa 3 · Vídeos com poster
**Arquivos:** `quantum-vizz.md` (~L200–208); assets em `src/assets/projetos/quantum-vizz/v2/`.
**Problema:** B4 — vídeos pretos sem poster.
**Mudança:**
1. Gerar um quadro-poster `.webp` para cada vídeo (primeiro frame ou um frame representativo) — ex.: `versao-antiga-lp-poster.webp`, `versao-nova-lp-poster.webp`. (Pode usar `ffmpeg -i versao-antiga-lp.mp4 -frames:v 1 -q:v 2 versao-antiga-lp-poster.webp`.)
2. Adicionar `poster="…"` e `preload="none"` em cada `<video>`.
3. Garantir no CSS um `aspect-ratio` no card de vídeo para não haver salto de layout:
```css
.case-redesign .cs-quantum-v2__video-card video {
  width: 100%; display: block; aspect-ratio: 16 / 10;
  object-fit: cover; background: var(--color-dark-900);
}
```
**Aceite:** antes do play, cada vídeo mostra um frame nítido (não preto); sem CLS ao carregar.

---

### FASE C — Mídia: galerias com legenda + zoom

#### C1 · Otimizar os assets pesados (e praticar o que o case prega)
**Arquivos:** `src/assets/projetos/quantum-vizz/v2/`; referências em `quantum-vizz.md` (~L155–164).
**Problema:** B5 — PNGs de 2–4 MB e 8–15 mil px de largura.
**Mudança:**
1. Converter persona e jornada para **WebP** e reduzir a largura máxima para algo são (ex.: ≤ 2400 px) — mantendo nitidez suficiente para o lightbox. Atualizar os `src`/`width`/`height` no `.md`.
2. Remover o asset não usado `pessoa-arquiteta-mais-infos.png` (não referenciado) — confirme antes com `grep -r "pessoa-arquiteta-mais-infos" src/`.
3. O alvo do zoom hoje é o próprio `src` exibido (o `main.js` faz `originalLink.href = currentSrc || src`). Logo, exibir as imagens em ≤ 2400 px WebP **já dá um zoom nítido o suficiente** — não é preciso manter o arquivo gigante. Se quiser preservar um "abrir original" em altíssima resolução, a opção limpa é estender o lightbox para ler um `data-zoom-src` na imagem (hi-res separado); caso contrário, descarte os PNGs originais de 2–4 MB.
**Aceite:** peso somado das imagens da seção *Artefatos* cai ~70%+; sem perda perceptível; build e lightbox seguem funcionando.

#### C2 · Componente de galeria de artefatos (genérico, reutilizável)
**Arquivos:** `style.case-redesign.css` (refatorar `.cs-quantum-v2__media-grid` para uma classe genérica `.cs-gallery`); `quantum-vizz.md`; opcional: novo shortcode em `.eleventy.js`.
**Problema:** B5/B6 — artefatos espremidos, sem affordance de ampliar.
**Mudança:**
1. Criar classe genérica `.cs-gallery` (substitui o uso específico do media-grid; pode manter `cs-quantum-v2__media-grid` como alias):
```css
.cs-gallery { display: grid; gap: clamp(20px, 3vw, 40px); margin-inline: auto;
  width: min(100%, var(--case-wide-container)); }
.cs-gallery--2 { grid-template-columns: repeat(2, 1fr); }
.cs-gallery--3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 760px) { .cs-gallery--2, .cs-gallery--3 { grid-template-columns: 1fr; } }
.cs-gallery figure { margin: 0; }
.cs-gallery img { width: 100%; height: auto; display: block; border-radius: 16px;
  border: 1px solid rgba(1,7,29,.10); background: #f7f7f3; cursor: zoom-in; }
.cs-gallery figcaption { margin-top: var(--space-3); font-size: .88rem;
  color: rgba(1,7,29,.62); line-height: 1.5; }
```
2. **Affordance de ampliar:** o lightbox já existe e se auto-conecta por uma **lista de seletores** em `src/js/main.js` → `initCaseImageLightbox()` (~L262–266). Hoje ela cobre `.case-overview__cover img`, `.cs-quantum-v2__figure img` e `.cs-quantum-v2__wide-figure img`, e **já** aplica `role="button"`, `tabindex="0"`, `aria-label` e abertura por clique/teclado. **Basta adicionar o seletor da galeria** (ex.: `.case-redesign .cs-gallery img`) a esse array — não reimplemente a lógica. Acrescentar só um selo visual "⤢ ampliar" no hover (canto da figura, via CSS) para deixar a affordance explícita.
3. **Persona** e **jornada** entram numa galeria de 1 coluna (são largas) com legenda; a jornada (ultra-wide) pode ir **full-bleed** (ver D1) com dica de "clique para ampliar". O **antes/depois** continua como figura única, agora dentro do mesmo padrão.
**Aceite:** artefatos exibidos em grid limpo, alinhados, com legenda consistente; hover/teclado mostram que dá para ampliar; lightbox abre a versão grande.

---

### FASE D — Ritmo e narrativa

#### D1 · Blocos full-bleed e alternância de fundo consistente
**Arquivos:** `style.case-redesign.css`; `quantum-vizz.md` (parâmetros das `caseSection`).
**Problema:** B7 — transições claro/navy abruptas; mídia ultra-wide precisa de full-bleed.
**Mudança:**
1. Garantir que toda `section.cs-dark` (já usada em *Descoberta*, *Performance*, *Impacto*, *Aprendizados*) tenha o **mesmo** `padding-block` generoso (`--case-section-py`) e que a borda entre clara e navy seja limpa (sem "degraus"). Confirmar a sequência de temas no `.md` para um ritmo proposital (claro → navy → claro…), sem mexer no texto.
2. Utilitário full-bleed para mídia que deve sangrar de ponta a ponta (ex.: jornada):
```css
.cs-fullbleed { width: 100vw; margin-inline: calc(50% - 50vw); }
.cs-fullbleed img { width: 100%; height: auto; display: block; }
```
**Aceite:** as fases do case ficam visualmente "chunked"; a jornada pode ocupar a largura total com respiro; nenhuma seção navy "espreme" contra a anterior.

#### D2 · Shortcode de citação em destaque (pull-quote)
**Arquivos:** `.eleventy.js` (novo shortcode `caseQuote`); `style.case-redesign.css`; uso pontual em `quantum-vizz.md`.
**Problema:** B7 — falta quebra de ritmo.
**Mudança:**
1. Novo shortcode:
```js
eleventyConfig.addShortcode("caseQuote", (text, cite = "") => `
<figure class="cs-quote" data-animate>
  <blockquote class="cs-quote__text">${text}</blockquote>
  ${cite ? `<figcaption class="cs-quote__cite">${cite}</figcaption>` : ""}
</figure>`);
```
2. CSS:
```css
.cs-quote { max-width: 900px; margin: clamp(48px,7vw,96px) auto; text-align: center; }
.cs-quote__text { font-weight: var(--fw-light); letter-spacing: -.03em;
  font-size: clamp(1.6rem, 3.4vw, 2.6rem); line-height: 1.18; }
.cs-dark .cs-quote__text { color: var(--color-neutral-050); }
.cs-quote__cite { margin-top: var(--space-4); font-size: .9rem; color: rgba(1,7,29,.55); }
```
3. **Uso (sem inventar copy):** promover a destaque **frases que já existem** no texto — ex.: *"O visitante veio buscar uma prova, não uma apresentação."* (já é o título dos Aprendizados) ou *"O canal funcionava."* (Encerramento). Inserir 1–2 `caseQuote` reaproveitando frases existentes, nunca criando novas afirmações.
**Aceite:** 1–2 citações grandes e centralizadas quebram o ritmo; funcionam em fundo claro e navy; texto é reaproveitado, não inventado.

---

### FASE E — Índice lateral fixo (sticky TOC + scroll-spy)

**Arquivos:** `.eleventy.js` (dar `id` às seções via `caseSection`); `case-study-md.njk` (montar a lista do TOC); novo `src/js/motion/case-toc.js` (+ incluir no `motion-scripts.njk`); `style.case-redesign.css`.
**Problema:** recurso pedido (estilo Lola Jiang).
**Mudança:**
1. **IDs nas seções:** estender o shortcode `caseSection` para gerar um `id` a partir do *kicker* (slug), e marcar a seção como item de TOC:
```js
// dentro de caseSection, antes do return:
const slug = String(kicker).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
  .replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
// <section class="${sectionClass}" id="sec-${slug}" data-cs-section data-cs-label="${kicker}">
```
Aplicar o mesmo a `objectiveBlock` (rótulo "Objetivo") para ele aparecer no índice.
2. **Markup do TOC** no `case-study-md.njk` (envolver `{{ content | safe }}` numa estrutura com aside + corpo), por ex.:
```njk
<div class="cs-layout">
  <aside class="cs-toc" aria-label="Índice do case"><nav><ul></ul></nav></aside>
  <div class="cs-layout__body">{{ content | safe }}</div>
</div>
```
3. **JS (`case-toc.js`)**: ao carregar, varrer `[data-cs-section]`, montar `<li><a href="#id">label</a></li>` no `.cs-toc ul`, e usar **IntersectionObserver** para marcar o item ativo (`.is-active`) conforme a seção entra na viewport. Respeitar `prefers-reduced-motion` (sem scroll suave forçado). Sem JS, o `<aside>` pode ficar oculto (o conteúdo continua acessível).
4. **CSS**: TOC fixo na **lateral esquerda** (gutter), some abaixo de ~1100 px (vira nada em tablet/mobile); itens em caixa-alta pequena, item ativo em navy/laranja.
```css
.cs-layout { display: grid; grid-template-columns: 220px minmax(0,1fr); gap: clamp(24px,4vw,64px);
  width: min(100%, var(--case-wide-container)); margin-inline: auto; }
.cs-toc { position: sticky; top: 120px; align-self: start; height: max-content; }
.cs-toc a { display: block; padding: 6px 0; font-size: .8rem; letter-spacing: .04em;
  text-transform: uppercase; color: rgba(1,7,29,.45); }
.cs-toc a.is-active { color: var(--color-brand-500); }
@media (max-width: 1100px){ .cs-layout{ grid-template-columns:1fr } .cs-toc{ display:none } }
```
> ⚠️ **Atenção ao conflito de largura:** hoje cada `caseSection` já tem seu próprio `.cs-container` centralizado. Ao embrulhar tudo no grid `.cs-layout`, ajuste para o corpo não centralizar duas vezes (ex.: dentro de `.cs-layout__body`, as `.cs-container` passam a `max-width:100%` e o alinhamento vem do grid). Teste com seções claras **e** navy full-bleed: blocos `cs-dark` que devem sangrar precisam escapar do grid (use o padrão `.cs-fullbleed` ou coloque os blocos full-bleed fora do `.cs-layout`).
> O menu flutuante ("Menu", `menu-flutuante.njk`) fica à **direita** — o TOC à esquerda não conflita. Confirme em tela.
**Aceite:** em ≥1100 px, índice fixo à esquerda acompanha o scroll e destaca a seção atual; clicar leva à seção; some em telas menores; conteúdo 100% acessível sem JS; nenhuma seção navy quebra o alinhamento.

---

### FASE F — Polimento final

- **F1 · Hero:** conferir respiro (espaço acima do `cs-hero__tag` e abaixo do "Publicado por") e que o título não encoste no menu em telas médias. Ajustar só espaçamento.
- **F2 · Overview (Serviços/Stack/Ano):** a faixa de metadados está esparsa; aproximar do padrão "label pequeno + valor" das referências (Moritz/Lola), garantindo alinhamento com a nova medida central.
- **F3 · Legendas:** unificar `.cs-figcaption` e as legendas das galerias/vídeos num mesmo estilo (tamanho, cor, posição). Uma única regra compartilhada.
- **F4 · Tabela de Impacto (`.cs-quantum-v2__table-wrap`):** conferir que respira igual aos outros blocos (margem via A2) e que rola bem no mobile (`overflow-x:auto`).
- **F5 · Revisar `data-animate`** nos novos blocos (galeria, citação, TOC) para entrarem no padrão de reveal já existente.

---

## 5. Replicação para os outros 6 cases

Ordem dos cases (do `README`): **Quantum Vizz → 2P Web Dev → Mercado das Figurinhas → Bit System → Farm Well Hub → Olho Vivo.**

### 5.1 O que já é automático
Tudo nas **Fases A, B, C(parcial), D, F** mexe em **CSS/shortcodes compartilhados** e em `<body class="case-redesign">`, que **todos** os cases usam. Ou seja, assim que essas fases entram, os 6 cases `.njk` **já herdam**: o novo ritmo vertical (A2), o acordeão sóbrio (B-1), o padrão de figura/legenda, as utilidades `.cs-gallery`/`.cs-quote`/`.cs-fullbleed`. **Antes de fechar cada PR de fase, abra os 6 cases e confira que nada regrediu** (especialmente os que têm grids próprios `cs-olho-*`, `cs-bit-*`, `cs-webdev-*`).

### 5.2 Migração de cada case para o formato `.md` (template do Quantum)
O objetivo final é que **cada case seja um `.md`** que usa `case-study-md.njk` + shortcodes, eliminando o HTML repetido dos `.njk`. Faça **um case por PR**, começando pelo **2P Web Dev** (segundo na ordem).

**Passo a passo por case:**
1. **Criar `src/projetos/<slug>.md`** com `layout: case-study-md.njk` e `permalink` **idêntico** ao atual (preserve a URL!).
2. **Migrar o frontmatter** a partir do `.njk` antigo, preenchendo os campos que o layout já entende: `projectName`, `heroTag`, `subtitle`, `summary[]` (Situação/Tarefa/Ação/Resultado), `metrics[]` (bignums), `learnings[]`, `roleGroups[]`, `projectNav`. **Copie os textos/números exatamente** — sem reescrever.
3. **Migrar o corpo** convertendo cada seção de HTML para `caseSection` + Markdown, e cada bloco visual para o shortcode equivalente (tabela abaixo).
4. **Migrar/renomear assets** se necessário e converter para WebP (mesma diretriz da C1).
5. **Apagar o `.njk` antigo** só depois de validar que a página nova está idêntica em conteúdo e melhor em layout (e que a URL não mudou).
6. **Aposentar as classes específicas** (`cs-olho-*` etc.) à medida que deixam de ser usadas — mas só remova do CSS quando nenhum case as referenciar (`grep`).

**Tabela de equivalência (HTML antigo → shortcode/classe do template):**

| No `.njk` antigo | Vira, no `.md` |
|---|---|
| `<section class="section"><div class="cs-container">… kicker + h2 + texto …` | `{% caseSection "Kicker", "Título", "section" %} …markdown… {% endcaseSection %}` |
| Seção em fundo escuro | `{% caseSection "Kicker", "Título", "section cs-dark", "dark" %}` |
| Bloco "Objetivo + gargalos" | `objectiveBlock` (frontmatter `bottlenecks[]`) |
| Stats inline (3 números) | `dataStats` (frontmatter) ou `caseMetrics` |
| Figura única com moldura | `caseFigure` |
| Galeria de imagens (`cs-*-media-grid`, `cs-*-screen-grid`) | `.cs-gallery--2`/`--3` (C2) |
| Antes/depois | `comparisonList` **ou** `caseFigure` no padrão novo |
| Citação | `caseQuote` (D2) |
| Acordeão "Resumo", bignums, learnings, papel, nav | **removidos do corpo** — agora vêm do `case-study-md.njk` via frontmatter |

### 5.3 QA por case migrado
- URL idêntica (diff de `sitemap.xml`), GTM/Schema intactos.
- Texto e números **conferem** com a versão antiga (diff de conteúdo renderizado).
- Sem colisões de espaçamento; galerias e citações no padrão; TOC monta a partir dos kickers.
- Lighthouse mobile ≥ 85; `prefers-reduced-motion` ok.

---

## 6. Checklist de aceite (rodar ao fim de cada fase/PR)

- [ ] `npm run build` sem erros; HTML válido.
- [ ] Nenhuma colisão de blocos no corpo (figura/lista/legenda têm respiro) — conferir *Processo* e *Solução*.
- [ ] Acordeão "Resumo" sem laranja sólido.
- [ ] Vídeos com poster (sem retângulo preto) e sem CLS.
- [ ] Persona/jornada em WebP, leves, legíveis e ampliáveis (lightbox + teclado).
- [ ] Medida de leitura ~720 px, conteúdo centralizado; mídia centralizada/full-bleed.
- [ ] Citação(ões) em destaque reaproveitando texto existente.
- [ ] TOC fixo funciona ≥1100 px, some abaixo, conteúdo acessível sem JS, sem conflito com o menu flutuante.
- [ ] `prefers-reduced-motion`: tudo estático e legível.
- [ ] URLs, GTM (GTM-K738G4S2), Schema, sitemap, robots intactos.
- [ ] Os **6 outros cases** abertos e sem regressão visual.
- [ ] Lighthouse mobile ≥ 85 / SEO/a11y best-effort.

---

## 7. Ordem de execução sugerida (PRs)

1. **PR 1 — Fundação + bugs (Fases A e B).** Maior impacto, menor risco. Já melhora os 6 cases.
2. **PR 2 — Mídia (Fase C).** Otimização de assets + componente `.cs-gallery` + zoom.
3. **PR 3 — Ritmo (Fase D).** Full-bleed + `caseQuote`.
4. **PR 4 — TOC (Fase E).** Componente novo isolado (atenção ao conflito de largura).
5. **PR 5 — Polimento (Fase F).**
6. **PR 6+ — Migração dos cases (Seção 5),** um case por PR, na ordem do README a partir do 2P Web Dev.

*Gerado a partir da análise da página atual (`/projetos/quantum-vizz/`), do código do repo e das 4 referências indicadas pelo Floriano. Layout dos cases manda aqui; conteúdo/posicionamento mandam no README e no PLANO-REDESIGN.md.*
