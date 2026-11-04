# Verificação da primeira versão

## Escopo

Landing page local, fluxos de seleção de idioma/plano, links de atendimento, fatos comerciais e comportamento responsivo em 375, 390, 768 e 1440 px. Referências de acessibilidade: critérios pertinentes de WCAG 2.2 AA para contraste, teclado, foco, reflow e movimento. Esta é uma inspeção parcial; não é certificação de conformidade.

Ferramentas: Playwright Python, Chromium do sistema (`/usr/bin/chromium`), verificações DOM e capturas de tela privadas em `/tmp/efm-black-friday-review`. A suíte impede requisições externas e não envia mensagens nem escreve nos sistemas da EFM.

## Execução reproduzível

1. `npm ci`
2. `npm run dev -- --port 5173 --strictPort`
3. Em outro terminal, com Playwright Python e Chromium instalados: `npm run test:e2e`.

É possível selecionar outro servidor local com `EFM_TEST_URL` e outro binário Chromium com `CHROMIUM_PATH`. No sandbox deste ambiente, o navegador precisa de execução com permissão para os sockets locais. Isso não altera a política de Internet nem instala um navegador adicional.

## Resultados

A suíte `python3 tests/browser.py` foi executada com sucesso no servidor de desenvolvimento e novamente no build de produção local (`EFM_TEST_URL=http://127.0.0.1:4173 python3 tests/browser.py`) em 04/11/2026. A execução final usa Playwright Python 1.62.0 e Chromium do sistema. As quatro larguras (375, 390, 768 e 1440 px) passaram:

- Os seis nomes de planos, 4/8/12 aulas por mês, R$ 350/450/550 e 3/5/7 chances foram conferidos na interface renderizada.
- Troca Inglês/Espanhol preserva categoria selecionada; seleção dos três planos atualiza estado e CTAs gerais.
- Links específicos dos cartões apontam para seu próprio plano; clique no cartão atualiza a seleção global. Links de WhatsApp usam o número da campanha, idioma e plano esperados, com `noopener` e nova aba. Não foi enviada mensagem.
- Cada ação testada emite exatamente um evento local pertinente; payload restrito a evento/seção/idioma/plano. Nenhum evento de matrícula foi emitido. `dataLayer` permaneceu vazio com consentimento padrão negado.
- FAQ abriu com Enter e fechou com Espaço; foco por teclado visível e sequência continuou sem aprisionamento.
- Nenhuma rolagem horizontal, erro JavaScript ou requisição de terceiros foi observada. Todas as imagens, inclusive a secundária lazy, carregaram com largura natural positiva; todos os elementos `img` possuem `alt`. A fonte Montserrat foi confirmada por `document.fonts.check`.
- A preferência por movimento reduzido removeu as animações renderizadas.

Capturas: `hero-375.png`, `hero-390.png`, `hero-768.png`, `hero-1440.png` e `page-*.png`, com relatório `results.json`, em `/tmp/efm-black-friday-review`. A revisão visual inspecionou hero no celular/tablet e página completa no celular/desktop: os cartões empilham no celular, informações da premiação ficam junto ao aviso de passagem excluída e os controles permanecem legíveis. O CTA móvel reserva espaço no fim da página; o teste de geometria confirmou que o último texto do rodapé permanece acima dele ao rolar até o fim em 375/390 px. A revisão encontrou tipografia pequena em tablet e recorte do pequeno rótulo na arte: o coordenador aumentou textos essenciais e ajustou o espaço interno da arte. O reteste no build de produção passou, e as capturas de hero em 390/768 px confirmam a correção do rótulo.

Contraste de pares sólidos usados, calculado em sRGB: branco/preto 19,80:1; cinza claro/preto 13,34:1; branco/azul 6,22:1; marinho/laranja 5,24:1; laranja/preto 5,95:1. Azul/preto resulta em 3,18:1 e está restrito ao lettering grande “FRIDAY”, não texto comum. A inspeção de pares sólidos não certifica todos os textos sobre a ilustração/gradientes.

## Limitações previstas

- Leitor de tela real e hardware móvel não estão disponíveis nesta inspeção.
- Verificação por DOM e screenshot não comprova compreensão por usuários nem resultado de conversão.
- Serviços externos de analytics não estão configurados: evento local/dataLayer não comprova recepção por GA4 ou Meta.
- Abertura de links é validada sem enviar WhatsApp; atendimento real e matrícula não são exercitados.

## Prévia independente e build

Build e dez testes unitários passaram (quatro de campanha e seis de mensuração). A auditoria npm após atualização para Vite 6.4.5 não apontou vulnerabilidades conhecidas. O build entrega JavaScript de 6,31 KB gzip, CSS de 5,83 KB gzip e fonte latina local de 37,96 KB. São medidas de artefatos, não Core Web Vitals em dispositivos reais.

`npm run preview:file` empacota o build em HTML independente. O conteúdo desse arquivo foi carregado no Chromium com `set_content`: renderização, Montserrat, seleção de espanhol/Premium, mensagem WhatsApp e ausência de overflow passaram. A abertura direta pelo protocolo `file://` não pôde ser testada porque o navegador gerenciado bloqueia esse protocolo. Nenhum deploy ou publicação foi executado.
