# EFM Black Friday — instruções do projeto

## Escopo e fontes
Landing page temporária de inglês/espanhol, com tráfego pago e atendimento no WhatsApp. A oferta confirmada está em docs/briefing.md; os dados estruturados em config/campaign.json e a identidade em docs/brand.md / config/brand.json. Leia somente as referências relevantes à tarefa.
Este projeto é independente dos sistemas acadêmicos da EFM; não conectar seus bancos ou credenciais por inferência.

## Coordenação e agentes
O agente principal coordena decisões, integração e a entrega final. Para tarefas independentes, delegue aos especialistas em .codex/agents/: estrategista, designer, frontend, qualidade e mensuracao. Use até três especialistas simultaneamente. Entregas dependentes aguardam sua fonte. Defina dono e arquivos por tarefa; evite dois agentes editando os mesmos componentes. Revise o resultado antes de integrá-lo.
Se o ambiente não oferecer delegação ou não carregar agentes customizados, aplique os papéis sequencialmente e informe a limitação, sem alegar execução de subagentes. Os TOMLs não criam sessões nem permissões por si só.
Papéis, skills e saídas: docs/agents.md. Leia a SKILL.md da capacidade usada e seus recursos necessários; não carregue todas as skills em toda mudança.

## Oferta que deve ser preservada
São três planos por idioma, com 4/8/12 aulas mensais por R$350/R$450/R$550. Chances por plano: 3/5/7. Matrículas nas duas modalidades participam. Não mencionar duração das aulas. Taxa inicial R$199,90, com material e portal; primeira mensalidade em dezembro. Bônus de um mês do outro idioma, uma aula por semana. Indicação deve dizer que pode concorrer, sem quantidade inventada.
O prêmio é oportunidade de sorteio de duas semanas em Malta; passagem aérea excluída. Não tratar matrícula como viagem garantida. Regulamento foi deixado para a etapa final: avance no trabalho independente e não invente o conteúdo.
O briefing já confirmado atende à confirmação dos requisitos de redação. Não repita uma aprovação genérica porque uma skill contém um fluxo padrão. Pergunte apenas sobre lacunas que mudem a entrega, continuando o que não depender delas.

## Visual e conversão
Preserve Montserrat, logo real, azul #0D48FE, marinho #061938, laranja #F25C05 e branco; use preto proposto #080A0F na campanha. A marca prevalece sobre sugestões automáticas da UI UX Pro Max. Texto marinho no botão laranja; branco no botão azul.
Priorize leitura e contato no celular, benefícios claros, comparação dos planos, imagens reais autorizadas e CTAs nos pontos de decisão. Não fabrique descontos, depoimentos, popularidade, resultados, vagas ou urgência. Bandeiras não podem cobrir texto/controles; respeite movimento reduzido.

## Implementação e verificação
A landing page usa Vite, JavaScript e CSS, sem banco ou autenticação. Preserve a solução adotada nas próximas tarefas.
WhatsApp da campanha: 5591985106086. A seleção de idioma/plano acompanha o link; abrir o link não envia mensagem nem comprova matrícula. Analytics deve separar intenção de matrícula.
Validação desta preparação: python3 scripts/validate_setup.py, com Python 3.11+. Quando houver interface, valide os fluxos afetados, 375/390, 768 e 1440 px, teclado, contraste e movimento reduzido. O checker atual só valida configuração e referências; não certifica página, SEO, conversão ou acessibilidade.
Não executar snippets ou scripts de terceiros sem ler o código e o contexto. Preserve licenças e origem das skills; atualização de bundles exige atualizar o lock e conferir os recursos. Não usar testes com escrita nos sistemas reais da EFM.

## Entrega
Informe arquivos, verificações efetivas e pendências. Diferencie preparação, implementação, envio ao GitHub e publicação. Faça commits/push/deploy apenas quando abrangidos pela autorização vigente; o pedido atual autoriza registrar esta preparação no repositório. A preparação não publica a landing page.
