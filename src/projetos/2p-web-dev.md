---
layout: case-study-md.njk
permalink: /projetos/2p-web-dev/
title: "Web Dev 2.0 · Estudo de caso · Floriano Silva"
description: "Como substituí uma planilha pública por um sistema interno seguro, escalável e usado diariamente pela operação da agência."
projectName: "Web Dev 2.0"
bodyClass: "cs-webdev"
heroTag: "produto interno · operação · segurança · Bit System"
subtitle: "Como substituí uma planilha pública por um sistema interno seguro, escalável e usado diariamente pelo time da Dois Palitos."
summary:
  - label: "Situação"
    text: "A agência gerenciava credenciais, protocolos e dados operacionais de clientes em uma planilha pública. O fluxo era rápido para nascer, mas inseguro para escalar."
  - label: "Tarefa"
    text: "Transformar a planilha em um produto interno com autenticação, controle de acesso, histórico, organização por cliente e uma experiência que o time realmente usasse no dia a dia."
  - label: "Ação"
    text: "Mapeei os fluxos críticos, desenhei a estrutura do produto, implementei com PHP e MySQL, evoluí a interface para o Bit System v2.1.0 e conduzi iterações baseadas no uso real da equipe."
  - label: "Resultado"
    text: "O sistema entrou em produção em <strong>webdev.doispalitosmkt.com.br</strong>, passou a centralizar clientes ativos, protocolos, senhas internas, usuários e logs, com a equipe usando a ferramenta como fonte principal da operação."
metrics:
  - value: "29"
    label: "clientes ativos no dashboard operacional"
    icon: "trend"
  - value: "1.044"
    label: "tarefas de protocolo monitoradas no sistema"
    icon: "time"
  - value: "v2.0"
    label: "em produção com redesign e novas funções"
    icon: "calendar"
learningsTitle: "O que este projeto prova"
learnings:
  - icon: "alert"
    text: "<strong>Consigo transformar risco operacional em produto utilizável.</strong> O valor não estava só em esconder a planilha, mas em criar uma rotina melhor para quem depende daqueles dados."
  - icon: "grid"
    text: "<strong>Produto interno precisa ser denso e claro ao mesmo tempo.</strong> A interface não podia parecer landing page. Ela precisava ser uma ferramenta de trabalho."
  - icon: "trend"
    text: "<strong>Iteração é parte do produto, não manutenção menor.</strong> Redes sociais, campos extras, notas inline e confete de conclusão nasceram depois do uso real."
roleGroups:
  - label: "Papel"
    tags:
      - "Designer de experiências digitais"
  - label: "Skills"
    tags:
      - "UX Operacional"
      - "Arquitetura de informação"
      - "Implementação com IA"
  - label: "Ferramentas"
    tags:
      - "PHP"
      - "MySQL"
      - "AJAX"
      - "Hostinger"
      - "Bit System v2.1.0"
  - label: "Métodos"
    tags:
      - "Discovery"
      - "Arquitetura de informação"
      - "Interface"
      - "Deploy"
projectNav:
  backHref: "/#projetos"
  backLabel: "Todos os Projetos"
  prev:
    href: "/projetos/quantum-vizz/"
    label: "Projeto anterior"
    title: "Quantum Vizz"
  next:
    href: "/projetos/mercado-das-figurinhas/"
    label: "Próximo Projeto"
    title: "Mercado das Figurinhas"
---

{% caseSection "Contexto", "Uma operação crítica presa em uma planilha.", "section", "light" %}
<p data-animate data-delay="1" class="cs-body-copy">
        A Dois Palitos precisava consultar dados de hospedagem, acessos, protocolos, senhas internas e histórico de clientes todos os dias. A solução existente era uma planilha compartilhada, fácil de editar, mas frágil do ponto de vista de segurança, rastreabilidade e experiência.
      </p>
      <p data-animate data-delay="2" class="cs-body-copy">
        O problema não era só técnico. A planilha exigia memória, paciência e contexto que não estavam na interface. Cada busca dependia de saber onde procurar, qual aba abrir e como interpretar o que estava preenchido.
      </p>
{% endcaseSection %}

{% caseSection "Diagnóstico", "O que precisava sair da planilha", "section cs-webdev-dark cs-dark", "dark" %}
<div class="cs-webdev-diagnosis">
        <div class="cs-webdev-diagnosis__card" data-animate>
          <span class="cs-webdev-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="M9 12l2 2 4-4"/></svg>
          </span>
          <h3 class="cs-webdev-diagnosis__title">Segurança</h3>
          <p class="cs-webdev-diagnosis__text">Credenciais e dados de clientes precisavam sair de um link público e entrar em um ambiente autenticado.</p>
        </div>

        <div class="cs-webdev-diagnosis__card" data-animate data-delay="1">
          <span class="cs-webdev-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <h3 class="cs-webdev-diagnosis__title">Encontrabilidade</h3>
          <p class="cs-webdev-diagnosis__text">O time precisava localizar cliente, acesso e protocolo em segundos, sem depender de rolagem e memória.</p>
        </div>

        <div class="cs-webdev-diagnosis__card" data-animate data-delay="2">
          <span class="cs-webdev-diagnosis__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </span>
          <h3 class="cs-webdev-diagnosis__title">Visibilidade</h3>
          <p class="cs-webdev-diagnosis__text">Protocolos, pendências e clientes ativos precisavam virar indicadores claros para gestão diária.</p>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Objetivo", "Como criar um produto interno seguro e simples o suficiente para ser adotado pelo time inteiro, sem virar mais uma ferramenta que ninguém usa?", "cs-context section cs-dark", "dark" %}
