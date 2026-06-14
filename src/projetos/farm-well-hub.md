---
layout: case-study-md.njk
permalink: /projetos/farm-well-hub/
title: "Farm Well Hub · Estudo de caso · Floriano Silva"
description: "Como estruturei uma plataforma acessível para agricultores encontrarem suporte e se inscreverem em webinars com clareza, confiança e baixa fricção."
projectName: "Farm Well Hub"
bodyClass: "cs-farm"
heroTag: "serviço digital · acessibilidade · clareza em contexto sensível"
subtitle: "Como estruturei uma plataforma acessível para agricultores encontrarem suporte e se inscreverem em webinars com o mínimo de fricção."
summary:
  - label: "Situação"
    text: "Agricultores irlandeses precisavam acessar suporte, informação e webinars em um contexto de vulnerabilidade, isolamento e baixo letramento digital."
  - label: "Tarefa"
    text: "Estruturar uma experiência simples, confiável e acessível para encontrar ajuda e concluir inscrições sem fricção."
  - label: "Ação"
    text: "Criei wireframes, organizei fluxos principais, defini hierarquia de conteúdo, desenhei a interface no Figma e implementei a solução em WordPress + Elementor porque o projeto precisava de uma base editável e fácil de manter."
  - label: "Resultado"
    text: "Mais de <strong>200 agricultores inscritos</strong> nos primeiros meses, com <strong>68%</strong> dos inscritos participando de ao menos um webinar ao vivo."
metrics:
  - value: "+200"
    label: "mais de 200 agricultores inscritos nos primeiros meses"
    icon: "trend"
  - value: "68%"
    label: "participaram de ao menos um webinar ao vivo"
    icon: "time"
  - value: "6 sem."
    label: "da estrutura inicial ao site em produção"
    icon: "calendar"
learningsTitle: "O que este projeto prova"
learnings:
  - icon: "alert"
    text: "<strong>Consigo projetar para contextos em que clareza é parte do impacto.</strong> A experiência foi construída para guiar cada visitante até a ajuda disponível sem esforço extra."
  - icon: "grid"
    text: "<strong>UX também é critério ético.</strong> Em públicos vulneráveis, cada clique a mais e cada ambiguidade têm custo real. Simplificar aqui foi responsabilidade."
  - icon: "trend"
    text: "<strong>Sei priorizar estrutura antes de camada visual.</strong> O valor do projeto esteve em organizar fluxo, conteúdo e compreensão para que o serviço funcionasse de verdade."
roleGroups:
  - label: "Papel"
    tags:
      - "Designer de experiências digitais"
  - label: "Skills"
    tags:
      - "Acessibilidade"
      - "Usabilidade"
      - "Clareza de fluxo"
  - label: "Ferramentas"
    tags:
      - "Figma"
      - "WordPress"
      - "Elementor"
  - label: "Métodos"
    tags:
      - "Design responsivo"
      - "Fluxos de inscrição"
      - "Arquitetura de informação"
  - label: "Duração"
    tags:
      - "6 semanas"
projectNav:
  backHref: "/#projetos"
  backLabel: "Todos os Projetos"
  prev:
    href: "/projetos/bit-system/"
    label: "Projeto anterior"
    title: "Bit System"
  next:
    href: "/projetos/olho-vivo/"
    label: "Próximo Projeto"
    title: "Olho Vivo"
---

