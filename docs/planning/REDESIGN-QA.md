# QA do redesign

Data da validação: 12 de junho de 2026.

## Lighthouse mobile

1. Linha de base anterior ao redesign

Performance: 67

Acessibilidade: 94

Boas práticas: 77

SEO: 100

FCP: 2,96 s

LCP: 12,10 s

2. Linha de base antes das otimizações finais

Performance: 59

Acessibilidade: 100

Boas práticas: 77

SEO: 100

FCP: 5,40 s

LCP: 9,90 s

3. Resultado final

Performance: 85

Acessibilidade: 100

Boas práticas: 77

SEO: 100

FCP: 2,37 s

LCP: 3,53 s

TBT: 102 ms

CLS: 0

Os avisos restantes em boas práticas são gerados por cookies e registros do Google Tag Manager e Microsoft Clarity. A pontuação permaneceu igual à linha de base.

## Bibliotecas vendorizadas

GSAP: 3.15.0

Fonte oficial: https://github.com/greensock/GSAP/releases/tag/3.15.0

SHA256: 92BB9A96476F983D212A2BC4F54C889039C1696DD4461D40A736860938570FBB

ScrollTrigger: 3.15.0, distribuído no mesmo release do GSAP

SHA256: B0B14D67B55B0C43C756AC0B106CFCB09D0879945F6EAD64451065B0672916A2

Lenis: 1.3.23

Fonte oficial: https://github.com/darkroomengineering/lenis/releases/tag/v1.3.23

SHA256: 1375BB5F82062A5BA4CCB2EC5B420EE41578ABF4EC04673A6BCFA6714B95F885

## Critérios verificados

1. O build do Eleventy gerou 25 arquivos sem erro.

2. Os 20 URLs publicados no sitemap respondem com HTTP 200.

3. O sitemap final tem os mesmos 20 URLs da linha de base, sem diferenças.

4. O carrossel de depoimentos contém três slides, navega pelos controles e atualiza `aria-selected`.

5. A cortina usa timeout de 2,5 s e remove o overlay mesmo se a animação falhar.

6. Sem o atributo de estado criado por JavaScript, preloader e cortina ficam ocultos por padrão.

7. A Home não antecipa todas as capas dos projetos. As miniaturas móveis usam arquivos dedicados e leves.

8. A Montserrat é servida localmente, mantendo a mesma família tipográfica sem bloquear a pintura por uma folha externa.

9. As páginas fora da Home mantêm as folhas de estilo existentes. Não houve alteração de conteúdo ou estrutura visual nas páginas legadas.

10. As páginas Home, Sobre e Quantum Vizz foram verificadas no navegador sem erros de console.
