# Instruções para Ícones PWA

Os arquivos `pwa-192x192.svg` e `pwa-512x512.svg` são placeholders.

Para criar os ícones finais, você pode:

1. Criar seus ícones personalizados em formato PNG com as dimensões:

   - 192x192 pixels
   - 512x512 pixels

2. Substituir os arquivos SVG por PNG com os mesmos nomes

3. Ou usar uma ferramenta online como:
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

## Conversão SVG para PNG

Se quiser converter os SVGs atuais para PNG:

```bash
# Usando ImageMagick (instale com: apt install imagemagick)
convert -density 192 -background none public/pwa-192x192.svg public/pwa-192x192.png
convert -density 512 -background none public/pwa-512x512.svg public/pwa-512x512.png
```

Ou use um conversor online como:

- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
