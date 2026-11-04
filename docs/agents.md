# Equipe de agentes

O agente principal planeja a tarefa, delega, integra e valida. Especialistas são papéis customizados do Codex local, não processos permanentemente em execução.

| Agente | Responsabilidade | Skills |
| --- | --- | --- |
| estrategista | Estratégia e copy | `copywriting`, `page-cro` |
| designer | Design e experiência | `ui-ux-pro-max`, `frontend-design` |
| frontend | Implementação e performance | `web-performance-optimization`, `seo-fundamentals` |
| qualidade | Qualidade e acessibilidade | `webapp-testing`, `accessibility-compliance-accessibility-audit` |
| mensuracao | Mensuração de campanha | `analytics-tracking` |

## Como usar
Abra este repositório em um cliente Codex com suporte a agentes customizados. Os arquivos ficam em .codex/agents e a configuração do projeto limita a três especialistas simultâneos, herdando modelo e permissões da sessão.
Peça ao agente principal para delegar a tarefa aos papéis necessários. Não abra os cinco indiscriminadamente. Para criar a página: estratégia e design podem trabalhar em paralelo; a implementação integra as decisões; qualidade revisa a interface; mensuração entra na definição dos eventos e na implementação quando houver configuração.
Se o cliente não carregar a configuração, confira sua versão, suporte e confiança no projeto. Não alegar que um TOML lido equivale a um subagente executado.

## Entregas
Estratégia: texto por seção e dúvidas comerciais pontuais.
Design: direção, tokens, layout e estados.
Frontend: implementação, fluxo de WhatsApp e carregamento.
Qualidade: evidências, falhas reproduzidas e lacunas.
Mensuração: eventos e propriedades, distinção entre clique e matrícula e verificação de envio.

Referências do host consultadas:
- https://learn.chatgpt.com/docs/agent-configuration/subagents
- https://learn.chatgpt.com/docs/build-skills
