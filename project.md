# floriano.des.br - Portfólio de Design Engineering

**Site:** https://floriano.des.br  
**Autor:** Floriano Silva  
**Tipo:** Portfólio pessoal + blog  
**Status:** Em produção ativa

Portfólio de Design Engineer com foco em estratégia, design, dados, IA, Growth, CRO e execução. Apresenta cases de sites, LPs, sistemas e pesquisa, artigos publicados no Medium e informações sobre trajetória profissional. Construído com foco em performance, acessibilidade e SEO - sem frameworks pesados, sem CMS.

---

## Stack resumida

| Tecnologia | Versão | Uso |
|---|---|---|
| [Eleventy (11ty)](https://www.11ty.dev/) | ^3.1.5 | Gerador de site estático |
| Nunjucks | - | Template engine |
| CSS Puro | - | Estilização (sem Tailwind/Bootstrap) |
| JavaScript Vanilla | - | Interatividade (sem React/Vue) |
| Node.js | 20 | Runtime de build |
| Rimraf | ^6.0.1 | Limpeza de `_site/` antes do build |
| GitHub Actions | - | CI/CD automatizado |
| Hostinger | - | Hospedagem via branch `deploy` |
| Google Tag Manager | GTM-K738G4S2 | Analytics |
| Hotjar | - | Heatmaps e análise de comportamento |
| GTranslate Widget | - | Seletor de idioma PT/EN |

---

## Visão Geral

### Propósito
O portfólio tem dois objetivos: mostrar trabalhos de Design Engineering e o processo por trás de cada decisão. Não é uma galeria de telas - é uma coleção de narrativas que documentam problemas reais, escolhas feitas e resultados obtidos.

### Público-alvo
- Recrutadores e contratantes buscando um Design Engineer
- Times e empresas avaliando fit cultural e técnico
- Profissionais de design buscando referências de processo

### Pilares de qualidade
1. **Editorial forte** - cada case é uma história, não um template
2. **Performance** - ~200 KB total de assets (CSS + JS + imagens otimizadas)
3. **Acessibilidade** - WCAG AA, navegação por teclado, ARIA labels
4. **SEO técnico** - JSON-LD em 3 camadas, Open Graph, sitemaps

---

## Estrutura de Pastas

```
floriano-des-br/
│
├── src/                              # Código-fonte - tudo que entra no build
│   │
│   ├── _data/                        # Dados globais acessíveis em todos os templates
│   │   ├── metadata.json             # Metadados do site (autor, URL, email, expertise)
│   │   ├── reflexoes.js              # Fetcher dinâmico do feed RSS do Medium
│   │   └── reflexoes-fallback.json   # Cache local usado quando o Medium falha
│   │
│   ├── _includes/                    # Layouts e partials reutilizáveis
│   │   ├── layouts/
│   │   │   ├── base.njk              # Layout base (html, head, nav, footer)
│   │   │   └── case-study.njk        # Layout para cases (CSS extra + Schema CreativeWork)
│   │   └── partials/
│   │       ├── nav.njk               # Navbar responsiva com hamburger mobile
│   │       ├── footer.njk            # Rodapé com CTA de contato
│   │       └── structured-data.njk   # Schema.org base (Person, Website)
│   │
│   ├── css/                          # Estilos modulares (~6.5 KB total)
│   │   ├── reset.css                 # Reset minimalista
│   │   ├── style.tokens.css          # Design tokens: cores, tipografia, espaçamentos
│   │   ├── style.nav.css             # Estilos da navbar
│   │   ├── style.home.css            # Seções da home
│   │   ├── style.content.css         # Styling de conteúdo genérico
│   │   ├── style.footer-motion.css   # Animações do footer
│   │   ├── style.pages.css           # Páginas internas
│   │   ├── style.responsive.css      # Media queries
│   │   ├── case-study.core.css       # Estrutura base dos cases (.cs-hero, .cs-summary)
│   │   ├── case-study.projects.css   # Estilos específicos por projeto
│   │   └── case-study.extras.css     # Utilitários adicionais para cases
│   │
│   ├── js/
│   │   └── main.js                   # JS vanilla (~215 linhas): nav, carrossel, animações
│   │
│   ├── assets/                       # Mídia pública
│   │   ├── projetos/                 # Screenshots dos cases
│   │   ├── exploracoes/              # Galeria de interfaces (carrossel)
│   │   ├── clients/                  # Avatares dos depoimentos
│   │   ├── design-grafico/           # Portfólio de design visual
│   │   ├── flags/                    # Bandeiras (brasil, ireland, usa)
│   │   ├── sites/                    # Screenshots de sites em produção
│   │   └── sobre/                    # Fotos pessoais para a página Sobre
│   │
│   ├── projetos/                     # Case studies - 1 arquivo .njk por projeto
│   │   ├── quantum-vizz.njk          # +194% conversão (Growth / CRO)
│   │   ├── 2p-web-dev.njk            # Produto interno com login e controle
│   │   ├── bit-system.njk            # Design system para escalabilidade
│   │   ├── mercado-das-figurinhas.njk # Produto geolocalizado
│   │   ├── farm-well-hub.njk         # Plataforma com foco em acessibilidade
│   │   ├── olho-vivo.njk             # Pesquisa sobre participação política
│   │   └── design-grafico.njk        # Portfólio de design gráfico
│   │
│   ├── index.njk                     # Home
│   ├── projetos.njk                  # Listagem de projetos
│   ├── reflexoes.njk                 # Listagem de artigos (blog)
│   ├── reflexao.njk                  # Template de post individual (gerado via pagination)
│   ├── sobre.njk                     # Página Sobre
│   ├── llms.njk                      # Página de contexto para LLMs/IAs
│   ├── 404.njk                       # Página de erro customizada
│   ├── politica-de-privacidade.njk   # Política de privacidade
│   ├── sitemap.njk                   # Sitemap XML
│   ├── robots.njk                    # robots.txt
│   └── .htaccess                     # Configurações Apache (redirects, cache headers)
│
├── deprecated/                       # Arquivo morto (não entra no build, ignorado no git)
│   ├── assets/                       # Imagens sem referência ativa
│   ├── exports/                      # Exportações antigas mantidas por segurança
│   ├── notes/                        # Notas soltas
│   └── references/                   # HTMLs de referência
│
├── docs/                             # Material interno (não entra no build)
│   └── projetos/                     # Documentação de projetos específicos
│
├── _site/                            # Output gerado pelo Eleventy (não versionado)
│
├── .github/workflows/
│   └── deploy-hostinger.yml          # Pipeline de CI/CD
│
├── .eleventy.js                      # Configuração principal do Eleventy
├── .eleventyignore                   # Pastas ignoradas no build
├── .gitignore                        # Ignora: node_modules, _site, deprecated, docs
├── .editorconfig                     # Configurações de editor
├── package.json                      # Dependências e scripts
├── README.md                         # Documentação básica
└── PROJECT_STRUCTURE.md              # Documentação de estrutura (legado)
```

---

## Sistema de Build

### `.eleventy.js` - Configuração principal

O arquivo de configuração do Eleventy tem 4 responsabilidades:

#### 1. Filtros Nunjucks customizados

| Filtro | Assinatura | O que faz |
|---|---|---|
| `limit` | `array \| limit(n)` | Limita um array a N itens (ex: "3 reflexões na home") |
| `json` | `obj \| json` | Serializa para JSON escapando caracteres perigosos |
| `breadcrumbs` | `url \| breadcrumbs(title)` | Gera schema BreadcrumbList a partir da URL atual |
| `dateToIso` | `date \| dateToIso` | Converte data para ISO 8601 |
| `assetVersion` | `path \| assetVersion` | Cria hash MD5 (10 chars) do arquivo para cache busting |

O filtro `assetVersion` garante que se o CSS ou JS mudar, o browser faz novo download. Se não mudar, o cache é aproveitado - sem query strings manuais.

#### 2. Coleção: `sitemapPages`

Coleta todas as páginas HTML geradas (exceto sitemaps e 404) e adiciona `lastmod` automático baseado na data de modificação do arquivo de origem. Usado pelo template `sitemap.njk`.

#### 3. Pass-through Copy

Copia diretamente para `_site/` sem processar:
```
src/css      → _site/css
src/js       → _site/js
src/assets   → _site/assets
src/.htaccess → _site/.htaccess
```

#### 4. Watch targets

Em modo `dev`, monitora alterações em `src/css/**`, `src/js/**` e `src/assets/**` para recarregar automaticamente.

#### Configuração de diretórios

```javascript
return {
  dir: {
    input: "src",
    output: "_site",
    includes: "_includes",
    data: "_data",
    layouts: "_includes/layouts"
  },
  templateFormats: ["njk", "html"],
  htmlTemplateEngine: "njk"
}
```

### Scripts npm

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "rimraf _site && eleventy"
  }
}
```

| Script | Comando | O que faz |
|---|---|---|
| `dev` | `npm run dev` | Servidor local (porta 8080) com hot reload |
| `build` | `npm run build` | Limpa `_site/` e reconstrói para produção |

---

## Deploy

### Fluxo completo

```
Push em main
  ↓
