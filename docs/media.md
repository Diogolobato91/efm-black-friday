# Foto e vídeo do Vinícius

Os campos em `config/media.json` são opcionais. Com `src` vazio, a página não exibe espaço vazio ou imagem substituta para o Vinícius. Use arquivos reais autorizados pela EFM; as capturas do Instagram são referências visuais.

## Foto na abertura

Coloque uma foto otimizada em `public/images/` e informe seu endereço em `heroPortrait.src`, por exemplo `/images/vinicius-hero.webp`. Use uma foto vertical, nítida e, se possível, recortada com fundo transparente. Ajuste o texto alternativo em `alt` e a legenda em `caption`.

## Vídeo da campanha

Coloque o vídeo em `public/videos/` e configure `campaignVideo.src`, por exemplo `/videos/vinicius-campanha.mp4`. É possível informar também `poster`, `title` e `description`. Forneça legendas em WebVTT no campo `captions` e uma transcrição acessível junto ao vídeo antes da publicação. O vídeo não inicia automaticamente.

Os exemplos indicam caminhos de configuração: os arquivos ainda precisam ser fornecidos e adicionados ao projeto.
