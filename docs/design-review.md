# Direção visual — Black Friday EFM

## Proposta

**Editorial de viagem com energia de campanha.** A página promove o aprendizado; Malta é o horizonte visual e uma oportunidade de sorteio. A ação principal é escolher idioma/plano e iniciar atendimento no WhatsApp. A diferenciação vem da tipografia Montserrat em escala grande, recortes fotográficos de Malta e contraste entre preto profundo, azul EFM e ações laranja. Não usar estética de aplicativo infantil nem efeitos 3D pesados.

A busca local `ui-ux-pro-max/scripts/search.py "language education travel black friday editorial dark" --design-system -p "EFM Black Friday"` foi executada. Retornou Claymorphism, verde e fontes infantis: recomendações descartadas porque conflitam com a identidade e o público deste projeto. Permanecem úteis os critérios de CTA claro, foco, alvos de toque e movimento reduzido. A direção editorial usa os princípios de `frontend-design`; não representa evidência de conversão.

## Sistema

- Fonte única: Montserrat; títulos 800–900, texto 400–500, controles 600–700. Hospedar arquivo licenciado localmente quando disponível; manter fallback sem bloquear renderização.
- Cores: `#080A0F` como base; `#0D48FE` para faixas/blocos; `#F25C05` para ações; `#061938` no texto dos botões laranja; branco no azul; `#CBD5E1` no texto secundário sobre preto.
- Ritmo: incrementos de 8 px; container de 1200 px; margem lateral 20 px no celular e 40–64 px no desktop; seções com 64–104 px verticais.
- Cartões de planos: fundo próximo ao preto, borda visível, raio 16–20 px. Pro recebe moldura azul e identificação neutra de seleção, sem selo de popularidade.
- Botões: mínimo 48 px de altura, foco visível com contorno branco e offset; hover por cor/borda, sem deslocar layout.
- Ícones: SVGs consistentes com traço simples; bandeiras SVG decorativas, não emojis ou substitutos da marca.

## Composição

### Cabeçalho e hero

Logo branca real à esquerda; links “Planos”, “Malta” e “Dúvidas” no desktop, com CTA curto. No celular, manter logo e uma ação compacta, sem menu que esconda a oferta.

Hero assimétrico: 55% texto e 45% imagem no desktop. Sobretítulo pequeno “BLACK FRIDAY EFM”; headline Montserrat `clamp(2.6rem, 5.8vw, 5.7rem)`, entrelinha 1.02 e espaçamento levemente negativo. Compor a ideia de aprender um idioma e concorrer a Malta em linhas curtas, mantendo “concorra” explícito. Apoio com 18–20 px, máximo 55 caracteres por linha.

À direita, foto real de Malta em recorte vertical/arco ou cartão editorial, com legenda “Malta · Mediterrâneo” e marcador claro de “Sorteio · 2 semanas”. Não colocar condição comercial sobre áreas claras da foto. Mostrar “Passagem aérea não incluída” junto da apresentação da premiação. Abaixo da ação, planos a partir de R$ 350/mês, taxa inicial R$ 199,90 e primeira mensalidade em dezembro.

No celular, título e CTA antes da imagem; fotografia com altura reservada entre 260 e 330 px. Sem texto flutuante sobre a área principal de leitura.

### Faixa de benefícios

Faixa azul com três informações concretas: aulas online; um mês do outro idioma; oportunidade de concorrer a Malta. Usar divisórias e ícones em vez de três cartões genéricos com sombras.

### Planos

Título curto e seletor de idioma evidente, com rótulos textuais e estado selecionado por borda/indicador além da cor. Manter o mesmo plano ao trocar de idioma. Três cartões equivalentes em grade no desktop e empilhados no celular, sem carrossel que esconda comparação.

