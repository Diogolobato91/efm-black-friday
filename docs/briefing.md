# EFM Black Friday — briefing consolidado e direção visual

Atualizado em 04/11/2026. Fonte: briefing original e correções de Diogo nesta conversa. Este documento registra a oferta confirmada e propostas de direção visual. A preparação de agentes/skills está concluída; a interface ainda não foi implementada.

## 1. Objetivo

Criar uma landing page temporária da EFM Languages / English For Me para campanha Black Friday com tráfego pago. A ação principal é iniciar atendimento no WhatsApp da campanha: **(91) 98510-6086**.

Link base: https://wa.me/5591985106086

A matrícula é concluída no atendimento. Clicar no botão não comprova matrícula nem participação efetivada no sorteio.

O briefing informa início comercial em 5 de novembro e sorteio em 10 de dezembro. A campanha está sendo preparada em novembro de 2026; confirmar ano, horário e período final antes de exibir datas completas ou contagem regressiva.

## 2. Decisões confirmadas

- São **três planos**, disponíveis nas duas modalidades: inglês e espanhol.
- Matrículas em qualquer uma das modalidades da tabela participam da promoção.
- Quantidades de aulas são mensais.
- **Não mencionar a duração de cada aula.**
- Manter as cores da EFM e adicionar preto para Black Friday.
- Trabalhar com uma apresentação muito persuasiva, coerente com os fatos da oferta.
- Regulamento fica para a etapa final de conteúdo. Não inventar condições, autorização, número de certificado ou texto definitivo.
- Para indicação, usar mensagem simples de oportunidade de concorrer; não atribuir uma quantidade de chances à indicação sem informação.
- As chances informadas por plano permanecem as aprovadas na tabela.

## 3. Planos

| Inglês | Espanhol | Aulas por mês | Mensalidade | Chances informadas por plano |
| --- | --- | ---: | ---: | ---: |
| Básico | ¡Vamos! | 4 | R$ 350,00 | 3 |
| Pro | ¡Arriba! | 8 | R$ 450,00 | 5 |
| Premium | ¡Dale! | 12 | R$ 550,00 | 7 |

Usar 4, 8 e 12 aulas **por mês**. Não converter para frequência semanal fixa nem inventar diferenças adicionais entre os planos.

Cada CTA de plano deve encaminhar ao WhatsApp com o idioma e o plano selecionados na mensagem. A alternativa de idioma não pode trocar silenciosamente o plano ou o preço.

Não usar selos como Mais vendido ou Mais escolhido sem evidência. O Pro pode receber destaque visual por decisão de layout, sem alegação de popularidade.

## 4. Oferta comercial

- Taxa inicial: **R$ 199,90**, incluindo material didático e portal do aluno.
- Primeira mensalidade: **em dezembro**, segundo o briefing.
- Não anunciar R$ 199,90 como valor total do curso.
- Bônus: **um mês do outro idioma**, com **uma aula por semana**.
- Após o período, o aluno decide se continua nos dois idiomas ou apenas no inicialmente escolhido.
- Não anunciar o segundo idioma como gratuito por todo o contrato.
- Matrícula descrita no briefing como sem fidelidade.
- Para aproveitar a premiação, o briefing exige matrícula ativa e mensalidades em dia até o mês da viagem.
- Prêmio não transferível.

Forma de cobrança após o bônus, data de viagem e detalhes não fornecidos permanecem pendentes. Não prometer continuidade gratuita nem renovação automática sem confirmação.

## 5. Intercâmbio e indicação

Prêmio descrito: intercâmbio de **duas semanas em Malta**, incluindo:
- Curso de duas semanas.
- Hospedagem.
- Seguro viagem.
- Transfer do aeroporto para a acomodação.
- **€ 200 de ajuda de custo.**

**Passagem aérea não incluída.** Exibir essa informação junto à apresentação da premiação, legível.

O sorteio está previsto para 10 de dezembro, pelo Instagram. O perfil, horário e mecânica detalhada não foram fornecidos.

Aluno que já está matriculado pode concorrer ao indicar um novo aluno. Mensagem sugerida para revisão:
“Já é aluno EFM? Indique um novo aluno e também concorra ao intercâmbio.”

Não especificar quantas chances a indicação gera nem criar condições de validação não informadas.

## 6. Referências de cores

As cores da EFM foram conferidas anteriormente nos arquivos dos sistemas. Não foi localizado manual oficial de marca. O preto abaixo é uma **proposta para a campanha**, não um novo tom institucional.

