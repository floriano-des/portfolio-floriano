---
layout: case-study-md.njk
permalink: /projetos/olho-vivo/
title: "Olho Vivo · Estudo de caso · Floriano Silva"
description: "Da pesquisa de campo em Palmital ao PRD do Olho Vivo: um web-app de bolso para acompanhar promessas de prefeito e vereadores, com módulo de educação política integrado."
projectName: "Olho Vivo"
bodyClass: "cs-olho"
heroTag: "pesquisa → produto · web-app PWA · participação cívica"
subtitle: "Pesquisa aplicada em Palmital virou personas, jornadas e a base do Olho Vivo: um web-app de bolso para acompanhar promessas de prefeito e vereadores, com módulo de educação política integrado."
summary:
  - label: "Situação"
    text: "Em Palmital, muitos cidadãos votam, mas não sabem o que cobrar de prefeito e vereadores, onde acompanhar promessas ou quais canais oficiais consultar."
  - label: "Tarefa"
    text: "Investigar o problema antes de desenhar solução, entendendo barreiras reais de informação, confiança e acesso digital."
  - label: "Ação"
    text: "Combinei dados secundários, 5W2H, survey com 50 respostas, 8 entrevistas, diagrama de afinidade, personas, mapas de empatia, jornadas e priorização por impacto e esforço."
  - label: "Resultado"
    text: "A pesquisa virou um PRD e o recorte do MVP do Olho Vivo: rastreador de promessas + módulo de educação política, web-app PWA primeiro e app nativo numa fase seguinte."
metrics:
  - value: "50"
    label: "respostas no survey quantitativo com cidadãos de Palmital"
    icon: "trend"
  - value: "8"
    label: "entrevistas qualitativas com perfis distintos"
    icon: "time"
  - value: "3"
    label: "iniciativas priorizadas por impacto e viabilidade"
    icon: "calendar"
learningsTitle: "O que este projeto prova"
learnings:
  - icon: "alert"
    text: "<strong>Consigo transformar problema nebuloso em leitura acionável.</strong> A pesquisa mostrou que o problema não era apenas falta de interesse político, mas falta de referências confiáveis e simples."
  - icon: "grid"
    text: "<strong>Pesquisa ajuda a cortar caminhos errados.</strong> Várias hipóteses iniciais foram refinadas pelos dados, evitando uma solução digital desconectada do contexto local."
  - icon: "trend"
    text: "<strong>Pesquisa de campo exige método e sensibilidade.</strong> Em um tema sensível como política, as respostas mais úteis apareceram quando houve escuta real antes do roteiro."
  - icon: "alert"
    text: "<strong>Pesquisa não termina no diagnóstico.</strong> Fechar o ciclo exige traduzir os achados em escopo, princípios de UX e métricas de sucesso — antes de tocar no pixel ou no código."
roleGroups:
  - label: "Papel"
    tags:
      - "Designer de experiências digitais"
  - label: "Skills"
    tags:
      - "UX Research"
      - "Síntese"
      - "Definição de problema"
      - "Estratégia de produto"
      - "Definição de MVP"
  - label: "Ferramentas"
    tags:
      - "Figma"
      - "FigJam"
      - "Notion"
      - "Google Forms"
  - label: "Métodos"
    tags:
      - "Survey"
      - "Entrevistas"
      - "5W2H"
      - "Diagrama de afinidade"
      - "Personas"
      - "Mapas de empatia"
      - "Jornada do usuário"
      - "Ideação com IA"
      - "Matriz esforço × impacto"
      - "PRD"
      - "Roadmap"
      - "KPIs"
projectNav:
  backHref: "/#projetos"
  backLabel: "Todos os Projetos"
  prev:
    href: "/projetos/farm-well-hub/"
    label: "Projeto anterior"
    title: "Farm Well Hub"
  next:
    href: "/projetos/quantum-vizz/"
    label: "Próximo Projeto"
    title: "Quantum Vizz"
---

