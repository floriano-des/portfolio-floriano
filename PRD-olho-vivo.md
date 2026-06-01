# PRD — Olho Vivo
**Documento de requisitos de produto (foco UX)**
Versão 0.1 · Maio 2026 · Autor: Floriano Silva

> Este PRD orienta a construção do MVP do Olho Vivo como **web-app (PWA)**, com a visão de evoluir para **app nativo** numa fase seguinte. O escopo aqui é UX e produto, não stack técnica. Dúvidas de implementação ficam abertas para a fase de código, mas as decisões de experiência precisam estar fechadas antes do protótipo.

---

## 1. Visão

**Frase de visão.** Tornar a fiscalização do poder público municipal **simples, acessível e confiável** para qualquer cidadão de Palmital — começando pelo acompanhamento de promessas de prefeito e vereadores e pela educação sobre o que cobrar de cada cargo.

**Por que existe.** A pesquisa de campo mostrou que o problema não é desinteresse, é **falta de referência**: mais de 50% dos respondentes não distingue o papel do prefeito do dos vereadores, e só 12% usam canais oficiais. O Olho Vivo é uma referência única, em linguagem cotidiana, que devolve ao eleitor o "o que cobrar, de quem e como".

**Para quem.** Eleitores de Palmital (≈19 mil), em dois perfis identificados na pesquisa: Cidadão Instruído (digital, sem tempo) e Cidadão do Povo (informal, baixo letramento digital).

---

## 2. Problema

O cidadão de Palmital quer participar mas não tem onde:
- **Saber o que cada cargo faz** sem precisar pesquisar em fontes secas.
- **Acompanhar promessas** num lugar único, com status claro.
- **Verificar** que a informação é confiável (fonte explícita).
- **Compartilhar** facilmente para mobilizar a rede pessoal (WhatsApp, grupo da rua).

A solução precisa caber no celular, na rotina, e numa conexão modesta. Não é um portal cívico. É um aplicativo de bolso.

---

## 3. Personas e necessidades-chave

### Cidadão Instruído
- **O que precisa.** Dados confiáveis, fontes verificáveis, comparativos por tema. Eficiência: entrar, ver, sair.
- **Comportamento.** Acessa pelo celular ou desktop, em janelas curtas. Compartilha quando vê algo "para mostrar".
- **Decisão de UX.** Filtros poderosos, links de fonte sempre visíveis, atalho de compartilhamento.

### Cidadão do Povo
- **O que precisa.** Entender em poucos toques o que é o produto e o que pode fazer ali. Linguagem como conversa de feira, não como portal de governo.
- **Comportamento.** Chega via link do WhatsApp. Lê devagar. Volta se alguém mandar de novo.
- **Decisão de UX.** Tela inicial em 3 frases, ícones e cores como pista, glossário inline em qualquer termo técnico. Compartilhamento em destaque.

---

## 4. Objetivos de produto e métricas (KPIs)

**Objetivo 1 — Reduzir a barreira de informação política.**
- KPI: % de visitantes que abre ao menos uma promessa (meta v1: ≥40%).
- KPI: % de visitantes que abre o módulo "Quem faz o quê?" (meta v1: ≥25%).

**Objetivo 2 — Gerar engajamento real (cobrança).**
- KPI: cliques em "compartilhar" por sessão (meta v1: ≥0,15).
- KPI: retorno em 30 dias (meta v1: ≥15%).

**Objetivo 3 — Conquistar confiança.**
- KPI qualitativo: em pesquisa pós-uso com 10 cidadãos, ≥7 respondem "confio na informação".
- KPI: taxa de clique em "fonte" por promessa visualizada (meta v1: ≥10%).

**Indicadores de saúde do produto (não-UX).**
- Tempo até primeira promessa visível (LCP < 2,5s em 4G).
- # de promessas publicadas (meta de lançamento: ≥30).
- # de atualizações de status por mês (meta: ≥10).

---

## 5. Princípios de UX (não-negociáveis)

