# README - Contexto do projeto floriano.des.br

Este arquivo descreve quem é Floriano, qual é o posicionamento do site, como o projeto está estruturado e como o site funciona tecnicamente. É lido por Claude Code e Codex em todas as sessões.

---

## Quem é Floriano

**Floriano Silva** é um **Designer de experiências digitais** com mais de 8 anos de experiência construindo produtos, sites e experiências digitais. Seu diferencial não está em apenas executar, está em entender o problema de negócio a fundo, estruturar a solução correta e desenvolver a experiência funcional adequada.

Ele atua entre negócio, experiência e tecnologia. O repertório cobre UX, estratégia de produto, marketing digital, growth, CRO, analytics, dados, desenvolvimento web e IA aplicada. Não é especialista absoluto em tudo, é um profissional com escuta, leitura de contexto e capacidade de conectar áreas para chegar na solução certa.

A IA faz parte do método de trabalho, não da identidade. Ela aparece como apoio para desenvolvimento, prototipação e entrega.

**Site:** https://floriano.des.br
**Contato:** contato@floriano.des.br

---

## Posicionamento e tom de voz

- O título principal é exatamente: **Designer de experiências digitais**. Não usar o posicionamento antigo como título público.
- O site comunica: entendimento do problema, estruturação da solução e construção da experiência digital funcional.
- Design é uma ferramenta, não a identidade. Não posicionar Floriano como "designer que também programa".
- Tom: direto, estratégico, humano. Sem jargões vazios, sem exageros, sem corporativês.
- O texto soa como alguém que pensa, estrutura e executa, não como consultor que só analisa, nem como alguém que só codifica.

**Escopo protegido, nunca alterar:**
- Conteúdo interno dos cases/projetos (`src/projetos/*.njk`)
- Posts, reflexões e artigos
- Métricas, resultados e números dos projetos

**Decisões editoriais consolidadas:**
- A página `/projetos/` foi removida. Era réplica da home. O nav "Portfólio" aponta para `/#projetos`.
- A home agora prioriza serviços, IA no processo e portfólio comercial para clientes diretos.
- A seção de design gráfico foi movida para a página Sobre (link discreto na trajetória).
- Ordem dos projetos na home: Quantum Vizz, 2P Web Dev, Mercado das Figurinhas, Bit System, Farm Well Hub e Olho Vivo.

---

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Eleventy (11ty) | ^3.1.5 | Gerador de site estático |
| Nunjucks | n/a | Template engine |
| CSS Puro | n/a | Estilização (sem Tailwind/Bootstrap) |
| JavaScript Vanilla | n/a | Interatividade (sem React/Vue) |
| Node.js | 20 | Runtime de build |
| Rimraf | ^6.0.1 | Limpeza de `_site/` antes do build |
| GitHub Actions | — | CI/CD automatizado |
| Hostinger | — | Hospedagem via branch `deploy` |
| Google Tag Manager | GTM-K738G4S2 | Analytics |
| GTranslate Widget | — | Seletor de idioma PT/EN |

---

## Estrutura de pastas

```
floriano-des-br/
│
├── src/                              # Código-fonte — tudo que entra no build
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
│   │       └── structured-data.njk   # Schema.org base (Person, WebSite)
│   │
│   ├── css/                          # Estilos modulares
│   │   ├── reset.css
│   │   ├── style.tokens.css          # Design tokens: cores, tipografia, espaçamentos
│   │   ├── style.nav.css
│   │   ├── style.home.css
│   │   ├── style.content.css
│   │   ├── style.footer-motion.css
│   │   ├── style.pages.css
│   │   ├── style.responsive.css
│   │   ├── case-study.core.css
│   │   ├── case-study.projects.css
│   │   └── case-study.extras.css
│   │
│   ├── js/
│   │   └── main.js                   # Vanilla JS: nav, carrossel, animações (~215 linhas)
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
│   ├── projetos/                     # Case studies — 1 arquivo .njk por projeto
│   │   ├── quantum-vizz.njk          # +194% conversão (Growth / CRO)
│   │   ├── 2p-web-dev.njk            # Produto interno com login e controle
│   │   ├── bit-system.njk            # Design system para escalabilidade
│   │   ├── mercado-das-figurinhas.njk
│   │   ├── farm-well-hub.njk         # Plataforma com foco em acessibilidade
│   │   ├── olho-vivo.njk             # Pesquisa sobre participação política
│   │   └── design-grafico.njk        # Portfólio de design visual
│   │
│   ├── index.njk                     # Home (hero, stats, 6 projetos, depoimentos, sobre, reflexões)
│   ├── reflexoes.njk                 # Listagem de artigos (blog)
│   ├── reflexao.njk                  # Template de post individual (pagination)
│   ├── sobre.njk                     # Página Sobre
│   ├── llms.njk                      # Contexto para LLMs/IAs (gera /llms.txt)
│   ├── 404.njk
│   ├── politica-de-privacidade.njk
│   ├── sitemap.njk                   # Sitemap XML
│   └── robots.njk
│
├── deprecated/                       # Arquivo morto (não entra no build)
├── docs/                             # Material interno (não entra no build)
├── _site/                            # Output gerado pelo Eleventy (não versionado)
├── .github/workflows/deploy-hostinger.yml
├── .eleventy.js                      # Configuração principal do Eleventy
├── package.json
├── README.md
└── README.md                         # Este arquivo
```

---

## Sistema de build