{% caseSection "Contexto", "Participação política sem repertório para cobrança.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        Em Palmital, SP, cerca de 19 mil pessoas elegem prefeito e vereadores a cada quatro anos. Mesmo assim, a pesquisa apontou que muita gente não sabe distinguir as atribuições de cada cargo, acompanhar promessas ou identificar fontes confiáveis.
      </p>
      <p class="cs-body-copy" data-animate data-delay="2">
        O risco era desenhar uma solução com cara de aplicativo cívico, mas desconectada da vida real. Antes de propor interface, a prioridade foi entender como a população se informa, em quem confia e o que impede uma cobrança mais ativa.
      </p>
{% endcaseSection %}

{% caseSection "Diagnóstico", "O que a solução precisava considerar", "section cs-olho-dark cs-dark", "dark" %}
<div class="cs-olho-diagnosis">
        <div class="cs-olho-card" data-animate>
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 9h16"/><path d="M4 15h16"/><path d="M4 4h.01"/><path d="M4 20h.01"/></svg>
          </span>
          <h3>Baixa clareza política</h3>
          <p>Mais da metade dos respondentes não conseguia separar o papel do prefeito do papel dos vereadores.</p>
        </div>

        <div class="cs-olho-card" data-animate data-delay="1">
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M8 17h7"/></svg>
          </span>
          <h3>Canais oficiais fracos</h3>
          <p>Apenas 12% usavam sites oficiais para se informar, enquanto rádio, conversas e WhatsApp sustentavam a rotina local.</p>
        </div>

        <div class="cs-olho-card" data-animate data-delay="2">
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>
          </span>
          <h3>Confiança antes de engajamento</h3>
          <p>A desconfiança não era falta de interesse, mas resultado de promessas pouco acompanhadas e informação difícil de verificar.</p>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Pergunta norteadora", "Como ajudar cidadãos de Palmital a compreender e acompanhar o trabalho do prefeito e dos vereadores de forma simples, acessível e confiável?", "cs-context section cs-dark", "dark" %}
<div class="cs-gargalos">
        <h2 class="cs-gargalos__title section-title">4 premissas de pesquisa</h2>
        <ul class="cs-gargalos__list" role="list">
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">1</span>
            <p class="cs-gargalos__text"><strong>Contexto local importa.</strong> Palmital tem escala pequena, dinâmica de cidade próxima e canais de informação muito informais.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">2</span>
            <p class="cs-gargalos__text"><strong>Acesso não garante uso.</strong> Ter internet não significa buscar informação política por canais oficiais.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">3</span>
            <p class="cs-gargalos__text"><strong>Educação política é parte do produto.</strong> Sem explicar papéis e responsabilidades, qualquer rastreador vira ruído.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">4</span>
            <p class="cs-gargalos__text"><strong>Confiança precisa ser construída.</strong> O produto precisava parecer verificável, direto e útil antes de pedir engajamento.</p>
          </li>
        </ul>
      </div>
{% endcaseSection %}

{% caseSection "Processo", "Do dado secundário à direção de solução.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        A pesquisa começou com dados do Senado, IBGE, Câmara dos Deputados e fontes locais. Depois, usei 5W2H para estruturar o problema, survey para medir percepção e entrevistas para entender linguagem, confiança e comportamento.
      </p>

      <div class="cs-olho-process">
        <figure>
          <img src="/assets/projetos/olho-vivo/5w2h.webp" alt="Framework 5W2H preenchido para mapear o problema do Olho Vivo" loading="lazy">
        </figure>
        <figure>
          <video src="/assets/projetos/olho-vivo/affinity-diagram.mp4" autoplay loop muted playsinline preload="metadata"></video>
        </figure>
      </div>
{% endcaseSection %}

{% caseSection "Evidências", "Fontes que moldaram o recorte da pesquisa.", "section cs-olho-soft", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        As fontes secundárias ajudaram a separar achismo de contexto. Elas mostraram limitações de educação política, dados sociais e condições econômicas que influenciaram diretamente o desenho do survey e do roteiro.
      </p>

      <div class="cs-olho-source-grid">
        <img src="/assets/projetos/olho-vivo/senado_1_webp.webp" alt="Dados do Senado Federal sobre conhecimento político dos eleitores brasileiros" loading="lazy">
        <img src="/assets/projetos/olho-vivo/link_ibge_webp.webp" alt="Dados do IBGE sobre Palmital, SP" loading="lazy">
        <img src="/assets/projetos/olho-vivo/link_educacao_webp.webp" alt="Indicadores de educação em Palmital, SP" loading="lazy">
        <img src="/assets/projetos/olho-vivo/link_economia_ibge_webp.webp" alt="Indicadores econômicos de Palmital, SP" loading="lazy">
      </div>
{% endcaseSection %}

{% caseSection "Achados", "O que a pesquisa revelou", "cs-results cs-results--olho section cs-dark", "dark" %}
<div class="cs-metrics">
        <div class="cs-metric" data-animate>
          <span class="cs-metric__value">12%</span>
          <span class="cs-metric__label">usam sites oficiais da prefeitura ou câmara para se informar.</span>
        </div>
        <div class="cs-metric" data-animate data-delay="1">
          <span class="cs-metric__value">+50%</span>
          <span class="cs-metric__label">não distingue com clareza as atribuições do prefeito e dos vereadores.</span>
        </div>
        <div class="cs-metric" data-animate data-delay="2">
          <span class="cs-metric__value">80%</span>
          <span class="cs-metric__label">dos eleitores brasileiros acreditam que políticos não cumprem promessas de campanha.</span>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Síntese", "Duas personas, duas barreiras diferentes.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        A pesquisa deixou claro que uma solução única excluiria parte do público. O cidadão instruído tem acesso digital, mas pouco tempo e motivação. O cidadão do povo tem mais dependência de canais informais e menor letramento digital.
      </p>

      <div class="cs-olho-personas">
        <figure>
          <img data-zoom-src="/assets/projetos/olho-vivo/cidad_o_instru_do.webp" src="/assets/projetos/olho-vivo/cidad_o_instru_do.webp" alt="Persona Cidadão Instruído" loading="lazy">
        </figure>
        <figure>
          <img data-zoom-src="/assets/projetos/olho-vivo/cidad_o_do_povo.webp" src="/assets/projetos/olho-vivo/cidad_o_do_povo.webp" alt="Persona Cidadão do Povo" loading="lazy">
        </figure>
      </div>

      <div class="cs-olho-personas cs-olho-personas--maps">
        <figure>
          <img data-zoom-src="/assets/projetos/olho-vivo/mapa-de-empatia-cidadao-instruido.webp" src="/assets/projetos/olho-vivo/mapa-de-empatia-cidadao-instruido.webp" alt="Mapa de empatia do Cidadão Instruído" loading="lazy">
        </figure>
        <figure>
          <img data-zoom-src="/assets/projetos/olho-vivo/mapa-de-empatia-cidadao-do-povo.webp" src="/assets/projetos/olho-vivo/mapa-de-empatia-cidadao-do-povo.webp" alt="Mapa de empatia do Cidadão do Povo" loading="lazy">
        </figure>
      </div>
{% endcaseSection %}

{% caseSection "Jornada", "Onde cada perfil se perde no ciclo político.", "section cs-olho-dark cs-dark", "dark" %}
<p class="cs-body-copy cs-body-copy--dark" data-animate data-delay="1">
        As jornadas revelaram que o problema não estava em um único ponto do fluxo. Ele aparece no momento de entender propostas, acompanhar mandatos, identificar responsabilidade e decidir se vale a pena participar.
      </p>

      <div class="cs-olho-journeys">
        <img data-zoom-src="/assets/projetos/olho-vivo/jornadacidadao-instruido.webp" src="/assets/projetos/olho-vivo/jornadacidadao-instruido.webp" alt="Jornada do usuário Cidadão Instruído" loading="lazy">
        <img data-zoom-src="/assets/projetos/olho-vivo/jornada-cidadao-do-povo.webp" src="/assets/projetos/olho-vivo/jornada-cidadao-do-povo.webp" alt="Jornada do usuário Cidadão do Povo" loading="lazy">
      </div>
{% endcaseSection %}

{% caseSection "Ideação", "Divergir antes de escolher.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        Antes de fechar uma solução, abri o leque. Usei IA como parceira de ideação para forçar variedade e fugir da primeira ideia óbvia (um app político genérico). Depois fiz a curadoria à mão: cortei por <strong>impacto × esforço</strong>, dado o contexto de designer solo.
      </p>

      <div class="cs-gargalos">
        <h3 class="cs-gargalos__title section-title" style="font-size:1.1rem">6 direções exploradas</h3>
        <ul class="cs-gargalos__list" role="list">
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">1</span>
            <p class="cs-gargalos__text"><strong>Rastreador de promessas.</strong> Status visual + fonte verificável por promessa.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">2</span>
            <p class="cs-gargalos__text"><strong>Glossário cívico.</strong> Termos políticos traduzidos em linguagem de feira.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">3</span>
            <p class="cs-gargalos__text"><strong>Comparador de cargos.</strong> "O que faz prefeito × o que faz vereador" lado a lado.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">4</span>
            <p class="cs-gargalos__text"><strong>Bot de WhatsApp.</strong> Resposta automática para "qual o status da promessa X?".</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">5</span>
            <p class="cs-gargalos__text"><strong>Newsletter local mensal.</strong> Resumo de promessas em e-mail e mensagem.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">6</span>
            <p class="cs-gargalos__text"><strong>Checklist em PDF.</strong> Material offline para quem não usa app.</p>
          </li>
        </ul>
      </div>

      <p class="cs-body-copy" data-animate data-delay="2">
        A matriz esforço × impacto cortou para três frentes complementares: uma core (digital), uma de distribuição (social) e uma de inclusão (offline).
      </p>
{% endcaseSection %}

{% caseSection "Direção de produto", "Três frentes priorizadas.", "section", "light" %}
<div class="cs-olho-initiatives">
        <article data-animate>
          <span>Núcleo do produto</span>
          <h3>Rastreador + educação política</h3>
          <p>Web-app de bolso para acompanhar promessas com status claros, fontes verificáveis e explicação inline de papéis dos cargos.</p>
        </article>
        <article data-animate data-delay="1">
          <span>Distribuição</span>
          <h3>Campanha em redes sociais</h3>
          <p>Conteúdo educativo para o público que já usa canais digitais, sem depender de sites oficiais como ponto de partida.</p>
        </article>
        <article data-animate data-delay="2">
          <span>Suporte offline</span>
          <h3>Checklist em PDF</h3>
          <p>Material físico e compartilhável para pessoas com menor acesso digital ou menor conforto com tecnologia.</p>
        </article>
      </div>

      <div class="cs-olho-single-shot">
        <img src="/assets/projetos/olho-vivo/Aplicativo-Politico.webp" alt="Conceito visual do Olho Vivo gerado a partir da pesquisa" loading="lazy">
      </div>
{% endcaseSection %}

{% caseSection "Recorte do MVP", "O que entra primeiro, o que vai depois.", "section cs-olho-dark cs-dark", "dark" %}
<p class="cs-body-copy cs-body-copy--dark" data-animate data-delay="1">
        O MVP combina <strong>rastreador de promessas</strong> e <strong>módulo de educação política</strong> num único web-app PWA, escopo Palmital, curadoria por admin único. Redes e PDF entram como apoio depois do lançamento. App nativo é fase 2.
      </p>

      <div class="cs-olho-diagnosis">
        <div class="cs-olho-card" data-animate>
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </span>
          <h3>Fase 0 — Protótipo</h3>
          <p>Wireframe + protótipo navegável em Figma, validado com 5–8 cidadãos de Palmital em teste de guerrilha.</p>
        </div>

        <div class="cs-olho-card" data-animate data-delay="1">
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><circle cx="7" cy="6" r="0.5"/></svg>
          </span>
          <h3>Fase 1 — Web-app PWA</h3>
          <p>Lançamento público, instalável no celular, 30 promessas pré-cadastradas, analytics ativos (GA4 + Clarity).</p>
        </div>

        <div class="cs-olho-card" data-animate data-delay="2">
          <span class="cs-olho-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          </span>
          <h3>Fase 2 — App nativo</h3>
          <p>Migração para nativo motivada por notificações push, offline completo e favoritos. Reusa design system da v1.</p>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Resultado da pesquisa", "Um mapa claro para decidir o que construir primeiro.", "cs-results cs-results--olho section cs-dark", "dark" %}
<div class="cs-metrics">
        <div class="cs-metric" data-animate>
          <span class="cs-metric__value">2 personas</span>
          <span class="cs-metric__label">com mapas de empatia e necessidades documentadas.</span>
        </div>
        <div class="cs-metric" data-animate data-delay="1">
          <span class="cs-metric__value">2 jornadas</span>
          <span class="cs-metric__label">mostrando pontos de dor, abandono e oportunidades de intervenção.</span>
        </div>
        <div class="cs-metric" data-animate data-delay="2">
          <span class="cs-metric__value cs-metric__value--compact">1 PRD</span>
          <span class="cs-metric__label">com escopo de MVP, princípios de UX e roadmap em 3 fases.</span>
        </div>
      </div>

      <div class="cs-olho-link" data-animate data-delay="3">
        <a href="/reflexoes/pesquisa-olho-vivo/">
          Ver pesquisa completa
        </a>
      </div>
{% endcaseSection %}

{% caseSection "Métricas de sucesso", "Como saberemos que o produto funcionou.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        Sem indicadores, "pronto" vira opinião. O PRD fecha quatro métricas-âncora para a v1 do web-app — definidas antes do lançamento e instrumentadas no GA4 e no Microsoft Clarity.
      </p>

      <div class="cs-olho-initiatives">
        <article data-animate>
          <span>Engajamento</span>
          <h3>≥40%</h3>
          <p>dos visitantes abre ao menos uma promessa.</p>
        </article>
        <article data-animate data-delay="1">
          <span>Educação</span>
          <h3>≥25%</h3>
          <p>dos visitantes abre o módulo "Quem faz o quê?".</p>
        </article>
        <article data-animate data-delay="2">
          <span>Mobilização</span>
          <h3>≥0,15</h3>
          <p>cliques em "compartilhar" por sessão (WhatsApp).</p>
        </article>
        <article data-animate data-delay="3">
          <span>Retenção</span>
          <h3>≥15%</h3>
          <p>de visitantes voltam em 30 dias.</p>
        </article>
      </div>
{% endcaseSection %}

{% caseSection "Próximos passos", "Do PRD ao produto no ar.", "section cs-olho-soft", "light" %}
<div class="cs-gargalos">
        <ul class="cs-gargalos__list" role="list">
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">1</span>
            <p class="cs-gargalos__text"><strong>Wireframes em baixa fidelidade</strong> das 5 telas principais — validar arquitetura antes do pixel.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">2</span>
            <p class="cs-gargalos__text"><strong>Protótipo médio-fi em Figma</strong> com 1 fluxo navegável end-to-end e componentes reutilizáveis marcados.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">3</span>
            <p class="cs-gargalos__text"><strong>Teste de guerrilha</strong> com 5–8 cidadãos de Palmital, com pelo menos 2 do perfil Cidadão do Povo.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">4</span>
            <p class="cs-gargalos__text"><strong>Iteração</strong> baseada nos achados. Reteste se mudanças forem grandes.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">5</span>
            <p class="cs-gargalos__text"><strong>Implementação assistida por IA</strong> usando PRD + protótipo aprovado como verdade. Lançamento da PWA com 30 promessas pré-cadastradas.</p>
          </li>
        </ul>
      </div>
{% endcaseSection %}