GitHub Actions dispara
  ↓
Checkout + Node.js 20 setup
  ↓
npm ci
  ↓
npm run build
  - rimraf _site/
  - Eleventy processa src/
  - Fetch do Medium (ou fallback JSON)
  - Gera _site/
  ↓
Git commit de _site/ na branch `deploy`
  ↓
Push para origin/deploy
  ↓
Hostinger publica a branch deploy
  ↓
floriano.des.br ao vivo (~2–5s de build total)
```

### Triggers do workflow

| Trigger | Quando |
|---|---|
| Push em `main` | A cada commit no branch principal |
| `workflow_dispatch` | Manualmente via GitHub UI |
| Schedule | A cada 6 horas - para puxar novos artigos do Medium |

O schedule de 6 horas garante que artigos novos publicados no Medium aparecem no portfólio sem precisar de um commit manual.

---

## Sistema de Reflexões (Blog do Medium)

O blog não usa CMS nem banco de dados. Os artigos vivem no Medium e são importados automaticamente no build.

### Fluxo

```
src/_data/reflexoes.js executa durante o build
  ↓
Fetch do feed RSS: https://medium.com/feed/@floriano-des
  ↓
Parser customizado extrai cada <item> do XML
  ↓
Normalização: slug, excerpt, thumbnail, data pt-BR
  ↓