| Papel | Código | Origem / aplicação |
| --- | --- | --- |
| Azul EFM | #0D48FE | theme-color dos sistemas; blocos de marca e botões secundários |
| Azul-marinho EFM | #061938 | SVG da logo; fundos de apoio e texto sobre laranja |
| Laranja EFM | #F25C05 | SVG da logo; botão principal e destaques de benefícios |
| Branco | #FFFFFF | Logo e superfícies; títulos e texto em fundos escuros |
| Preto proposto para Black Friday | #080A0F | Fundo principal da campanha |
| Cinza claro de apoio | #F1F1F1 | Fundo existente nos sistemas; cartões claros quando necessários |
| Cinza proposto para texto secundário | #CBD5E1 | Texto de apoio sobre preto |

Fonte tipográfica: **Montserrat**, confirmada como fonte global do projeto de avaliações. Preservá-la como referência visual da campanha; não substituir pela primeira sugestão de uma base automática de fontes.

Fontes verificadas:
- https://github.com/Diogolobato91/EFM-avaliacao/blob/main/public/LOGO-AZUL-1-1.svg
- https://github.com/Diogolobato91/EFM-avaliacao/blob/main/src/index.css
- https://github.com/Diogolobato91/EFM-avaliacao/blob/main/index.html
- https://github.com/gcxmtv/efm-painel-de-controle/blob/main/index.html

Não usar a paleta da Você Global, DGSCI ou Roma News no lugar da EFM.

### Pares de contraste

Cálculo local de contraste sRGB, para cores sólidas. Não substitui verificação sobre imagens, gradientes, opacidade ou elementos renderizados.

| Uso | Texto | Fundo | Contraste aproximado |
| --- | --- | --- | ---: |
| Texto / título principal | #FFFFFF | #080A0F | 19,80:1 |
| Texto secundário | #CBD5E1 | #080A0F | 13,34:1 |
| Botão azul | #FFFFFF | #0D48FE | 6,22:1 |
| Botão laranja | #061938 | #F25C05 | 5,24:1 |

Branco sobre laranja #F25C05 tem aproximadamente 3,33:1: evitar para texto comum nos botões. Azul sobre preto também deve ser evitado para texto pequeno.

### Tokens iniciais

```css
:root {
  --efm-blue: #0D48FE;
  --efm-navy: #061938;
  --efm-orange: #F25C05;
  --bf-background: #080A0F;
  --bf-text: #FFFFFF;
  --bf-text-muted: #CBD5E1;
  --bf-light-surface: #F1F1F1;
  --bf-cta-background: var(--efm-orange);
  --bf-cta-text: var(--efm-navy);
  --bf-font: "Montserrat", sans-serif;
}
```

## 7. Direção visual proposta

Conceito: **Black Friday EFM — aprendizado que pode abrir caminho para Malta.**

- Preto predominante, identidade azul reconhecível e laranja concentrado nas ações importantes.
- Títulos de impacto, preços fáceis de comparar e leitura clara no celular.
- Imagem real e licenciada de Malta como destaque visual da oportunidade de intercâmbio.
- Fotografias decorativas não podem parecer depoimentos reais.
- Bandeiras em elementos circulares com animação discreta, sem cobrir texto ou botões.
- No celular, reduzir quantidade e movimento.
- Respeitar prefers-reduced-motion.
- Evitar vídeo pesado em reprodução automática na primeira dobra.
- Usar ícones SVG consistentes.
- Reaproveitar a logo real da EFM, sem redesenhá-la por geração de imagem.

A UI UX Pro Max apoia a seleção de padrões, tipografia, espaçamento e interação. As recomendações automáticas da base não substituem estas cores, Montserrat ou decisões do briefing.

## 8. Estratégia de persuasão

A oferta deve combinar três argumentos concretos:

1. **Aprendizado:** começar inglês ou espanhol com uma quantidade clara de aulas por mês.
2. **Benefício certo descrito:** experimentar o outro idioma durante um mês.
3. **Oportunidade adicional:** concorrer ao intercâmbio em Malta.

Apresentar o curso como produto principal e o intercâmbio como oportunidade associada. Evitar mensagens que façam parecer que toda matrícula ganha uma viagem.

Mostrar perto dos preços:
- Aulas por mês.
- Mensalidade recorrente.
- Taxa inicial separada.
- Primeira mensalidade em dezembro.
- Bônus com período definido.
- Botão com ação clara para WhatsApp.

Usar repetição de CTAs nos pontos de decisão, sem competir com várias ações diferentes.

