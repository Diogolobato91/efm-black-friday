# EFM Black Friday

Preparação da landing page de campanha da EFM Languages, com atendimento no WhatsApp.

## Estado
Agentes, nove skills e briefing configurados. A interface, o build da aplicação, tracking real e hospedagem ainda não foram implementados.

## Começar
Abra este repositório no Codex e leia AGENTS.md. A oferta está em docs/briefing.md, a equipe em docs/agents.md e a identidade em docs/brand.md. config/campaign.json reúne os dados comerciais confirmados; public/brand contém logos e tokens.

| Inglês / Espanhol | Aulas mensais | Mensalidade |
| --- | ---: | ---: |
| Básico / ¡Vamos! | 4 | R$ 350 |
| Pro / ¡Arriba! | 8 | R$ 450 |
| Premium / ¡Dale! | 12 | R$ 550 |

## Validar a preparação
Com Python 3.11 ou superior:
```sh
python3 scripts/validate_setup.py
```
O comando verifica agentes, bundles e integridade dos arquivos, dados da campanha e referências. Não é teste de uma interface.

## Próximo trabalho
Implementar a landing page conforme o briefing: redação persuasiva, design Black Friday da EFM, comparação Inglês/Espanhol, CTA por plano para WhatsApp, referência a Malta e verificação responsiva. Usar apenas experiências reais e assets autorizados. Regulamento fica para a etapa final. Datas completas, Instagram, vídeos e ferramentas de mensuração ainda têm pendências descritas no briefing.

Esta preparação não publica um site nem instala dependências da futura aplicação.