Sanitização HTML (whitelist de tags seguras)
  ↓
Dados disponíveis como reflexoes.items em todos os templates
  ↓
reflexao.njk usa pagination para gerar 1 página por item
  ↓
URLs: /reflexoes/titulo-do-artigo/
```

### Fallback

Se o fetch falhar (timeout de 5s, Medium fora, build offline), o sistema usa `src/_data/reflexoes-fallback.json` - uma cópia local dos últimos artigos. O site nunca fica sem conteúdo de blog.

### Estrutura de cada item

```javascript
{
  title: "Título do artigo",
  link: "https://medium.com/...",          // URL original no Medium
  slug: "titulo-do-artigo",                // Gerado a partir da URL
  url: "/reflexoes/titulo-do-artigo/",     // URL local no portfólio
  excerpt: "Primeiros 160 caracteres...",  // Para cards e meta description
  thumbnail: "https://cdn-images-...",     // Primeira imagem do artigo
  dateDisplay: "16 de abril de 2026",      // Formatado em pt-BR
  dateAttr: "2026-04-16",                  // Para <time datetime="...">
  dateIso: "2026-04-16T10:00:00.000Z",     // Para JSON-LD
  contentHtml: "<p>Conteúdo sanitizado</p>", // HTML limpo para renderizar
  jsonLd: "{...}"                           // Schema BlogPosting para SEO
}
```

### Tags permitidas na sanitização

`a`, `blockquote`, `br`, `code`, `em`, `figcaption`, `figure`, `h2`, `h3`, `h4`, `hr`, `img`, `li`, `ol`, `p`, `pre`, `strong`, `ul`

Scripts, styles, iframes e forms são removidos automaticamente. A imagem de tracking do Medium (`medium.com/_/stat`) também é removida.

### Geração de páginas individuais

`src/reflexao.njk` usa o sistema de pagination do Eleventy:

```yaml
---
pagination:
  data: reflexoes.items
  size: 1
  alias: post
