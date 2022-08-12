# Pre-obtendo Dados

## Dados de Página Top-Level

Existem muitos jeitos de pre-obter os dados para SWR. Para requisições de página top-level, [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) é altamente recomendado:

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

Basta apenas colocá-lo dentro do seu `<head>` do HTML. É fácil, rápido e nativo.

Irá pré-obter os dados quando o HTML carregar, antes mesmo de iniciar a baixar o JavaScript. Todos os seus pedidos de obtenção de dados com o mesmo URL vão usar o resultado (inclusive SWR, de modo que você pode usar o SWR para obter os dados de página top-level).

## Prefetching Programático

As vezes, você quer pré-carregar um recurso condicionalmente. Por exemplo, você quer pré-carregar os dados quando o usuário está [passando com o mouse](https://github.com/GoogleChromeLabs/quicklink) [sob](https://github.com/guess-js/guess) [um link](https://instant.page). A forma mais intuitiva é usar uma função para re-obter e definir o cache via [mutate](/docs/mutation) global:

```js
import { mutate } from 'swr'

function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // o segundo parametro é uma Promise
  // SWR irá usar o resultado quando resolver
}
```

Junto com técnicas como [page prefetching](https://nextjs.org/docs/api-reference/next/router#routerprefetch) no Next.js, você vai ser capaz de carregar ambos a próxima página e os dados instantaneamente.

## Dados de Pré-preenchimento

Se você quiser preencher dados existentes no cache do SWR, você pode usar a opção `fallbackData`. Por exemplo:

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

Se o SWR ainda não obtiver os dados, este hook retornará `prefetchedData` como um fallback.

Você pode também configurar isso para todos os hooks SWR e várias chaves com `<SWRConfig>` e a opção `fallback`. Veja [SSG e SSR com Next.js](/docs/with-nextjs) para mais detalhes.
