# Foto e vídeo do Vinícius

Os campos em `config/media.json` são opcionais. Com `src` vazio, a página não exibe espaço vazio ou imagem substituta para o Vinícius. Use apenas arquivos reais autorizados pela EFM.

## Foto na abertura

A campanha usa `public/images/vinicius-malta-hero.jpg`, selecionada da pasta de Malta fornecida pela EFM no Google Drive. A fotografia aparece no hero e na seção do sorteio com enquadramentos diferentes. A imagem original foi mantida, sem alteração de rosto ou corpo. O texto alternativo está em `heroPortrait.alt` e a identificação da foto em `caption`.

## Vídeo da campanha

Coloque o vídeo em `public/videos/` e configure `campaignVideo.src`, por exemplo `/videos/vinicius-campanha.mp4`. É possível informar também `poster`, `title` e `description`. Forneça legendas em WebVTT no campo `captions` e uma transcrição acessível junto ao vídeo antes da publicação. O vídeo não inicia automaticamente.

O vídeo continua opcional e ainda depende de arquivo, legendas e transcrição antes da publicação.
