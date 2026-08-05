# Mercado das Figurinhas — Estudo de caso

> Export em markdown do conteúdo publicado em `/projetos/mercado-das-figurinhas/`.
> Versão revisada após os apontamentos do sênior. Contém as duas versões do case:
> **Detalhado** e **Resumo**.

- **Meu papel:** Product Designer
- **Período:** Fevereiro a Julho (do zero ao lançamento e à iteração).
- **Link:** https://mercadodasfigurinhas.com.br

---

## Versão Detalhada

**Lançamento de um app web de trocas de figurinhas da Copa 2026. Um case de Product Design que mudou minha forma de enxergar a construção de produtos.**

### Visão Geral

- **Time:** Começou com 1 Product Designer (eu) e 1 Desenvolvedor full-stack, e virou projeto solo.
- **Métodos:** Desk research, análise competitiva, beta fechado e pesquisa de campo pós-lançamento.
- **Ferramentas:** Figma, FigJam, Google Analytics, Microsoft Clarity, Codex e Claude Code.
- **Principal aprendizado:** Base com 100 usuários, dois pagantes e um aprendizado brutal sobre pesquisa com usuários.

*[Imagem: tela inicial do app assim que logado]*

> Eu esperava um lançamento estrondoso, cometi um erro de processo logo no início e o resultado ficou bem diferente do que imaginei. No entanto, consegui entender o motivo, e isso mudou a forma como eu vejo a construção de produtos.

### 1. O contexto e o problema

A ideia surgiu de uma conversa com meu amigo e desenvolvedor Cristiano. A Copa estava chegando e decidimos lançar algo relacionado a ela.

Eu venho de agência de marketing, com um histórico de construir sites e e-commerces. É um trabalho que gosto, mas o ciclo é curto: você entrega, vai para o ar e raramente descobre se aquilo deu certo de verdade. O Mercado das Figurinhas era minha chance de fazer um produto de ponta a ponta, de longo prazo, do qual eu pudesse acompanhar o impacto real.

Completar álbuns sempre foi uma tarefa complicada para colecionadores. Em uma pesquisa prévia, percebemos que as soluções online eram ruins. A melhor era um app nativo genérico que apenas catalogava o álbum, mas não ajudava a trocar. Então pensamos: que tal fazer um "Tinder das figurinhas"?

**A hipótese inicial:** Se existisse um sistema de matching conectando automaticamente quem tem a figurinha repetida com quem precisa dela, trocar ficaria muito mais fácil e completar o álbum seria muito mais barato. O que eu não sabia naquele momento é que trocar figurinha não é só um problema a ser resolvido. É um ritual cultural: as pessoas gostam de se encontrar para trocar, gostam da bagunça dos grupos, gostam do encontro presencial. Eu enxergava uma ineficiência onde havia parte da graça. Essa cegueira definiu o projeto inteiro.

**Restrições e métricas:**

- Time minúsculo e tempo curto. A ideia surgiu em fevereiro e precisava estar online em abril.
- Por limitações financeiras e de tempo, lançar um app nativo era inviável. Seguimos no modelo de app web.
- Métrica de sucesso definida: ativação (ter usuários efetivamente usando o sistema de trocas).

### 2. A descoberta e a armadilha do Desk Research

A primeira fase foi entender o tamanho do mercado e os concorrentes.

*[Pesquisa inicial — 13 páginas de desk research]*

Descobri que o mercado brasileiro representa cerca de 40% das vendas globais da Panini em anos de Copa. Neste ano, as figurinhas ficariam mais caras e o álbum seria o maior da história. Completar só comprando poderia ultrapassar R$ 4.000, tornando as trocas uma necessidade.

Os apps existentes sofriam com travamentos e interfaces datadas. Além disso, as trocas aconteciam em grupos de WhatsApp bagunçados. Não existia nenhum sistema de matching parecido com o Tinder para figurinhas. Essa informação acabou me enviesando.

Toda a minha descoberta foi baseada em dados secundários (Desk research e análise competitiva). Eu cheguei a montar um survey quantitativo completo para validar hipóteses, mas ele dependia de um banco de dados que ficou sob responsabilidade do meu parceiro dev e que nunca veio. Fiquei duas semanas travado esperando, e a pesquisa quantitativa nunca rodou.