permalink: "{{ post.url }}"
layout: base.njk
---
```

Cada artigo do Medium gera uma página estática em `/reflexoes/[slug]/`.

### SEO das reflexões

- **Open Graph:** `og:type="article"`, `og:image` com thumbnail
- **JSON-LD BlogPosting:** inclui `isBasedOn` apontando para o Medium (canonical correto)
- **Canonical:** aponta para a URL local do portfólio

---

## Projetos / Case Studies

### Filosofia

Cada case é um arquivo `.njk` independente com conteúdo hardcoded - não usa arquivos de dados ou CMS. Isso é intencional: cases são storytelling editorial, cada um com ritmo e estrutura próprios. Versionar mudanças no Git é suficiente.

### Seções padrão de um case

```
1. Hero (.cs-hero)
   - Tags de contexto (ex: "crescimento · CRO · conversão")
   - Título e subtítulo
   - Publicado por (avatar + nome)

2. Resumo retrátil (.cs-summary)
   - <details> HTML nativo (acessível por padrão)
   - Situação / Tarefa / Ação / Resultado
   - Colapsado por padrão para não sobrecarregar

3. Big numbers (.cs-bignums)
   - Até 3 métricas principais com ícone SVG
   - Ex: "+194% de aumento na conversão"

4. Corpo editorial
   - Imagens full-width com legendas
   - Texto com hierarquia clara
   - Tabelas de dados quando necessário
   - Citações de usuários em destaque

5. CTA final
   - Link para outros projetos
   - Link para contato