1. **Linguagem de 6ª série.** Qualquer texto público passa por revisão de simplicidade (alvo: Flesch ≥70 em português). Termos políticos viram glossário inline.
2. **Status nunca depende só de cor.** Toda etiqueta de status combina cor + ícone + texto. WCAG AA.
3. **Fonte sempre visível.** Toda promessa exibe um chip "Fonte: [origem] · [data]" antes do clique.
4. **Mobile-first, telas curtas.** Decisões de hierarquia tomadas na largura de 360 px. Desktop é consequência.
5. **Educação no fluxo, não em página separada.** Glossário entra como tooltip ou bottom-sheet, sem tirar o cidadão do contexto.
6. **Compartilhar é primeira classe.** Botão de WhatsApp em todo cartão de promessa, com texto pronto.
7. **PWA instalável.** O cidadão pode "adicionar à tela inicial" desde o primeiro acesso.

---

## 6. Escopo do MVP (v1)

### Entra
- Lista de promessas do prefeito e dos vereadores de Palmital.
- Filtros: cargo, tema, status.
- Página de promessa individual com fonte, histórico e botão compartilhar.
- Módulo "Quem faz o quê?" — explicação visual de papéis (prefeito × vereadores).
- Página "Sobre" com método de curadoria e como sugerir promessa (formulário simples).
- Glossário inline (≤20 termos).
- PWA: manifest, ícone, instalável.

### Fica fora (volta no roadmap)
- Login/cadastro.
- Crowdsourcing aberto (sugestões viram fila, mas só admin publica).
- Notificações push (tecnicamente limitado em web-app iOS).
- Múltiplas cidades.
- Comentários e fórum.
- Comparativo entre mandatos históricos.

---

## 7. Jornadas principais

### J1 — "Chego pelo WhatsApp e quero entender o que é isso"
1. Cidadão clica em link compartilhado por um vizinho.
2. Cai na **home** que responde em 3 frases: "O que é · O que tem aqui · Como confiar".
3. Vê o **prefeito atual** e o **número de vereadores** como pista visual.
4. CTA principal: "Ver as promessas". CTA secundário: "Entender os cargos".
5. Toca em "Ver as promessas" → lista.

### J2 — "Quero ver o que prometeram sobre saúde"
1. Da home ou da lista, abre **filtro por tema**.
2. Marca "Saúde". Vê 5–10 promessas com status visíveis.
3. Toca em uma promessa com status "Em andamento".
4. Lê descrição (≤3 frases), vê fonte, vê histórico, decide compartilhar.
5. Botão "Compartilhar no WhatsApp" abre app com texto pronto.

### J3 — "Não sei a diferença entre prefeito e vereador"
1. Da home, toca em "Entender os cargos".
2. Cai em **módulo educativo** com 2 cards lado a lado: prefeito × vereador.
3. Cada card mostra: o que faz / o que NÃO faz / um exemplo local.
4. CTA no fim: "Agora veja as promessas de cada um".

### J4 — "Quero sugerir uma promessa que vi"
1. Da página "Sobre" ou rodapé, toca em "Sugerir promessa".
2. Formulário curto: descrição, fonte (link ou foto), cargo, opcional WhatsApp para retorno.
3. Submit → confirmação simples: "Recebi. Vou verificar e publicar se for o caso."
4. Não há feed público de sugestões (curadoria fechada no MVP).

---

## 8. Arquitetura de informação

```
/  (home)
├── /promessas
│     ├── /promessas/[id-da-promessa]
│     └── filtros: cargo, tema, status (querystring)
├── /cargos  ("Quem faz o quê?")
│     ├── /cargos/prefeito
│     └── /cargos/vereador
├── /sobre
│     └── formulário "sugerir promessa"
└── /glossario (apoio; também aparece inline)
```

### Modelo de dados (visão de produto, não de banco)

**Promessa.**
- Título (≤80 caracteres, linguagem simples).
- Descrição (≤3 frases).
- Cargo responsável (prefeito | vereador-nome).
- Tema (saúde, educação, infraestrutura, segurança, emprego, transparência, outro).
- Status (Cumprida | Em andamento | Não cumprida | Sem informação).
- Fonte (rótulo + URL ou referência).
- Data da promessa.
- Data da última verificação.
- Histórico (lista de mudanças de status com data e fonte).

**Cargo.**
- Nome, foto, partido, mandato.
- Atribuições (resumo educativo).
- Lista de promessas vinculadas.

**Termo do glossário.**
- Termo, definição simples, exemplo local.

---

## 9. Telas e componentes (MVP)