### `.eleventy.js` — filtros customizados

| Filtro | O que faz |
|---|---|
| `limit` | Limita um array a N itens |
| `json` | Serializa para JSON escapando caracteres perigosos |
| `breadcrumbs` | Gera BreadcrumbList a partir da URL atual |
| `dateToIso` | Converte data para ISO 8601 |
| `assetVersion` | Hash MD5 de 10 chars do arquivo para cache busting |

### Scripts npm

```bash
npm run dev    # Servidor local (porta 8080) com hot reload
npm run build  # Limpa _site/ e reconstrói para produção
```

---

## Deploy

```
Push em main
  ↓
GitHub Actions dispara
  ↓
npm ci → npm run build
  ↓
Commit de _site/ na branch deploy
  ↓
Hostinger publica a branch deploy
  ↓
floriano.des.br ao vivo (~2–5s de build total)
```

**Triggers do workflow:**
- Push em `main`
- `workflow_dispatch` (manual via GitHub UI)
- Schedule a cada 6 horas (para puxar novos artigos do Medium)

---

## Sistema de Reflexões (blog via Medium)

Os artigos vivem no Medium e são importados automaticamente no build via RSS.

```
src/_data/reflexoes.js
  ↓ fetch RSS: https://medium.com/feed/@floriano-des
  ↓ parse + normalização (slug, excerpt, thumbnail, data pt-BR)
  ↓ sanitização HTML
  ↓ dados disponíveis como reflexoes.items em todos os templates
  ↓ reflexao.njk gera 1 página por item via pagination
  ↓ URLs: /reflexoes/titulo-do-artigo/
```

Se o fetch falhar, usa `reflexoes-fallback.json` como cache local. O build nunca quebra por causa do Medium.

---

## Páginas do site

| URL | Arquivo | Conteúdo |
|---|---|---|
| `/` | `index.njk` | Hero, stats, 6 projetos em destaque, depoimentos, mini-sobre, 3 reflexões |
| `/projetos/[slug]/` | `projetos/*.njk` | Case study completo |
| `/reflexoes/` | `reflexoes.njk` | Grid de cards com artigos do Medium |
| `/reflexoes/[slug]/` | `reflexao.njk` | Artigo individual (gerado por pagination) |
| `/sobre/` | `sobre.njk` | Bio, trajetória (com link para design gráfico), jeito de trabalhar, stack, vida pessoal |
| `/projetos/design-grafico/` | `projetos/design-grafico.njk` | Repertório gráfico — acessível via link no Sobre |
| `/llms.txt` | `llms.njk` | Contexto para IAs que consultam o site |
| `/politica-de-privacidade/` | `politica-de-privacidade.njk` | Política de privacidade |

---

## Design system (CSS)

### Tokens principais (`style.tokens.css`)

```css
--color-brand: #ee782e;      /* Laranja primário */
--color-dark:  #01071d;      /* Fundo escuro / texto principal */
```

Fonte única: **Montserrat** (Google Fonts, weights 300–700). Tamanhos via `clamp()` — tipografia fluida sem breakpoints explícitos.

### Animações

Qualquer elemento com `data-animate` recebe fade-in + slideUp ao entrar na viewport (Intersection Observer). `data-delay="1"` (ou `"2"`, `"3"`) adiciona stagger de 0.2s por item.

### Carrossel vanilla

```javascript
initCarousel(trackEl, prevBtn, nextBtn, dotsContainer, 'multi' | 'full')
```

Dois modos: `multi` (2 itens/desktop, 1/mobile) e `full` (1 item por vez). 100% Vanilla JS, sem Swiper.

---

## SEO e metadados

Três camadas: meta tags HTML → Open Graph → JSON-LD Schema.org.

| Tipo de página | Schema type |
|---|---|
| Home / Sobre | `ProfilePage` + `Person` + `WebSite` |
| Case study | `CreativeWork` + `BreadcrumbList` |
| Reflexão individual | `BlogPosting` + `BreadcrumbList` |

Cache busting via hash MD5: `?v={{ '/css/file.css' | assetVersion }}` — o browser só faz novo download se o arquivo mudou.

---

## Metadados globais (`src/_data/metadata.json`)

Disponível em todos os templates como `{{ metadata.* }}`. É a fonte de verdade para título, descrição, profissão e áreas de expertise do site.

```json
{
  "title": "Floriano Silva | Designer de experiências digitais",
  "description": "Crio produtos, sites e experiências digitais que unem UX, estratégia, dados, marketing e tecnologia para resolver problemas de negócio com clareza e resultado.",
  "profession": "Designer de experiências digitais",
  "siteName": "Floriano Silva · Designer de experiências digitais"
}
```

---

## Detalhes não óbvios

- **Mobile menu:** fecha com `Escape`, click fora ou foco saindo da área. Keyboard trap enquanto aberto.
- **`lastmod` automático no sitemap:** calculado via `fs.statSync` do arquivo fonte — sem declaração manual.
- **Medium nunca causa build failure:** try/catch com timeout de 5s e fallback para JSON local.
- **Seletor de idioma:** GTranslate Widget na navbar — tradução feita no cliente, sem rebuild.
- **Navbar:** muda de estilo ao rolar (transparente → sólida) via scroll event listener.
- **Cases são hardcoded:** cada `projetos/*.njk` tem conteúdo fixo — sem CMS, sem arquivos de dados. Intencional: cada case é storytelling editorial com ritmo próprio.
