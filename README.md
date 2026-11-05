# EFM Black Friday

Landing page da EFM Languages para inglês e espanhol, com comparação de planos e atendimento pelo WhatsApp. Projeto independente dos sistemas acadêmicos, sem banco ou autenticação.

## Executar

Node.js 22.12+ (validado com Node 24), npm e Python 3.11+ para a verificação de configuração.

```sh
npm ci
npm run dev
```

Vite escuta somente em loopback por padrão. Para testar o build de produção:

```sh
npm run build
npm run preview
```

## Verificar

```sh
python3 scripts/validate_setup.py
npm test
npm run build
```

A suíte funcional usa Python Playwright e Chromium (o ambiente atual já os fornece). Para preparar outra máquina: `python3 -m pip install -r requirements-dev.txt` e `python3 -m playwright install chromium`. É possível escolher um Chromium instalado usando `CHROMIUM_PATH`. Com o servidor de desenvolvimento ativo na porta 5173:

```sh
npm run test:e2e
```

As capturas de tela são salvas fora do checkout em `/tmp/efm-black-friday-review`. O navegador não envia mensagens nem navega ao WhatsApp durante os testes. Dependências de teste de navegador não fazem parte do bundle da página.

## Prévia sem hospedagem

Depois de `npm run build`, execute `npm run preview:file`. O comando gera `/tmp/efm-black-friday-review/preview.html` com fonte, estilos, imagens e JavaScript incorporados. Baixe e abra esse arquivo no navegador para revisar a interação sem publicar o site. Os botões continuam apontando ao WhatsApp real da campanha; abrir um link não envia mensagem automaticamente.

## Conteúdo e manutenção

- `config/campaign.json`: idiomas, planos, valores, bônus e premiação.
- `config/media.json`: foto opcional do Vinícius na abertura e vídeo opcional da campanha; veja `docs/media.md`.
- `config/brand.json` e `public/brand/tokens.css`: identidade EFM.
- `src/main.js` / `src/style.css`: interface e interação.
- `src/experience.css`, `src/motion.js` e `src/motion.css`: escolha interativa do plano e animações, com respeito à preferência por movimento reduzido.
- `src/campaign.js`: seleção e construção dos links de WhatsApp.
- `src/analytics.js`: eventos locais de intenção, sem pixels ou provedor configurado.
- `docs/briefing.md`: oferta confirmada e pendências comerciais.
- `docs/analytics.md`: eventos, consentimento e limites de mensuração.
- `docs/qa.md`: verificações e limitações da primeira versão.

Montserrat é hospedada localmente via Fontsource (SIL Open Font License; licença no pacote). As logos são os SVGs existentes da EFM. A ilustração de Valletta é original deste projeto. O hero e a seção de Malta usam uma fotografia original do Vinícius fornecida pela EFM; não é depoimento nem imagem gerada.

## Publicação no Netlify

O repositório inclui `netlify.toml` com build `npm run build`, diretório público `dist`, Node.js 22.12 e cabeçalhos básicos de segurança. No Netlify, basta importar o repositório e selecionar a branch desejada; a configuração é lida automaticamente.

A página está liberada para indexação. O sorteio está informado para 10 de dezembro de 2026, pelo Instagram da EFM. O regulamento permanece em preparação e deve ser publicado quando finalizado. Não há pixel GA4/Meta nem matrícula/conversa confirmada por clique. Uma integração futura exige IDs reais, definição de consentimento e validação de recepção no provedor.

Esta implementação não realiza o deploy nem aplica mudanças nos sistemas acadêmicos da EFM.