Cada cartão: nome, quantidade mensal grande, valor mensal dominante, chances aprovadas e botão específico. Condições comuns em bloco legível imediatamente abaixo: taxa inicial, inclusões, primeira mensalidade, bônus e ausência de fidelidade. Seleção atual deve aparecer também nos CTAs gerais. Não inventar diferenças pedagógicas entre planos.

### Malta e bônus

Malta em bloco editorial com foto e lista dos itens incluídos. “€ 200 de ajuda de custo” pode ser o segundo número visual importante após “2 semanas”. A passagem excluída deve ter o mesmo tamanho de texto das inclusões, sem nota ilegível. Matrícula ativa, mensalidades em dia até o mês da viagem e prêmio não transferível ficam próximos desse bloco.

Bônus em bloco contrastante: “Um idioma para começar. Outro para experimentar.” Deixar explícito um mês do outro idioma, uma aula por semana e escolha sobre continuidade após o período.

### Como participar, indicação e FAQ

Três passos numerados com linhas finas: escolher idioma; comparar plano; conversar com a EFM para concluir matrícula. O clique não pode aparecer como participação concluída.

Indicação em faixa curta: “Já é aluno EFM? Indique um novo aluno e também concorra ao intercâmbio.” Sem números adicionais de chances.

FAQ com `details`/`summary` nativos e alvos de toque generosos. CTA final repete idioma/plano atuais e condições principais. Rodapé com marca e contato; sem link de regulamento vazio.

## Bandeiras e movimento

No máximo três bandeiras circulares decorativas, pequenas, em áreas de respiro junto da imagem e fora das colunas de texto. `aria-hidden="true"`, `pointer-events: none`, movimento somente por `transform`, 8–12 segundos. No celular, reduzir para uma ou duas. Em `prefers-reduced-motion: reduce`, remover animação e scroll suave. Nenhuma informação depende desse efeito.

## Fotografia de Malta

O repositório não contém fotografia licenciada. Não foi baixado nenhum asset nesta tarefa. Uma fonte adequada para pesquisa é Wikimedia Commons, categoria de Valletta/Malta, desde que a página específica do arquivo confirme autor, licença e condições de atribuição. Unsplash/Pexels também exigem registrar a origem e conferir o uso da imagem escolhida. Não usar URL aleatória, fotografia sem licença comprovada nem imagem de outro destino.

Se não houver acesso a uma fotografia autorizada durante a implementação, usar composição gráfica declaradamente ilustrativa de mapa/rota e tipografia “MALTA”, mantendo fotografia real como pendência. Não chamar ilustração de fotografia. Essa alternativa preserva a implementação funcional, mas não substitui a revisão do asset final.

## Critérios observáveis para a implementação

- Conferir 375, 390, 768 e 1440 px sem rolagem horizontal e com todos os cartões acessíveis.
- Manter CTA fixo, caso exista, fora do rodapé/textos e reservar área equivalente no documento.
- Navegação por teclado, estado de seleção identificado sem depender apenas de cor e foco visível.
- Texto secundário e condições legíveis; não usar branco sobre laranja para texto comum.
- Foto com dimensões reservadas, formato moderno e variante responsiva; hero eager, mídias secundárias lazy.
- Nenhum vídeo/depoimento demonstrativo, contador, percentual de desconto ou alegação de popularidade.
- Troca de idioma preserva plano/preço; todos os links WhatsApp incluem a escolha atual.

Este documento descreve direção e critérios; ainda não comprova a interface renderizada, acessibilidade, desempenho ou conversão.

### Asset original disponível

Foi criada `public/images/malta-illustration.svg`: ilustração vetorial original, desenvolvida para este repositório, com interpretação gráfica de Valletta (cúpula, torre, fachadas de pedra clara, sacadas e barcos no Mediterrâneo). Não utiliza fotografia nem incorpora asset externo. O próprio SVG declara título e descrição; a interface deve identificá-lo como ilustração quando houver legenda de mídia. É o fallback disponível até a seleção de fotografia real autorizada. Não foi necessária atribuição a terceiros.