<div class="cs-gargalos">
        <h2 class="cs-gargalos__title section-title" style="color: var(--clr-white);">4 princípios de produto</h2>
        <ul class="cs-gargalos__list" role="list">
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">1</span>
            <p class="cs-gargalos__text"><strong>Segurança sem fricção.</strong> Autenticação e perfis eram obrigatórios, mas o fluxo precisava continuar rápido.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">2</span>
            <p class="cs-gargalos__text"><strong>Contexto antes de edição.</strong> Cada cliente precisava ter sua própria página com dados, notas, protocolos e histórico.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">3</span>
            <p class="cs-gargalos__text"><strong>Operação acima de estética.</strong> O design precisava ser denso, escaneável e feito para uso repetido.</p>
          </li>
          <li class="cs-gargalos__item">
            <span class="cs-gargalos__num" aria-hidden="true">4</span>
            <p class="cs-gargalos__text"><strong>Iteração sem cerimônia.</strong> O sistema precisava aceitar melhorias pequenas, rápidas e seguras depois do lançamento.</p>
          </li>
        </ul>
      </div>
{% endcaseSection %}

{% caseSection "Solução", "De planilha pública para sistema operacional.", "section", "light" %}
<p class="cs-body-copy" data-animate data-delay="1">
        A primeira versão substituiu o risco central: dados expostos sem autenticação. As iterações seguintes transformaram o sistema em uma ferramenta de operação, com módulos para clientes, protocolos, senhas internas, usuários, logs, campos extras e notas inline.
      </p>

      <div class="cs-webdev-feature-grid">
        <article class="cs-webdev-feature-card" data-animate>
          <span class="cs-webdev-feature-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h.01"/><path d="M11 15h.01"/><path d="M15 15h.01"/><path d="M17 9h.01"/></svg>
          </span>
          <h3>Credenciais completas</h3>
          <p>Cada rede social passou a guardar perfil, login e senha individual, com cadastro rápido direto na página do cliente.</p>
        </article>

        <article class="cs-webdev-feature-card" data-animate data-delay="1">
          <span class="cs-webdev-feature-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/><path d="M8 3v18"/></svg>
          </span>
          <h3>Campos extras</h3>
          <p>Campos customizáveis por cliente, com tipo texto, senha mascarada ou URL, usando CRUD completo via AJAX.</p>
        </article>

        <article class="cs-webdev-feature-card" data-animate data-delay="2">
          <span class="cs-webdev-feature-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>
          </span>
          <h3>Notas inline</h3>
          <p>A seção de notas deixou de exigir redirecionamento. O usuário edita, salva e continua no mesmo contexto.</p>
        </article>

        <article class="cs-webdev-feature-card" data-animate data-delay="3">
          <span class="cs-webdev-feature-card__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/><path d="M3 3h18v18H3z"/></svg>
          </span>
          <h3>Protocolos vivos</h3>
          <p>Protocolos com status, progresso, ordenação por ativos e celebração ao concluir 100% das tarefas de um cliente.</p>
        </article>
      </div>

      <div class="cs-webdev-screen-grid" data-animate>
        <img src="/assets/projetos/web-dev/webdev-senhas.webp" alt="Tela sanitizada do módulo de senhas internas do Web Dev" loading="lazy">
        <img src="/assets/projetos/web-dev/webdev-usuarios.webp" alt="Tela sanitizada do módulo de usuários do Web Dev" loading="lazy">
        <img src="/assets/projetos/web-dev/webdev-log.webp" alt="Tela sanitizada do log de atividades do Web Dev" loading="lazy">
      </div>
{% endcaseSection %}

