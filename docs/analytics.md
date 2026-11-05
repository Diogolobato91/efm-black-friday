# Mensuração da campanha

A implementação prepara sinais de intenção para comparar idioma, plano e posição dos CTAs. Nenhum serviço de analytics foi instalado ou configurado. Não há IDs de pixels, cookies, armazenamento, leitura de URL, coleta de texto livre ou requisições de mensuração.

## Eventos

| Evento | Gatilho | Decisão apoiada |
| --- | --- | --- |
| `language_select` | Alteração explícita de idioma | Entender interesse entre inglês e espanhol |
| `plan_select` | Seleção explícita de plano | Comparar interesse entre os planos |
| `rhythm_select` | Mudança explícita entre 4, 8 ou 12 aulas no assistente de ritmo (`section: plan-finder`) | Comparar o ritmo de estudo escolhido |
| `whatsapp_click` | Ativação de um link para WhatsApp | Comparar intenção por seção, idioma e plano |

Todos recebem apenas `section`, `language` (`english`/`spanish`) e `plan` (`basic`/`pro`/`premium`). Os nomes e valores são validados por listas permitidas. Propriedades extras são descartadas. Não incluir nome, telefone, texto da mensagem, URL completa ou parâmetros de consulta.

No assistente de ritmo, 4/8/12 aulas correspondem a `basic`/`pro`/`premium`; não há campo numérico ou texto livre adicional. `rhythm_select` só aceita a seção `plan-finder`. Os CTAs também aceitam as posições `plan-finder`, `selected-plan` (resumo da seleção) e `sticky-desktop` (barra no desktop), além das posições existentes. O atributo de origem da interface é convertido em `section`; não é enviado como propriedade `source` adicional.

`trackEvent(name, { section, language, plan })` em `src/analytics.js` emite um `CustomEvent` local chamado `efm:analytics`, com o objeto em `event.detail`. Esse evento local permite verificação no navegador e não comprova entrega a qualquer provedor. Cada ação deve chamar a função uma única vez no handler responsável, evitando duplicidade por propagação.

Renderizar ou atualizar o resumo vivo, sincronizar botões, exibir a barra fixa e inicializar a seleção não são ações de mensuração. Escolher um ritmo deve gerar somente `rhythm_select`, sem um `plan_select` adicional para a mesma ação; reativar uma opção já selecionada não representa mudança. O módulo não mantém histórico de deduplicação: essa responsabilidade é do handler da interface, que conhece se a seleção mudou. Cliques posteriores e distintos no WhatsApp continuam sendo intenções distintas.

## Consentimento e integração futura

O envio a uma `window.dataLayer` já existente só ocorre após `setAnalyticsConsent(true)`. O padrão é negado, o estado fica apenas em memória, a revogação interrompe novos envios e eventos anteriores não são reenviados. A função não cria fila ou contêiner. O site não deve chamar essa função até integrar um mecanismo de consentimento aprovado. Não há carregamento de GA4, GTM ou Meta Pixel nesta versão.

Ativação futura depende de IDs reais, definição de consentimento, responsável pela campanha e validação de recebimento no provedor. A atribuição por UTMs não é coletada nesta versão: permanece na URL de entrada sem leitura, alteração ou envio pelo módulo. Antes de instrumentá-la, definir valores de campanha permitidos, minimização e consentimento; nunca encaminhar a URL completa.

## Conversões e limites

Um clique significa somente intenção de abrir o WhatsApp. Não confirma que a mensagem foi enviada, a conversa começou, a matrícula foi concluída ou a participação no sorteio foi efetivada. Não existe evento de matrícula nesta página. Confirmações exigem fonte de atendimento autorizada e uma integração posterior, sem inferência a partir do clique.

## Verificação

`node --test tests/analytics.test.js` verifica payload, uma emissão por chamada, os três ritmos, as novas posições dos CTAs, bloqueio de propriedades indevidas, consentimento negado/concedido/revogado, ausência de replay e tolerância a falhas. A revisão de navegador deve ainda confirmar uma emissão por clique real e mudança de seleção, incluindo navegação por teclado, ausência de evento ao reativar o mesmo ritmo e ausência de duplicidade por sincronização entre assistente, cards e resumo. Testes locais e `dataLayer.push` não demonstram recebimento em ferramenta externa. Não foi configurado provedor para reconciliar cliques ou matrículas.