Só que usar isso de desculpa não fecha. A entrevista qualitativa não precisava de banco nenhum: precisava de umas oito pessoas e um roteiro. Aquelas duas semanas de espera eram exatamente a janela para conversar com usuários, e eu não conversei. Foi uma decisão minha, empurrada pelo prazo, e foi errada.

*[Imagem: pesquisa Trocaê que não foi aplicada. Legenda: "Por estar enviesado pelos dados da pesquisa secundária, e por outros motivos, acabei não rodando essa pesquisa."]*

**O meu principal erro:** Enviesado pelos resultados animadores da desk research e pressionado pelo prazo, optei por pular a pesquisa com usuários e depois a pesquisa qualitativa, e ir direto para a definição do problema.

Eu estava tão convencido de que tinha a resposta certa que a entrevista me pareceu uma formalidade. O dado secundário te diz o tamanho do mercado, mas não te diz o significado emocional do comportamento das pessoas.

### 3. Síntese e definição do problema

A partir da desk research, criei a proto-persona "O Trocador Estrategista".

*[Imagens: proto-persona e mapa de empatia do Trocador Estrategista]*

Cheguei a explorar o "Pai/Mãe Coletor", mas descartei a ideia. Mirar nesse público deixaria a plataforma atraente para crianças e, como o fluxo terminava abrindo o WhatsApp de um estranho para o outro, isso abria um risco real de segurança e um problema jurídico. Pelo mesmo motivo, deixei a criação de um chat interno fora do escopo.

*[Imagem: proto-persona descartada]*

Para entender o caminho do usuário, montei uma jornada completa e criei uma matriz de priorização. Um detalhe importante dessa matriz é que o "app nativo" foi colocado em baixo impacto. E aqui preciso ser justo com os fatos: nativo também era uma restrição real de orçamento e prazo naquele momento, então não dá pra jogar tudo na matriz. O erro, esse sim, foi de julgamento. Eu presumi que, se boa parte do público acessa até apps de aposta direto pelo navegador, um webapp bastaria aqui também. Foi uma suposição minha, sem base, que ignorava um detalhe: este público específico troca por app nativo. Foi nesse julgamento que eu mais errei, como descobri depois.

*[Imagens: jornada do usuário e matriz de priorização. Legenda: "Na matriz que eu tinha criada, fica claro que o 'app nativo' foi descartado."]*

### 4. Prototipação com IA e Desenvolvimento Solo

Logo no começo, o desenvolvedor parceiro precisou se afastar aos poucos. Eu não quis abandonar a ideia e levei o projeto de ponta a ponta sozinho.

A primeira decisão de design foi de recorte. Como é um app prático, apostei no essencial: ao logar, o usuário cai num pequeno dashboard que ensina a plataforma e já emenda no que importa — preencher o catálogo e procurar match. A régua era tempo até o valor: cerca de cinco minutos do cadastro ao primeiro uso funcional. Tudo que competia com isso saiu da frente.

A interação mais sensível era o match, e aí eu decidi **não** ir direto ao ponto, de propósito. Quando dá match, chega uma notificação, a tela mostra o par e pede uma confirmação explícita antes de qualquer contato, com um aviso claro sobre os riscos de abrir conversa com um estranho. É a mesma preocupação que me fez tirar o chat interno e a persona infantil do escopo: num fluxo que termina jogando o WhatsApp de um lado no do outro, segurança é decisão de design, não detalhe.

Para acelerar, gerei as telas com IA (Claude Code e Codex) e defini a identidade e os tokens (fontes e cores) apoiado no Figma. Mas o refinamento de verdade não foi visual, foi de código, versionado no git/GitHub. A primeira entrega da IA era um frankenstein: funcionava pela metade (o match travava dependendo das regras), com layout simples demais, sem identidade, e seções, espaçamentos e fontes cada um puxando pra um lado. Meu trabalho foi esse — apontar, commit a commit, o que estava errado e como consertar, até virar uma interface coerente. A versão crua que eu rejeitei está lá no histórico. Só depois desse refino levei o produto pro teste de usabilidade, e aí sim as pessoas usaram sem tropeçar.

*[Galeria de telas: Dashboard, Catálogo, Selecionar figurinha, Match!]*

### 5. Testes de usabilidade

Usei teste de usabilidade moderado com 5 pessoas para avaliar o sistema de match em tempo real. Houve dois problemas principais:

1. O sistema de match estava lento e não deixava claro o que aconteceria em seguida, ferindo a heurística de visibilidade do status do sistema. Substituí o "sino" de aviso por notificações push, melhorando muito a experiência.
2. Dois usuários tiveram dificuldade para entender o álbum porque os nomes dos países apareciam em código. Adicionei a bandeira de cada país, o que deixou tudo mais rico visualmente e facilitou o cadastro.

*[Vídeo: teste de usabilidade]*

### 6. Lançamento e o funil da verdade

O lançamento ocorreu em 9 de maio. Preparei toda a infraestrutura (Vercel, Neon, Stripe) e criei a identidade visual completa e as campanhas para redes sociais.

O sistema rodou perfeitamente e sem reclamações. O Microsoft Clarity confirmou que não havia problemas de usabilidade.

No entanto, ao montar um funil de ativação pós-lançamento, a dura realidade apareceu.

*[Imagem: funil de ativação]*

O funil deixou claras as duas paredes que o produto bateu: pedir cerca de 980 marcações logo de cara matava o fluxo, e o problema do "cold start" (se a cidade do usuário estava vazia, ele via zero matches e sumia). Sem massa crítica, o coração do produto não tinha como acender. A meta de ativação não foi batida.

Sendo honesto, o cold start é o empty state mais previsível de um produto de rede, e eu até tinha uma resposta para a cidade vazia: a tela pedia para o usuário aumentar o raio de busca. Minha leitura do funil, na época e ainda hoje, é que o gargalo do cold start foi de aquisição. A plataforma rodava e o match funcionava, mas faltou densidade de usuários por região para o sistema ter com quem casar. Um lançamento mais forte e escalonado, trazendo massa crítica cidade a cidade, teria dado combustível para um motor que já estava pronto. Esse foi o meu erro aqui: subestimei o quanto o produto dependia de gente chegando junta e não tratei o lançamento com esse cuidado.

### 7. O campo e a verdadeira persona

Com o baixo uso do sistema de matching, fiz aquilo que deveria ter feito no começo: fui a campo. Entrei em sete grupos de troca de figurinhas no WhatsApp, de diferentes regiões — do ABC paulista a Belo Horizonte, passando pelo Vale do Paraíba e por Campos —, somando mais de 3,6 mil membros. Ali eu observei o comportamento real das pessoas e puxei conversa no fluxo dos grupos.

E preciso ser honesto sobre o método: isso não foi entrevista estruturada. Os grupos eram muito movimentados (um deles acumulava mais de mil mensagens entre uma visita e outra), então não tenho um número fechado de quantas conversas puxei ou de quantas pessoas me responderam. Foi observação de campo, com todas as limitações que isso carrega — o ideal ainda seria rodar as entrevistas com roteiro que faltaram lá no começo. Ainda assim, o padrão que apareceu era grande demais para ignorar.

A resposta era unânime: as trocas ou acontecem presencialmente, ou através de app nativo. A bagunça do WhatsApp e o encontro na praça não são um problema, **são parte da graça**. É assim que esse mundo funciona.

Foi só então que consegui montar a persona real, aquela que o projeto pedia desde o primeiro dia: O Trocador de Comunidade.

*[Imagens: persona e mapa de empatia do Trocador de Comunidade]*

O contraste com a minha persona inicial é enorme. O Trocador de Comunidade coleciona há vários ciclos, vê o álbum como desculpa para o convívio e prefere app nativo. Para ele, eficiência sem convívio não é vantagem. Essa é a pessoa que faz o mercado girar e para a qual eu não desenhei.

### 8. Aprendizados e próximos passos

Antes de listar o que errei, o que sustentou o trabalho — porque reconhecer isso também é parte do julgamento. Levei um produto real do zero ao ar sozinho: pesquisa, estratégia, UI, protótipo, desenvolvimento, deploy e analytics, tudo instrumentado com GA e Clarity. Quando a ativação não veio, o funil que montei leu o problema com precisão cirúrgica — as duas paredes (as ~980 marcações e o cold start) estavam nítidas nos dados, não no achismo. E tomei pelo menos uma decisão de escopo da qual não abro mão: cortei o chat interno e a persona "Pai/Mãe Coletor" porque o fluxo terminava jogando o WhatsApp de um estranho no de outro, um risco real de segurança e um problema jurídico. Isso é julgamento, não sorte.

Dito isso, os erros foram meus e sei nomeá-los com a mesma clareza:

- Eu pulei a etapa que mais importava. A entrevista revela onde você está errado sem perceber.
- Eu projetei a minha própria lógica no usuário — duas vezes. Tratei a troca como um problema de eficiência a ser otimizado, quando é um ritual de pertencimento; e presumi que o público se contentaria com um webapp só porque eu me contentaria. A restrição de orçamento era real, mas eu a transformei em convicção em vez de ir checar.
- Refinei o layer errado. Gastei energia puxando usabilidade (troquei o sino por push, botei bandeiras nos países) enquanto a pergunta que decidia o produto seguia sem resposta: as pessoas querem isso? O Clarity não achava problema de usabilidade nenhum, e o produto falhou mesmo assim.
- Subestimei os concorrentes. Eles também modernizaram as plataformas usando IA e lançaram apps nativos de matching.
- Errei o modelo de negócio, e esse eu poderia ter previsto antes de lançar. Cobra o valor de R$ 9,99 por mês num marketplace de duas pontas ainda sem liquidez é cobrar ingresso de sala vazia. O campo só confirmou o que a estratégia já dizia: o público prefere ver anúncios a investir em uma plataforma nova.

**Próximos passos concretos:**

- Validar antes de construir, sempre. Rodar de 8 a 10 entrevistas com roteiro aberto.
- Repensar a plataforma e avaliar seriamente um app nativo.
- Inverter o modelo de receita para gratuito com anúncios.
- Abraçar o presencial em vez de competir com ele, integrando-se aos grupos existentes.

Este não foi o lançamento estrondoso que eu sonhei, e me doeu ver o projeto falhar na ativação. E sou honesto: "falar com o usuário antes de construir" não é uma descoberta minha, é o primeiro capítulo de qualquer livro de produto. Eu já sabia disso na teoria. O que este projeto fez foi me obrigar a aprender na pele, gastando cinco meses e um lançamento inteiro para internalizar um fundamento que eu recitava sem viver. Saí com um respeito pelo usuário que eu não tinha antes e com a certeza de que a pergunta certa vale muito mais do que qualquer convicção minha. Sigo para o próximo desafio com uma cabeça muito mais madura e voltada ao comportamento real das pessoas.

---

## Versão Resumo (TL;DR)

**Mercado das Figurinhas: O app de trocas da Copa e a lição que mudou minha visão de produto**

### O Desafio e a Hipótese

Completar o álbum da Copa custa caro e as soluções online eram ruins. A hipótese inicial era criar um "Tinder das figurinhas". Acreditávamos que um sistema de matching automático conectando quem tem a repetida com quem precisa dela tornaria a troca mais fácil e o álbum mais barato.

**O Papel e a Execução:** O projeto começou em dupla, mas acabei assumindo de ponta a ponta, da pesquisa ao código. Por limitações de tempo e orçamento, optamos por lançar um app web com acesso pelo navegador. Construí a interface e acelerei o desenvolvimento do MVP utilizando inteligências artificiais (Claude Code e Codex) com plugins de integração ao Figma.

*[Galeria de telas: Dashboard, Catálogo, Selecionar figurinha, Match!]*

### O Lançamento e o Choque de Realidade

O app foi lançado em 9 de maio e conquistou 100 usuários, sendo dois pagantes. O sistema rodou perfeitamente, sem bugs ou problemas de usabilidade. Porém, a nossa métrica principal de ativação no sistema de trocas não foi batida.

A base esbarrou em duas barreiras claras identificadas no funil: a necessidade de marcar quase 980 figurinhas logo de cara e o "cold start" de não encontrar matches em cidades vazias.

*[Imagem: funil de ativação]*

### O Maior Aprendizado: A Falta da Pesquisa Primária

Construí o produto baseando minhas decisões apenas em Desk Research. Pulei as entrevistas com usuários porque estava convencido de que o problema era puramente logístico. Após o lançamento, fui a campo em grupos de WhatsApp e descobri a verdade:

- A troca não é uma ineficiência a ser resolvida, mas sim um ritual cultural.
- As pessoas gostam da bagunça e do encontro presencial.
- Os usuários preferem aplicativos nativos em vez de apps web.

*[Imagens: contraste entre a persona inicial (Trocador Estrategista) e a persona real (Trocador de Comunidade)]*

> Este projeto não teve o resultado financeiro ou de tração que eu sonhava, mas foi o que mais me amadureceu como Product Designer. Aprendi na pele que a pergunta certa vale muito mais do que qualquer convicção solitária.