### 9.1 Home
- Hero curto: nome do produto + tagline + 1 frase do que é.
- Bloco "Quem governa Palmital hoje" (foto do prefeito + grid pequeno de vereadores).
- 2 CTAs: "Ver promessas" / "Entender os cargos".
- Bloco de confiança: "Como funciona", "De onde vem a informação", "Quem mantém".
- Banner instalar como app (PWA prompt).

### 9.2 Lista de promessas
- Barra de filtros sticky no topo: cargo, tema, status.
- Cards em coluna única (mobile) / grid (desktop ≥ 768 px).
- Cada card: status (cor + ícone + texto), título, cargo, data, chip de fonte.
- Botão "Compartilhar" no card sem precisar abrir.

### 9.3 Página da promessa
- Status grande no topo.
- Título e descrição.
- Quem prometeu (link para o cargo).
- Fonte completa (citação + link).
- Histórico vertical: cada mudança com data, status anterior, novo status, fonte.
- Botão compartilhar (WhatsApp, copiar link).
- "Foi útil?" — botão simples sim/não (telemetria leve).

### 9.4 Quem faz o quê
- 2 cards comparativos: prefeito × vereador.
- Cada card: foto, o que faz, o que NÃO faz, exemplo "em Palmital, isso significa…".
- CTA "Ver promessas do prefeito" / "Ver promessas dos vereadores".

### 9.5 Sobre + Sugerir promessa
- Método de curadoria em 4 passos.
- Quem mantém (cara, contato).
- Formulário de sugestão (descrição, fonte, cargo, WhatsApp opcional).
- Política de moderação em 3 linhas.

### 9.6 Componentes reutilizáveis
- **Etiqueta de status** (Cumprida / Em andamento / Não cumprida / Sem informação) com mapa fixo de cor + ícone + texto.
- **Chip de fonte** (rótulo + data).
- **Card de promessa** (lista).
- **Bottom-sheet de glossário** (mobile) / tooltip (desktop).
- **Botão compartilhar** (WhatsApp + copiar link + nativo web share API).

---

## 10. Estados e edge cases

- **Promessa sem atualização há >90 dias.** Mostrar selo "sem atualização recente" — não punir o status, mas sinalizar.
- **Status "Sem informação".** É categoria explícita, não esconder. UX: "Ainda não temos prova suficiente para classificar."
- **Lista vazia em filtro.** Estado vazio com sugestão ("Sem promessas com este filtro. Veja todas").
- **Promessa de cargo que mudou de pessoa.** Mostrar mandato e quem assumiu (sem reescrever histórico).
- **Sem conexão.** Cache da última lista lida no PWA. Estado offline mostra "Você está vendo a versão de [data]".
- **Formulário de sugestão sem fonte.** Aceita mas avisa "Sem fonte, demora mais pra publicar".
- **Termo do glossário inexistente.** Linguagem do texto público é regrada — qualquer termo "técnico" precisa ter entrada no glossário antes da publicação.

---

## 11. Acessibilidade e linguagem

- **WCAG AA mínimo.** Contraste ≥ 4.5:1 em texto, ≥ 3:1 em ícones.
- **Fonte mínima 16 px** no corpo; 14 px só em metadados.
- **Foco visível** em todos os interativos.
- **Atalhos de teclado** na lista (setas, enter).
- **Alt text em ícones de status** (não só cor).
- **Linguagem.** Voz ativa, sujeito + verbo + objeto. Sem juridiquês. Termo técnico = vira link de glossário.
- **Política de neutralidade.** Texto descreve fatos com fonte; nunca julga intenção. Status é classificação técnica, não opinião.

---

## 12. Roadmap por fase

### Fase 0 — Protótipo (Figma)
- Telas: home, lista, página da promessa, "quem faz o quê", sobre, formulário.
- 1 fluxo end-to-end navegável.
- **Saída:** teste com 5–8 cidadãos de Palmital (presencial + remoto), iteração.

### Fase 1 — Web-app PWA (lançamento público)
- Implementação das 5 telas + componentes.
- 30 promessas pré-cadastradas, 100% do prefeito atual + 1 vereador piloto.
- Painel admin simples (curadoria por você).
- PWA: instalável, ícone, splash.
- Analytics: GA4 + Microsoft Clarity (gravação para insights de UX).
- **Saída:** lançamento + campanha de redes (iniciativa 2 da pesquisa).