```

### Cases disponíveis

| Arquivo | URL | Tema |
|---|---|---|
| `quantum-vizz.njk` | `/projetos/quantum-vizz/` | +194% conversão via Growth/CRO |
| `2p-web-dev.njk` | `/projetos/2p-web-dev/` | Produto interno com login e controle |
| `bit-system.njk` | `/projetos/bit-system/` | Design system para escalabilidade |
| `mercado-das-figurinhas.njk` | `/projetos/mercado-das-figurinhas/` | Produto geolocalizado |
| `farm-well-hub.njk` | `/projetos/farm-well-hub/` | Plataforma com foco em acessibilidade |
| `olho-vivo.njk` | `/projetos/olho-vivo/` | Pesquisa sobre participação política |
| `design-grafico.njk` | `/projetos/design-grafico/` | Portfólio de design visual |

### Layout de case vs. layout base

`case-study.njk` extende `base.njk` e adiciona:
- Três arquivos CSS extras (`case-study.core.css`, `case-study.projects.css`, `case-study.extras.css`)
- Schema JSON-LD do tipo `CreativeWork`

---

## Páginas do Site

| URL | Arquivo | Layout | Conteúdo |
|---|---|---|---|
| `/` | `index.njk` | `base.njk` | Hero, stats, 6 projetos em destaque, depoimentos, mini-sobre, 3 reflexões |
| `/projetos/` | `projetos.njk` | `base.njk` | 6 cases principais, sites em produção, 8+ explorações (carrossel), design gráfico |
| `/projetos/quantum-vizz/` | `projetos/quantum-vizz.njk` | `case-study.njk` | Case completo |
| `/projetos/bit-system/` | `projetos/bit-system.njk` | `case-study.njk` | Case completo |
| `/projetos/2p-web-dev/` | `projetos/2p-web-dev.njk` | `case-study.njk` | Case completo |
| `/projetos/mercado-das-figurinhas/` | `projetos/mercado-das-figurinhas.njk` | `case-study.njk` | Case completo |
| `/projetos/farm-well-hub/` | `projetos/farm-well-hub.njk` | `case-study.njk` | Case completo |
| `/projetos/olho-vivo/` | `projetos/olho-vivo.njk` | `case-study.njk` | Case completo |
| `/projetos/design-grafico/` | `projetos/design-grafico.njk` | `case-study.njk` | Portfólio visual |
| `/reflexoes/` | `reflexoes.njk` | `base.njk` | Grid de cards com artigos do Medium |
| `/reflexoes/[slug]/` | `reflexao.njk` | `base.njk` | Artigo completo (gerado por pagination) |
| `/sobre/` | `sobre.njk` | `base.njk` | Bio, trajetória, jeito de trabalhar, stack, vida pessoal |
| `/llms/` | `llms.njk` | `base.njk` | Página de contexto para IAs que consultam o site |
| `/politica-de-privacidade/` | `politica-de-privacidade.njk` | `base.njk` | Política de privacidade |
| `/sitemap.xml` | `sitemap.njk` | - | Sitemap XML |
| `/robots.txt` | `robots.njk` | - | robots.txt |
| `/404.html` | `404.njk` | - | Erro 404 customizado |

---

## Design System (CSS)

### Tokens principais (`style.tokens.css`)

**Cores:**
```css
--color-brand: #ee782e;         /* Laranja primário */
--color-dark: #01071d;          /* Fundo escuro / texto principal */
--color-gray-light: #f7f7f7;    /* Fundo claro */
--color-gray-mid: #ececec;      /* Bordas e divisores */
--color-gray-text: #6b7280;     /* Texto secundário */
--color-linkedin: #0077b5;
--color-whatsapp: #25d366;
```

**Tipografia:**
- Fonte única: **Montserrat** (Google Fonts, weights 300–700)
- Tamanhos responsivos via `clamp()`:

```css
--text-xs:   clamp(0.75rem, 1vw, 0.875rem);
--text-sm:   clamp(0.875rem, 1.2vw, 1rem);
--text-base: 1rem;
```

O `clamp()` permite tipografia fluida sem breakpoints explícitos - o tamanho varia suavemente entre o mínimo e o máximo conforme a viewport.

### Arquivos CSS e responsabilidades

| Arquivo | Responsabilidade |
|---|---|
| `reset.css` | Reset minimalista |
| `style.tokens.css` | Variáveis globais (cores, tipografia, espaçamentos) |
| `style.nav.css` | Navbar, hamburger mobile, seletor de idioma |
| `style.home.css` | Seções da home (hero, stats, cards, depoimentos) |
| `style.content.css` | Tipografia e layout para conteúdo editorial |
| `style.footer-motion.css` | Animações do footer |
| `style.pages.css` | Páginas internas (reflexões, sobre, etc.) |
| `style.responsive.css` | Media queries (breakpoint principal: 768px) |
| `case-study.core.css` | Estrutura base dos cases (766 linhas) |
| `case-study.projects.css` | Estilos específicos por projeto (1831 linhas) |
| `case-study.extras.css` | Utilitários adicionais (99 linhas) |

### Animações com Intersection Observer

Qualquer elemento com o atributo `data-animate` recebe fade-in + slideUp ao entrar na viewport:

```javascript
var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
```

O atributo `data-delay="1"` (ou `"2"`, `"3"`) adiciona stagger de 0.2s por item - útil para animar listas de cards sequencialmente.

### Carrossel vanilla

```javascript
initCarousel(trackEl, prevBtn, nextBtn, dotsContainer, 'multi' | 'full')
```

Dois modos:
- **`multi`** - 2 itens por linha (desktop), 1 item (mobile), navegação por setas e dots
- **`full`** - 1 item por vez em tela inteira

100% vanilla JS, sem Swiper ou bibliotecas. Recalcula `perView` no resize automaticamente.

---

## SEO e Metadados

### 3 camadas de dados estruturados

**Camada 1 - HTML meta tags**
```html
<title>{{ title }}</title>
<meta name="description" content="{{ description }}">
<link rel="canonical" href="{{ baseUrl }}{{ page.url }}">
```

**Camada 2 - Open Graph**
```html
<meta property="og:type" content="article | website">
<meta property="og:image" content="{{ ogImage }}">
<meta property="og:title" content="{{ title }}">
<meta property="article:published_time" content="{{ dateIso }}">
```

**Camada 3 - JSON-LD Schema.org**

| Tipo de página | Schema type |
|---|---|
| Home | `ProfilePage` + `Person` + `WebSite` |
| Case study | `CreativeWork` + `BreadcrumbList` |
| Reflexão individual | `BlogPosting` + `BreadcrumbList` |
| Listagens | `BreadcrumbList` |

### Cache busting via hash MD5

```nunjucks
<link rel="stylesheet" href="/css/style.tokens.css?v={{ '/css/style.tokens.css' | assetVersion }}">
```

O filtro `assetVersion` calcula um hash MD5 de 10 caracteres do arquivo. Se o arquivo mudar, o hash muda e o browser faz novo download. Se não mudar, o cache é aproveitado - nenhuma invalidação desnecessária.

### Breadcrumbs automáticos

O filtro `breadcrumbs` gera o schema a partir da URL atual:

```
/projetos/quantum-vizz/ →
[
  { "name": "Início", "item": "/" },
  { "name": "Projetos", "item": "/projetos/" },
  { "name": "Quantum Vizz", "item": "/projetos/quantum-vizz/" }
]
```

### Sitemaps

- `sitemap.njk` gera sitemap XML com todos os paths + `lastmod` automático
- `robots.njk` gera `robots.txt` apontando para o sitemap

---

## Performance e Acessibilidade

### Performance

- **Assets totais:** ~200 KB (CSS + JS, sem contar imagens)
- Imagens com `loading="lazy"` abaixo do fold
- Hero images com `fetchpriority="high"`
- Formato WebP nos assets principais, JPG como fallback
- CSS inline crítico não é necessário (CSS já é pequeno o suficiente)
- JS sem dependências externas (sem npm packages no frontend)

### Acessibilidade

- WCAG AA - contraste revisado manualmente em todas as combinações
- `<details>` nativo nos resumos dos cases (acessível sem JS)
- Mobile menu com keyboard trap e gerenciamento de focus
- ARIA labels em ícones e botões sem texto visível
- Navegação por teclado em carrosséis (setas do teclado)

---

## Detalhes não óbvios

### Mobile menu com keyboard trap

O menu mobile fecha com `Escape`, click fora ou foco saindo da área. O focus fica preso dentro do menu enquanto ele está aberto.

### Last-modified automático no sitemap

```javascript
if (!item.data.lastmod && item.inputPath) {
  const stats = fs.statSync(item.inputPath);
  item.data.lastmod = stats.mtime;
}
```

Cada página do sitemap tem `lastmod` baseado na data real de modificação do arquivo fonte - sem precisar declarar manualmente.

### Dados do Medium nunca causam build failure

```javascript
try {
  // fetch com timeout de 5s
} catch (err) {
  console.warn(`[reflexoes] Falha ao buscar feed: ${err.message}`);
  return fallback;  // usa reflexoes-fallback.json
}
```

Se o Medium estiver fora no momento do build, o site constrói normalmente com o conteúdo em cache.

### Seletor de idioma PT/EN

GTranslate Widget integrado na navbar. Exibe bandeiras e permite alternar entre português e inglês sem rebuild - a tradução é feita no cliente.

### Navbar com scroll effect

A navbar muda de estilo ao rolar (transparente → sólida). Implementado com `scroll` event listener e debounce implícito via frame rate do browser.

---

## Metadados globais (`src/_data/metadata.json`)

Disponível em todos os templates como `{{ metadata.* }}`.

```json
{
  "url": "https://floriano.des.br",
  "title": "Floriano Silva, Design Engineer UX",
  "description": "Design Engineer especializado em UX orientado a dados",
  "author": "Floriano Silva",
  "profession": "Design Engineer",
  "email": "contato@floriano.des.br",
  "phone": "+55 18 99677-3264",
  "location": "Brasil",
  "areasOfExpertise": [
    "Design Engineering", "UX Design", "Growth", "CRO",
    "Analytics", "Pesquisa de UX", "Design de interface", "Design system"
  ],
  "sameAs": [
    "https://www.linkedin.com/in/floriano-des/",
    "https://medium.com/@floriano-des"
  ]
}
```

---

## Arquivos-chave

| Arquivo | Linhas | Responsabilidade |
|---|---|---|
| `.eleventy.js` | ~161 | Toda a configuração do SSG (filtros, coleções, dirs) |
| `src/_data/reflexoes.js` | ~412 | Fetch RSS, parse, sanitização e fallback do Medium |
| `src/_data/reflexoes-fallback.json` | ~92 | Cache local dos artigos do Medium |
| `src/_data/metadata.json` | 26 | Dados globais do site |
| `src/js/main.js` | ~215 | Nav, carrossel, animações (Vanilla JS) |
| `src/_includes/layouts/base.njk` | ~76 | Layout padrão com GTM, meta tags, CSS, nav, footer |
| `src/_includes/layouts/case-study.njk` | ~100 | Layout de cases com CSS extra e Schema CreativeWork |
| `src/css/case-study.projects.css` | ~1831 | Maior arquivo CSS - estilos específicos por projeto |
| `src/css/case-study.core.css` | ~766 | Estrutura base dos cases |
| `src/index.njk` | ~361 | Home completa |
| `src/projetos.njk` | ~375 | Página de projetos com carrosséis |
| `.github/workflows/deploy-hostinger.yml` | - | Pipeline de CI/CD |

