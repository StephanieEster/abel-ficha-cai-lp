# A Ficha Cai · Landing page

Landing page de **A Ficha Cai**, de Abel Colognese: leitura gratuita do Capítulo 1 numa aba da própria página e venda do e-book completo.

Site estático (HTML, CSS e JS puros), publicado na Vercel. Cada push na branch `main` publica automaticamente.

## Link de compra

O link do botão "Comprar o ebook completo" fica num único lugar, no `index.html`:

```html
<body data-purchase-url="[INSERIR LINK DE COMPRA]">
```

Troque `[INSERIR LINK DE COMPRA]` pelo link completo (começando com `https://`). Enquanto o valor não for um link válido, os botões de compra mostram um aviso de "link ainda não configurado" em vez de levar a uma página de erro.

## Estrutura

- `index.html`: página com duas abas, "Apresentação" e "Ler o Capítulo 1" (`/#capitulo-1`).
- `legal.html`: termos de uso e política de privacidade (`/legal`).
- `assets/capitulo-1/`: as páginas do PDF do Capítulo 1, convertidas em imagens WebP sem alteração de conteúdo.
- `assets/script.js`: abas, barra de progresso da leitura e links de compra.
- `assets/styles.css`: identidade visual (paleta sépia/ocre, Alfa Slab One, Oswald, Courier Prime, Libre Franklin).

## Atualizar o Capítulo 1

Para trocar o PDF, gere novamente as imagens das páginas (1440 px de largura, WebP) com os nomes `pagina-01.webp`, `pagina-02.webp` e assim por diante, e ajuste a lista de `<img>` dentro de `[data-reader-pages]` no `index.html` se o número de páginas mudar.