### Fase 1.1 — Refinamentos pós-lançamento
- Newsletter mensal (e-mail/WhatsApp).
- Cobertura dos 9 vereadores.
- Checklist PDF (iniciativa 3 da pesquisa) como asset baixável.
- Otimização baseada em Clarity (mapas de calor).

### Fase 2 — App nativo
- Notificações push (principal motivador da migração).
- Modo offline completo.
- Login opcional para favoritar promessas.
- Compartilhamento via sistema nativo.
- Reuso de design system construído na v1.

### Fase 3 — Expansão
- Crowdsourcing com fila de moderação.
- Expansão para 2–3 cidades vizinhas (Assis, Cândido Mota).
- Comparativo entre mandatos.

---

## 13. Critérios de sucesso de cada fase

| Fase | "Deu certo" se… |
|---|---|
| Protótipo | ≥80% dos 5–8 testadores completa a J1 e J2 sem ajuda; ≥6/8 entende o módulo "Quem faz o quê?" em <60s. |
| Web-app v1 | KPIs do item 4 batidos em 90 dias após lançamento; 0 promessa publicada sem fonte. |
| App nativo | Retenção 30 dias do nativo > retenção do web-app em ≥10 pontos. |
| Expansão | ≥1 cidade adicional com ≥30 promessas em 60 dias. |

---

## 14. Riscos e premissas

**Premissas.**
- Você (admin único) consegue manter ≥10 atualizações/mês no MVP. Se não, ajustar escopo.
- Cidadãos confiam na curadoria de uma pessoa identificada (vs. de instituição). A pesquisa sugere que sim, mas é hipótese a testar.
- WhatsApp como canal de distribuição funciona. (Iniciativa 2 da pesquisa cobre isso.)

**Riscos.**
- **Politização do produto.** Mitigação: tom factual + fontes + política de neutralidade pública.
- **Acusação de viés.** Mitigação: critério de seleção de promessas público; convite a contraditório por formulário.
- **Promessa sem fonte verificável.** Mitigação: regra rígida — sem fonte, não publica. Status "Sem informação" usado com transparência.
- **Esforço de manutenção.** Mitigação: kit reutilizável (a ideia da receita NN/g aplicada aqui).

---

## 15. Próximos passos (do PRD ao protótipo)

1. **Wireframes em papel ou ferramenta livre** (1–2 dias) das 5 telas principais. Validar arquitetura antes de pixel.
2. **Protótipo médio-fi no Figma** das mesmas 5 telas + 1 fluxo navegável. Componentes reutilizáveis já marcados.
3. **Teste de guerrilha** com 5–8 cidadãos de Palmital (incluir pelo menos 2 do perfil "Cidadão do Povo"). Roteiro de teste deriva das jornadas J1–J4.
4. **Iterar** o protótipo com base nos achados. Repetir o teste se mudanças forem grandes.
5. **Handoff para implementação** (IA + você) usando este PRD + protótipo aprovado como verdade.
6. **Definir métricas no GA4 e Clarity** antes do lançamento — sem instrumentação, não há aprendizado.

---

## Anexo A — Mapa de status

| Status | Cor | Ícone | Texto | Significado |
|---|---|---|---|---|
| Cumprida | Verde | ✓ | "Cumprida" | Promessa concluída e verificada. |
| Em andamento | Laranja | ↻ | "Em andamento" | Há ação documentada em curso. |
| Não cumprida | Vermelho | ✕ | "Não cumprida" | Prazo passou ou ação interrompida sem entrega. |
| Sem informação | Cinza | ? | "Sem informação" | Sem fonte suficiente para classificar. |

Padrão: cor é reforço, nunca a única pista. Texto e ícone sempre presentes.

## Anexo B — Política de fonte

Toda promessa publicada tem **ao menos uma fonte primária**: discurso oficial, programa de governo registrado no TSE, ata da câmara, entrevista publicada, ou documento da prefeitura. Postagem em rede social do candidato vale como fonte se for verificável (link permanente). Recortes de jornal local valem se o veículo for identificável.

**Fonte secundária** (terceiro relatando) só entra quando confirma fonte primária.

Sem nenhuma fonte → não publica.

---

*Referência metodológica: Design Thinking NN/g — Empatizar/Definir já feitos na pesquisa Olho Vivo; este PRD inicia Idear/Prototipar/Testar/Implementar.*
