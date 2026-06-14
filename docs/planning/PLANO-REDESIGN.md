# Plano de Redesign — floriano.des.br

> **Referência visual:** dennissnellenberg.com (Awwwards SOTD). Estratégia: adotar a *linguagem de interação* (curvas, transições, hovers, scroll), nunca a *expressão* (cores, tipografia, textos, formas exatas). Este documento é a spec para Claude Code e Codex.
>
> **Decisões já tomadas pelo Floriano:**
> 1. Identidade mantida: laranja `#ee782e` + navy `#01071d` + Montserrat. O laranja assume o papel que o azul #455CE9 tem no site de referência (cor única de acento).
> 2. Home enxuta no estilo da referência (seções atuais migram ou somem — ver §4.1).
> 3. Assinatura completa: preloader, cortina de transição, menu flutuante, botões magnéticos, hover de projetos — **com variações próprias** (ver §2).
> 4. Implementação em 4 fases. Site publicável ao fim de cada fase.

---

## 1. Regras invioláveis (para qualquer agente que trabalhar aqui)

- **Conteúdo protegido (README):** nunca alterar texto interno dos cases (`src/projetos/*.njk`), posts/reflexões, métricas e números.
- **URLs preservadas:** `/`, `/sobre/`, `/reflexoes/`, `/projetos/<slug>/`, `/politica-de-privacidade/`, `/404.html`. Nada de quebrar SEO. Única URL nova: `/contato/`.
- **GTM (GTM-K738G4S2), Schema.org, sitemap, robots, llms.njk:** intactos.
- **Acessibilidade:** todo efeito respeita `prefers-reduced-motion` (fallback: conteúdo estático visível, sem scroll-jacking). Sem `cursor: none` sem fallback.
- **Progressive enhancement:** o site funciona com JS desligado (conteúdo visível, navegação ok). Animações são camada extra.
- **Stack:** continua 11ty + Nunjucks + CSS puro + JS vanilla. Sem React, sem Tailwind, sem bundler. Libs novas via CDN ou vendored em `src/js/vendor/`.

## 2. Diferenciação obrigatória (o "copiar, mas diferente")

| Elemento da referência | Como fica no floriano.des.br |
|---|---|
| Azul #455CE9 como acento único | Laranja `#ee782e` |
| Off-white + cinza + quase-preto | Off-white `#f7f7f7` + navy `#01071d` (tema escuro é navy, não preto) |
| PP Neue Montreal | Montserrat (pesos 300–700, escala muito maior que a atual) |
| Preloader "Hello" em N idiomas | Preloader com palavras do ofício: "Entender → Estruturar → Construir" (ou variação curta aprovada pelo Floriano) — **não** usar saudações multilíngues |
| Curva da cortina: arco único profundo | Curva mais suave/assimétrica (raio menor, easing próprio) |
| Cursor "View" azul | Disco laranja com "Ver case" |
| Pill "Located in the Netherlands" + globo | Pill "Brasil · trabalho remoto" com ícone próprio (sem globo girando idêntico) |
| Marquee do nome no hero | Marquee com "Designer de experiências digitais —" (título, não nome) |
| Footer "Let's work together" | "Vamos construir algo juntos" (ou texto aprovado) |

## 3. Fundação técnica (Fase 1)

### 3.1 Bibliotecas
- **GSAP 3 + ScrollTrigger** (gratuito, incluindo plugins desde 2024) — animações e pinning.
- **Lenis** (MIT) — smooth scroll. *Não* usar Locomotive Scroll (mais pesado, virtual scroll problemático p/ SEO e acessibilidade).
- Vendored em `src/js/vendor/`, carregados com `defer`. Total < 80 KB gzip.

### 3.2 Novos arquivos
```
src/css/style.motion.css          # tokens de animação, curvas, estados reveal
src/js/motion/lenis-init.js       # smooth scroll + integração ScrollTrigger
src/js/motion/preloader.js
src/js/motion/transitions.js      # cortina entre páginas (View Transitions API c/ fallback GSAP)
src/js/motion/magnetic.js         # botões magnéticos
src/js/motion/project-hover.js    # preview flutuante + cursor "Ver case"
src/js/motion/reveals.js          # entradas por seção (ScrollTrigger)
src/_includes/partials/preloader.njk
src/_includes/partials/menu-flutuante.njk
src/_includes/partials/section-curve.njk   # divisor curvo reutilizável (SVG)
```

### 3.3 Tokens novos em `style.tokens.css`
- Escala display: `--text-display: clamp(3.5rem, 12vw, 11rem)` (marquee/títulos), `--text-h1: clamp(2.5rem, 6vw, 5rem)`.
- `--ease-curtain: cubic-bezier(0.76, 0, 0.24, 1)`, `--ease-out-expo`, durações padrão.
- Temas por seção: `data-theme="dark|light"` controla `--bg`/`--fg` (navy/off-white invertidos).
- Raio das curvas de seção: `--curve-depth` (usado pelo SVG divisor).