{% caseSection "Design System", "Bit System aplicado à operação.", "section cs-webdev-dark cs-dark", "dark" %}
<p class="cs-body-copy cs-body-copy--dark" data-animate data-delay="1">
        A v2.1.0 abandonou o visual glow anterior e aproximou o sistema da identidade oficial da Dois Palitos: preto profundo, cards sólidos, neon e fuchsia como acentos, sombras pixel hard e botões sem arredondamento.
      </p>

      <div class="cs-webdev-token-grid">
        <div class="cs-webdev-token" data-animate>
          <span style="background:#100F0F;"></span>
          <p>Background<br><strong>#100F0F</strong></p>
        </div>
        <div class="cs-webdev-token" data-animate data-delay="1">
          <span style="background:#221F20;"></span>
          <p>Cards<br><strong>#221F20</strong></p>
        </div>
        <div class="cs-webdev-token" data-animate data-delay="2">
          <span style="background:#00FFD1;"></span>
          <p>Neon<br><strong>#00FFD1</strong></p>
        </div>
        <div class="cs-webdev-token" data-animate data-delay="3">
          <span style="background:#FF00FF;"></span>
          <p>Fuchsia<br><strong>#FF00FF</strong></p>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Decisões de produto", "O que mudou na prática", "cs-process section", "light" %}
<div class="section-header" data-animate>
        
        
      </div>

      <div class="cs-comparison-list">
        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 01 · Dashboard</p>
            <h3 class="cs-comparison__title">Ativos primeiro, ruído depois</h3>
            <p class="cs-comparison__note">O dashboard passou a destacar clientes ativos, protocolos concluídos, pendências e usuários em atividade. Total e inativos viraram informação secundária.</p>
          </div>
          <div class="cs-comparison__images cs-comparison__images--single">
            <div class="cs-comparison__side cs-comparison__side--plain">
              <img src="/assets/projetos/web-dev/webdev-dashboard.webp" alt="Dashboard sanitizado do sistema Web Dev com indicadores operacionais" class="cs-comparison__img cs-webdev-media" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 02 · Clientes</p>
            <h3 class="cs-comparison__title">Detalhe do cliente como centro da operação</h3>
            <p class="cs-comparison__note">A página do cliente concentrou credenciais, redes sociais, campos extras, notas inline e botão de voltar contextual, reduzindo dependência do navegador e da memória do time.</p>
          </div>
          <div class="cs-comparison__images cs-comparison__images--single">
            <div class="cs-comparison__side cs-comparison__side--plain">
              <img src="/assets/projetos/web-dev/webdev-clientes.webp" alt="Lista sanitizada de clientes ativos no sistema Web Dev" class="cs-comparison__img cs-webdev-media" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 03 · Protocolos</p>
            <h3 class="cs-comparison__title">Status operacional em tempo real</h3>
            <p class="cs-comparison__note">A tela de protocolos passou a ordenar clientes ativos primeiro, mostrar progresso e permitir atualização de status sem transformar a rotina em tarefa administrativa pesada.</p>
          </div>
          <div class="cs-comparison__images cs-comparison__images--single">
            <div class="cs-comparison__side cs-comparison__side--plain">
              <img src="/assets/projetos/web-dev/webdev-protocolos-cliente.webp" alt="Tela sanitizada de protocolos por cliente no sistema Web Dev" class="cs-comparison__img cs-webdev-media" loading="lazy">
            </div>
          </div>
        </div>

        <div class="cs-comparison" data-animate>
          <div>
            <p class="cs-comparison__label">Decisão 04 · Infraestrutura</p>
            <h3 class="cs-comparison__title">Produção mais previsível</h3>
            <p class="cs-comparison__note">A migração para webdev.doispalitosmkt.com.br veio com banco dedicado, ambiente local espelhado e deploy seletivo via SSH preservando o config.php de produção.</p>
          </div>
          <div class="cs-webdev-stack">
            <div>
              <span>Local</span>
              <strong>PHP + MySQL</strong>
            </div>
            <div>
              <span>Deploy</span>
              <strong>PowerShell + PSCP</strong>
            </div>
            <div>
              <span>Produção</span>
              <strong>Hostinger + banco dedicado</strong>
            </div>
          </div>
        </div>
      </div>
{% endcaseSection %}

{% caseSection "Resultado", "Sistema interno em produção e em uso real", "cs-results cs-results--webdev section cs-dark", "dark" %}
<div class="cs-metrics" style="margin-top: var(--space-10);">
        <div class="cs-metric" data-animate>
          <span class="cs-metric__value">100%</span>
          <span class="cs-metric__label">do time usando o sistema como fonte principal da operação</span>
        </div>
        <div class="cs-metric" data-animate data-delay="1">
          <span class="cs-metric__value">v2.0</span>
          <span class="cs-metric__label">redesign visual e funcionalidades novas já em produção</span>
        </div>
        <div class="cs-metric" data-animate data-delay="2">
          <span class="cs-metric__value">0</span>
          <span class="cs-metric__label">dependência da antiga planilha pública para o fluxo principal</span>
        </div>
      </div>

      <figure data-animate style="margin: var(--space-12) auto 0;">
        <video
          src="/assets/projetos/web-dev/2026-03-18-01-18-24.mp4"
          controls
          style="width: 100%; border-radius: 8px; border: 1px solid rgba(255,255,255,.1);"
          preload="metadata"
        ></video>
        <figcaption class="cs-figcaption">Registro da versão anterior do sistema, antes das iterações visuais e funcionais mais recentes</figcaption>
      </figure>
{% endcaseSection %}
