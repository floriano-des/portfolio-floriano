# Case Mercado das Figurinhas

## Leitura e implementação

O Mercado usa uma página única para recrutadores de Product Design: resumo inicial, oito seções com âncoras e aprofundamentos nativos `<details>`. Problema, atuação, decisões, validação, resultados e aprendizados permanecem visíveis.

- Conteúdo: `src/projetos/mercado-das-figurinhas.njk`.
- Estilos: regras específicas de `.mercado-case-page` em `src/css/case-study-immersive.css`.
- Interações: `data-case-reading="progressive"` dispensa os modos em `src/js/case-study-immersive.js`.
- O índice mantém os links no HTML: lateral no desktop a partir de 1180 px, expansível no fluxo em telas menores. Sem JavaScript, o índice é aberto e continua funcional.
- Os aprofundamentos começam fechados e funcionam por teclado sem JavaScript. Galerias e lightbox preservam o comportamento compartilhado.
- `?mode=tldr` e `?mode=detailed` mostram o mesmo conteúdo; o Mercado não lê nem altera `portfolio-case-mode`.
- Os demais cases mantêm seus modos. Nenhuma API do aplicativo, banco ou cobrança foi alterada.
- Permalink, capa, identidade visual, navegação de saída e metadados são preservados. Os resumos da home, dados do case e `llms.txt` foram sincronizados.
- O corpus do assistente é gerado automaticamente pelo Eleventy a partir da página; o conteúdo completo deve permanecer abaixo de 16.000 caracteres.

## Regras editoriais

A narrativa distingue hipóteses, observações, correções implementadas e efeitos medidos. Os artefatos históricos são apresentados com seu contexto; não usar suas imagens para substituir números atuais.

| Informação | Tratamento aprovado |
| --- | --- |
| Objetivo | Receita durante a Copa e experiência de construir um produto do zero. |
| Período | Fevereiro–julho de 2026; lançamento em 9 de maio. |
| Meta | 30 matches encaminhados ao WhatsApp nos primeiros 15 dias. |
| WhatsApp | Não há contagem diretamente confirmada nas fontes inspecionadas. Aceite é sinal intermediário; troca física fora do alcance do produto. |
| Usuários | Cerca de 100, número arredondado informado pelo autor; não declarar 100 exatos ou usuários ativos. |
| Receita | Dois assinantes de um mês a R$ 9,99; R$ 19,98 brutos. |
| Oferta | 14 dias gratuitos. O valor de três dias encontrado em código não representa a oferta final confirmada pelo autor. |
| Testes | Cinco pessoas reais: cadastro, onboarding, primeiras figurinhas e matching. Não houve nova rodada com usuários após os ajustes. |
| Interface | Bandeiras e avisos dentro do aplicativo respondem aos achados. Não alegar Web Push ou ganho quantitativo sem reteste. |
| Qualidade | IA na análise de código; autor nos testes manuais de telas, navegação e fluxos. Sem inventar uma rubrica histórica. |
| Catálogo | Figurinhas não marcadas eram consideradas faltantes. Não afirmar 980 marcações obrigatórias. |
| Clarity | Após o lançamento, identificação do problema mobile com “Meu Catálogo”; ajuste manual para “Catálogo”. Sem captura anterior ou ganho medido. |
| Grupos | Sete grupos, aproximadamente 3,6 mil membros somados; membros não equivalem a participantes de pesquisa e podem se repetir. |
| Abordagem | Autor apresentava o produto como app encontrado e usado, sem explicitar autoria. Uso dos respondentes não verificado. |
| Síntese | Reações informais e possíveis barreiras à proposta, sem comprovar causa do abandono. Perfil refinado, sem “persona real” validada. |
| Pesquisa pendente | Questionário inicial e entrevistas posteriores com usuários ativos não foram realizados. |
| Futuro | Entrevistas/observação e piloto local são propostas não executadas. Nativo e monetização alternativa permanecem hipóteses. |
| Status | Operação encerrada, site ainda online. |

## Proveniência dos resultados

Consolidação de declarações do autor, código do aplicativo e consulta somente de leitura ao Neon, em outubro de 2026.

- Primeiros 15 dias: `2026-05-09 00:00 America/Sao_Paulo` até `2026-05-24 00:00`, exclusivo. A base preservada tem 17 novos cadastros, uma busca e nenhuma solicitação.
- Depois do lançamento: nove solicitações e dois aceites no conjunto preservado, sem classificação concluída de testes. Não publicar como dois encaminhamentos reais.
- A base inclui registros de teste anteriores ao lançamento e cadastros posteriores à operação. Contagens atuais não formam um funil histórico e não devem ser somadas entre recortes.
- O handler de WhatsApp inspecionado abre `wa.me`, sem evento explícito ou escrita no banco nesse handler. Configurações externas de analytics não foram integralmente inspecionadas; não alegar ausência de tracking em todas as ferramentas.
- Histórico do aplicativo documenta correções de necessidades implícitas no matching (2 de maio), cancelamento de assinatura (5 de maio), adição do Clarity (20 de junho) e alteração do rótulo (21 de junho). Histórico comprova implementação, não efeito em usuários.

## Financeiro

Valores conforme relato do autor, com cerca de dois meses de infraestrutura como estimativa de memória.

| Item | Valor |
| --- | ---: |
| Receita bruta | R$ 19,98 |
| Servidor e banco: 2 × (R$ 100 + R$ 10) | R$ 220,00 |
| Domínio | R$ 40,00 |
| Impulsionamento | R$ 100,00 |
| Despesas diretamente atribuíveis estimadas | R$ 360,00 |
| Saldo parcial | −R$ 340,02 |

Saldo exclui taxas, horas e ferramentas compartilhadas. IA: cinco pagamentos de R$ 100, total R$ 500, com uso em outros projetos e sem rateio confiável. Não calcular ROI total somando todo o gasto compartilhado ao projeto.

## Verificação

Executar `npm run build` e conferir:

- 320, 390, 768 e 1366 px: limites dos componentes, capa e tabela financeira.
- Resumo de 120–180 palavras; oito seções; dez aprofundamentos fechados inicialmente.
- Teclado: Enter/Espaço nos aprofundamentos, foco visível, índice, setas na galeria, lightbox com Escape e devolução de foco.
- Sem JavaScript: conteúdo principal, índice e expansões nativas.
- Movimento reduzido: conteúdo legível, sem depender dos reveals.
- Ambos os parâmetros antigos de modo e preferências salvas.
- Quantum Vizz: troca de modos e zoom. Olho Vivo: preferência salva.
- Imagens locais e links internos, metadados e corpus completo.

Validação local em 6 de outubro de 2026: build e sintaxe de JavaScript aprovados; quatro larguras sem transbordamento; teclado, modos legados, outros cases e leitura sem JavaScript aprovados. Resumo com 141 palavras e corpus completo com 13.729 caracteres. A auditoria automática com movimento reduzido também foi inspecionada; os avisos de landmark e título vieram do documento vazio do iframe externo de vídeo, não do documento do case.