{% caseSection "Contexto", "Levar suporte real<br>a quem mais precisa.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        A Irlanda enfrenta uma das maiores taxas de suicídio entre agricultores da Europa. Isolamento geográfico, estigma em relação à saúde mental e dificuldade de acesso a especialistas formam uma combinação silenciosa e devastadora.
      </p>
      <p class="cs-body-copy" data-animate data-delay="2">
        O Farm Well Hub é uma iniciativa do governo irlandês que oferece informação, apoio direto e conexão com especialistas por meio de webinars acessíveis. O trabalho pedia menos brilho visual e mais responsabilidade de produto.
      </p>
{% endcaseSection %}

{% caseSection "Diagnóstico", "O que o contexto<br>exigia da solução", "section cs-farm-diagnosis-section cs-dark", "dark" %}
<div class="cs-farm-diagnosis" style="margin-top: var(--space-10);">

        <div class="cs-farm-diagnosis__card" data-animate>
          <span class="cs-farm-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16"/><path d="M14 6l6 6-6 6"/></svg>
          </span>
          <p class="cs-farm-diagnosis__title">Caminho único</p>
          <p class="cs-farm-diagnosis__text">Uma rota principal para entender o suporte, encontrar webinars e concluir a inscrição.</p>
        </div>

        <div class="cs-farm-diagnosis__card" data-animate data-delay="1">
          <span class="cs-farm-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
          </span>
          <p class="cs-farm-diagnosis__title">Baixa fricção</p>
          <p class="cs-farm-diagnosis__text">Menos etapas, linguagem direta e chamadas para ação fáceis de reconhecer.</p>
        </div>

        <div class="cs-farm-diagnosis__card" data-animate data-delay="2">
          <span class="cs-farm-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </span>
          <p class="cs-farm-diagnosis__title">Confiança</p>
          <p class="cs-farm-diagnosis__text">Sinais institucionais, tom acolhedor e estrutura previsível antes de pedir qualquer dado.</p>
        </div>

      </div>

      <figure data-animate style="margin: var(--space-12) auto 0; max-width: 560px;">
        <img
          src="/assets/projetos/farm-well-hub/Wireframe-template-1.webp"
          alt="Wireframe do Farm Well Hub mostrando estrutura de navegação e hierarquia de conteúdo"
          class="cs-img-dark"
          loading="lazy"
        >
        <figcaption class="cs-figcaption">Wireframe usado para organizar fluxo e hierarquia antes da camada visual</figcaption>
      </figure>
{% endcaseSection %}

{% caseSection "Objetivo", "Como criar uma experiência digital <strong>verdadeiramente acessível</strong> para um público vulnerável, com baixo letramento digital, que precisa agir com o mínimo de fricção?", "cs-context section cs-dark", "dark" %}
<div class="cs-gargalos">
        <h2 class="cs-gargalos__title section-title">4 princípios do projeto</h2>
        <ul class="cs-gargalos__list" role="list">
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">1</span>
            <p class="cs-gargalos__text"><strong>Menos opções aumentam a ação.</strong> Para usuários com baixo letramento digital, múltiplas rotas criam paralisia.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">2</span>
            <p class="cs-gargalos__text"><strong>Hierarquia clara reduz ansiedade.</strong> A página precisava deixar óbvio o que fazer a seguir.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">3</span>
            <p class="cs-gargalos__text"><strong>Acessibilidade também é simplificação.</strong> Contraste e tamanho importam, mas reduzir passos também é acessibilidade.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">4</span>
            <p class="cs-gargalos__text"><strong>Confiança vem antes da inscrição.</strong> O usuário precisava sentir segurança antes de inserir qualquer dado pessoal.</p>
          </li>
        </ul>
      </div>
{% endcaseSection %}

{% caseSection "Hipóteses", "Estrutura antes<br>da camada visual", "cs-process section", "light" %}
<div class="section-header" data-animate>
        
      </div>

      <p class="cs-body-copy" data-animate data-delay="1">
        Mesmo sem uma fase aprofundada de pesquisa, os wireframes foram necessários para decidir navegação, hierarquia e prioridade de ações antes de discutir aparência.
      </p>

      <figure class="cs-figure-frame" data-animate data-delay="2">
        <img
          src="/assets/projetos/farm-well-hub/cores-2048x1815.webp"
          alt="Paleta de cores do Farm Well Hub com tons de verde e documentação de uso"
          loading="lazy"
        >
      </figure>
{% endcaseSection %}

{% caseSection "Decisões de projeto", "Da estrutura<br>ao serviço em produção", "cs-comparisons section", "light" %}
<div class="section-header" data-animate>
        
      </div>

      <p class="cs-body-copy" data-animate data-delay="1" style="margin-bottom: clamp(40px, 5vw, 64px);">
        Cada tela foi pensada para reduzir dúvida, aumentar confiança e deixar a inscrição em webinars mais simples para um público que não podia depender de interfaces complexas.
      </p>

      <div class="cs-comparison-list">

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 01 · Navegação</p>
            <h3 class="cs-comparison__title">Fluxo definido antes da interface</h3>
            <p class="cs-comparison__note">Os wireframes ajudaram a definir o caminho principal: entender o serviço, encontrar webinars e concluir inscrição sem rotas concorrentes.</p>
          </div>
          <div class="cs-comparison__images">
            <div class="cs-comparison__side">
              <span class="cs-comparison__badge cs-comparison__badge--before">Estrutura</span>
              <img src="/assets/projetos/farm-well-hub/Wireframe-template-1.webp" alt="Wireframe do Farm Well Hub com estrutura de navegação" class="cs-comparison__img" loading="lazy">
            </div>
            <div class="cs-comparison__side">
              <span class="cs-comparison__badge cs-comparison__badge--after">Interface</span>
              <img src="/assets/projetos/farm-well-hub/FarmWell.webp" alt="Interface final do Farm Well Hub aplicada a partir da estrutura" class="cs-comparison__img" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 02 · Identidade visual</p>
            <h3 class="cs-comparison__title">Acolhimento sem perder legibilidade</h3>
            <p class="cs-comparison__note">A paleta e a tipografia foram escolhidas para comunicar bem-estar, pertencimento ao ambiente rural e leitura confortável para públicos mais velhos.</p>
          </div>
          <div class="cs-comparison__images cs-comparison__images--single">
            <div class="cs-comparison__side">
              <span class="cs-comparison__badge cs-comparison__badge--before">Sistema visual</span>
              <img src="/assets/projetos/farm-well-hub/cores-2048x1815.webp" alt="Sistema visual do Farm Well Hub com paleta de cores" class="cs-comparison__img" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 03 · Inscrição</p>
            <h3 class="cs-comparison__title">Webinars com caminho claro</h3>
            <p class="cs-comparison__note">A estrutura de webinars priorizou descoberta rápida, leitura objetiva e inscrição com poucos passos, evitando que o usuário precisasse interpretar a interface.</p>
          </div>
          <div class="cs-comparison__images">
            <div class="cs-comparison__side">
              <span class="cs-comparison__badge cs-comparison__badge--before">Mockup</span>
              <img src="/assets/projetos/farm-well-hub/farm-well-hub-img2-1-2048x1365.webp" alt="Mockup do Farm Well Hub com página de webinars" class="cs-comparison__img cs-comparison__img--mockup" loading="lazy">
            </div>
            <div class="cs-comparison__side">
              <span class="cs-comparison__badge cs-comparison__badge--after">Mockup</span>
              <img src="/assets/projetos/farm-well-hub/mockup-03-1-2048x1152.webp" alt="Mockup do Farm Well Hub mostrando a interface em desktop" class="cs-comparison__img cs-comparison__img--mockup" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 04 · Escalabilidade</p>
            <h3 class="cs-comparison__title">Estrutura pronta para crescer</h3>
            <p class="cs-comparison__note">O site foi organizado de forma modular para receber novos conteúdos, webinars e páginas sem comprometer clareza ou consistência.</p>
          </div>
          <div class="cs-comparison__images cs-comparison__images--single">
            <div class="cs-comparison__side cs-comparison__side--plain">
              <img src="/assets/projetos/farm-well-hub/telas-farm-well-1.webp" alt="Conjunto de telas do Farm Well Hub" class="cs-comparison__img cs-comparison__img--screen-row" loading="lazy">
            </div>
          </div>
        </div>

      </div>
{% endcaseSection %}

{% caseSection "Resultado", "Adoção inicial<br>com baixa fricção", "cs-results cs-results--farm section cs-dark", "dark" %}
<div class="cs-metrics" style="margin-top: var(--space-10);">
        <div class="cs-metric cs-farm-result-card" data-animate>
          <span class="cs-farm-result-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </span>
          <span class="cs-metric__value">+200</span>
          <span class="cs-metric__label">mais de 200 agricultores inscritos na plataforma nos primeiros meses após o lançamento</span>
        </div>
        <div class="cs-metric cs-farm-result-card" data-animate data-delay="1">
          <span class="cs-farm-result-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2"/>
              <path d="m10 9 5 3-5 3V9z"/>
            </svg>
          </span>
          <span class="cs-metric__value">68%</span>
          <span class="cs-metric__label">dos inscritos participaram de ao menos um webinar ao vivo</span>
        </div>
        <div class="cs-metric cs-metric--word cs-farm-result-card" data-animate data-delay="2">
          <span class="cs-farm-result-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
              <path d="m8 11 2.5 2.5L16 8"/>
            </svg>
          </span>
          <span class="cs-metric__value">positivo</span>
          <span class="cs-metric__label">feedbacks indicando navegação clara e facilidade para encontrar ajuda rapidamente</span>
        </div>
      </div>

      <figure data-animate style="margin: var(--space-12) auto 0;">
        <img
          src="/assets/projetos/farm-well-hub/telas-farm-well-1.webp"
          alt="Conjunto de telas do Farm Well Hub mostrando diferentes páginas da plataforma"
          class="cs-img-dark"
          loading="lazy"
        >
        <figcaption class="cs-figcaption">Conjunto de telas do serviço digital em produção</figcaption>
      </figure>
{% endcaseSection %}