### 3.4 Componentes-base (elemento por elemento)

| # | Componente | Comportamento | Quem faz |
|---|---|---|---|
| C1 | **Preloader** | Tela navy, palavras ciclando (~1,8 s total), cortina sobe com borda curva. Roda 1× por sessão (sessionStorage). | **IA** (texto final: **Floriano**) |
| C2 | **Cortina de transição** | Ao navegar: cortina navy desce com nome da página ("• Sobre"), revela com curva. View Transitions API onde houver suporte; fallback GSAP. | **IA** |
| C3 | **Smooth scroll (Lenis)** | lerp ~0.1, desativado em `prefers-reduced-motion` e em mobile (scroll nativo). | **IA** |
| C4 | **Divisor curvo de seção** | SVG path que achata conforme a seção entra (ScrollTrigger scrub). Usado entre blocos dark/light. | **IA** |
| C5 | **Botão magnético** | Wrapper que atrai conteúdo ao cursor (raio ~60 px, lerp). Aplicado a CTAs redondos e menu. | **IA** |
| C6 | **Menu flutuante** | Nav normal no topo; após ~100 vh, colapsa em disco navy flutuante (magnético). Clique abre painel lateral (borda esquerda curva) com links grandes + socials. Mobile: substitui hamburger atual. | **IA** |
| C7 | **Hover de projetos** | Lista em linhas (Cliente / Serviço / Ano). Hover: linha esmaece+desliza, preview (imagem) segue o cursor com lerp trocando por translateY, disco laranja "Ver case" segue com atraso próprio. Touch: preview vira thumb estática na linha. | **IA** (imagens: **Floriano**) |
| C8 | **Marquee de scroll** | Texto display deslizando, velocidade acoplada ao scroll (velocity). | **IA** |
| C9 | **Reveals** | Títulos com máscara (linhas sobem), parágrafos fade+rise, imagens com clip-path. Stagger padrão 0.08 s. | **IA** |
| C10 | **Footer escuro global** | Navy, título display, CTA redondo magnético, pill com hora local (`America/Sao_Paulo`) e "© 2026 Floriano Silva", socials. Substitui footer atual em todas as páginas. | **IA** (texto: **Floriano**) |

## 4. Página por página

### 4.1 Home `/` (Fase 2)
Estrutura nova (enxuta — conteúdo removido migra, não se perde):

| Ordem | Seção | Conteúdo | Origem | Quem faz |
|---|---|---|---|---|
| 1 | **Hero** | Foto do Floriano (fundo neutro), marquee "Designer de experiências digitais —", pill localização, seta de scroll. Tema light. | hero atual, reescrito | Layout: **IA** · Foto nova: **Floriano** |
| 2 | **Intro** | 2–3 frases de posicionamento (problema → solução → experiência) + botão redondo magnético "Sobre mim". Curva de entrada. | resumo do `home-about` | Texto: **Floriano** (IA rascunha) |
| 3 | **Projetos** | Título "Trabalhos selecionados" + lista C7 com os 6 projetos (ordem do README: Quantum Vizz, 2P Web Dev, Mercado das Figurinhas, Bit System, Farm Well Hub, Olho Vivo) + botão "Todos os projetos → /#" âncora ou grid expandido. | `featured-projects` | **IA** · 1 imagem padronizada por projeto: **Floriano** |
| 4 | **Serviços** | 3 linhas numeradas (01 Estratégia & UX / 02 Sites & Produtos / 03 IA aplicada — nomes finais a aprovar), cada uma expandindo descrição curta. Tema dark (navy), curva na entrada. | `home-services` + `ai-process` condensados | Estrutura: **IA** · Nomes/textos: **Floriano** aprova |
| 5 | **Faixa de prova social** | Marquee ou faixa única com 1 depoimento forte + logos de clientes (assets existentes). | `home-testimonials` + `impact-stats` (1 stat pode virar linha do intro) | **IA** · escolha do depoimento: **Floriano** |
| 6 | **Footer global (C10)** | CTA de contato → `/contato/`. | footer atual | **IA** |

**Migrações:** stats completos e processo de IA → página Sobre; reflexões saem da home (continuam em `/reflexoes/`, linkadas no menu e footer).