Não inventar desconto percentual, preço anterior, urgência, vagas restantes, depoimentos, avaliações, resultados ou garantia de fluência. Não prometer aumento de conversão como resultado já medido.

### Proposta inicial de mensagem, sujeita à revisão

**Chamada principal:**
“Comece seu inglês ou espanhol e concorra a duas semanas em Malta.”

**Apoio:**
“Escolha seu plano EFM, ganhe um mês do outro idioma e deixe a primeira mensalidade para dezembro.”

**Informação comercial próxima ao botão:**
“Planos a partir de R$ 350/mês. Taxa inicial de R$ 199,90 com material didático e portal do aluno.”

**Botões possíveis:**
- Matricule-se
- Quero aproveitar a Black Friday
- Quero meu plano EFM

A expressão pedida no briefing, “Esse intercâmbio já é meu”, pode aparecer como uma chamada aspiracional junto de informação explícita de que se trata de concorrer. Não usar isoladamente como promessa de viagem garantida.

## 9. Estrutura inicial da página

1. Hero: marca, Black Friday, proposta, oferta comercial legível e CTA.
2. Benefícios: aulas online, bônus confirmado e oportunidade do intercâmbio, sem criar diferenciais não fornecidos.
3. Malta: experiência e itens da premiação, com passagem excluída em destaque.
4. Como participar: escolher modalidade/plano e concluir matrícula pelo atendimento; regras finais dependem do regulamento.
5. Planos: alternância Inglês/Espanhol com três opções e valores preservados.
6. Experiências: vídeos e depoimentos reais fornecidos e autorizados pela EFM.
7. Indicação: mensagem simples para quem já é aluno.
8. FAQ: cobrança inicial, primeira mensalidade, bônus e premiação.
9. Condições e regulamento: finalizar depois, conforme orientação de Diogo.
10. CTA final: resumo da oferta e WhatsApp.

Não renderizar vídeos falsos, botões vazios ou contadores de escassez demonstrativos na versão pública.

## 10. Agentes e skills previstos

O agente principal coordena a integração das entregas e as decisões de Diogo.

| Especialidade | Entrega | Skills de referência |
| --- | --- | --- |
| Estratégia e texto | Sequência da oferta, textos, CTAs e objeções | copywriting, page-cro |
| Design | Layout, tokens, estados e direção visual | ui-ux-pro-max, frontend-design |
| Desenvolvimento | Implementação responsiva e carregamento | web-performance-optimization, seo-fundamentals |
| Qualidade | Fluxos, celular, teclado e contraste | webapp-testing, accessibility-compliance-accessibility-audit |
| Mensuração | Eventos de intenção, planos e origem | analytics-tracking |

As nove skills da tabela estão incluídas em `.agents/skills/`, com versão de origem fixada em `docs/skills-lock.json`. Cinco agentes especialistas estão em `.codex/agents/`. A atuação depende do suporte do cliente Codex e da delegação efetiva pelo agente principal.

Fonte da UI UX Pro Max:
https://github.com/sickn33/agentic-awesome-skills/tree/48de968b4615c294de601f72268aa7be88dde863/skills/ui-ux-pro-max

## 11. Verificação prevista na implementação

- Conferir 375/390 px, 768 px e 1440 px.
- Sem rolagem horizontal e sem CTA fixo cobrindo conteúdo.
- Verificar todos os links de WhatsApp: número, idioma e plano.
- Verificar a troca de idioma e as três quantidades mensais.
- Manter valores e informações da premiação consistentes em toda a página.
- Verificar foco por teclado, contraste, alternativas textuais e movimento reduzido.
- Otimizar imagem principal, carregar vídeos sob demanda e reservar espaço para mídias.
- Eventos de clique indicam intenção; não contabilizar matrícula concluída apenas pelo clique.
- IDs de GA4/Meta Pixel e critérios de consentimento dependem da configuração fornecida pela EFM.

## 12. Pendências

- Stack da futura aplicação; o repositório agora é https://github.com/Diogolobato91/efm-black-friday.
- Assets finais de Malta e logo adequada ao fundo.
- Vídeos reais autorizados.
- Instagram, período da campanha e data/horário completos.
- Detalhes de indicação não fornecidos, sem inventar quantidade de chances.
- Informações comerciais após o mês de bônus.
- Regulamento, por último.
- Destino de hospedagem e autorização de publicação quando essa etapa chegar.

Pode-se avançar no layout, nos componentes e na redação revisável com as informações confirmadas, mantendo pendências identificadas.