### 4.2 Cases `/projetos/<slug>/` (Fase 3)
Template `case-study.njk` ganha casca nova; **miolo (texto/métricas) intocado**.
- Abertura: cortina com nome do projeto → vira header (título display).
- Faixa de metadados: `SERVIÇOS / STACK / ANO` (+ link "Ver no ar" em pill, quando existir).
- Imagem de capa full-width com parallax leve.
- Corpo atual renderizado com os novos estilos de tipografia/espaçamento (CSS only).
- Footer de case: **"Próximo projeto"** com nome gigante + preview no hover, encadeando na ordem do README (circular).
- Quem faz: **IA** tudo · **Floriano**: imagem de capa por case (6×) e confirmação dos metadados.

### 4.3 Sobre `/sobre/` (Fase 4)
- Hero: foto + título display, tema dark.
- Recebe: stats (números grandes animados com count-up), processo/método (seções atuais `about-method`, `about-stack`, `about-repertoire` re-estilizadas), seção de IA no processo, link discreto pro design gráfico (mantido).
- Texto existente preservado; só camada visual + reveals.
- Quem faz: **IA** tudo · **Floriano**: foto nova opcional.

### 4.4 Contato `/contato/` — página nova (Fase 4)
- Título "Vamos construir algo juntos" + formulário numerado (01 nome, 02 email, 03 empresa, 04 o que precisa, 05 mensagem) + botão redondo magnético de envio sobrepondo a seção.
- Sidebar: email, WhatsApp, LinkedIn, GitHub.
- Backend do form: **decisão do Floriano** — opções: Formspree (grátis até 50/mês), Web3Forms, ou só mailto/WhatsApp (sem backend). IA implementa a escolhida.
- Footer atual com CTA de WhatsApp continua existindo como atalho; nav ganha "Contato".

### 4.5 Reflexões `/reflexoes/` (Fase 4)
- Lista estilo tabela (Título / Data) com hover C7 simplificado (sem preview de imagem; linha desliza + seta).
- Feed do Medium intocado.

### 4.6 404 e Política (Fase 4)
- 404: tema dark, título display, botão magnético "Voltar ao início". Política: só tipografia nova. **IA**.

## 5. O que depende do Floriano (checklist de assets e decisões)

**Imagens (bloqueiam C7 e Fase 3):**
- [ ] 6 previews de projeto padronizados — mesmo enquadramento, 16:10, ~1200×750, webp, fundo neutro consistente (screenshot da home de cada projeto funciona)
- [ ] 6 capas de case full-width (~2000 px de largura) — pode ser a mesma arte do preview ampliada
- [ ] Foto sua para o hero: corpo a partir do peito, fundo liso claro, olhando levemente fora do eixo (a atual `perfil-floriano-hero.png` pode servir de teste na Fase 2)
- [ ] Foto para o Sobre (opcional, a atual serve)

**Textos (IA rascunha, você aprova):**
- [ ] Palavras do preloader
- [ ] Frase do marquee do hero
- [ ] Intro da home (2–3 frases)
- [ ] Nomes das 3 linhas de serviços
- [ ] Depoimento escolhido para a faixa
- [ ] Título do footer/CTA

**Decisões:**
- [ ] Backend do formulário de contato (Formspree / Web3Forms / sem form)
- [ ] Aprovar cada fase em staging antes do merge (teste em: seu desktop, um Android, um iPhone)

## 6. Fases e divisão entre agentes

> Sugestão de divisão: **Claude Code** = fundação, integração 11ty, refactors que tocam muitos arquivos (F1, casca das páginas). **Codex** = componentes isolados de animação com spec fechada (C5, C7, C8, preloader), revisão cruzada de PRs. Cada fase = 1 branch + PR. Os dois leem este arquivo; tarefas marcadas com o componente (C1–C10) e a seção (§4.x).

| Fase | Entrega | Inclui | Pré-requisitos do Floriano |
|---|---|---|---|
| **F1 — Fundação** | Site idêntico ao atual, mas com Lenis + GSAP instalados, tokens novos, C2 (transições), C9 (reveals genéricos) e C10 (footer novo) | §3 inteiro, C2, C3, C9, C10 | Texto do footer |
| **F2 — Home** | Home nova completa | §4.1, C1, C5, C6, C7, C8 | Previews dos 6 projetos, textos da home, preloader |
| **F3 — Cases** | 6 cases com casca nova + "Próximo projeto" | §4.2 | Capas dos cases |
| **F4 — Periferia** | Sobre, Contato, Reflexões, 404, Política | §4.3–4.6 | Decisão do form, foto opcional |

**Critérios de aceite por fase (QA da IA):**
- Lighthouse mobile ≥ 85 performance, 100 SEO/a11y best-effort
- `prefers-reduced-motion` testado
- Build 11ty sem erros, HTML válido, sem CLS visível no preloader
- URLs e GTM intactos (diff de sitemap)

---
*Gerado em 11/06/2026 a partir da análise do site de referência + estrutura atual do repo. Em caso de conflito entre este plano e o README, o README vence em conteúdo/posicionamento; este plano vence em visual/interação.*
