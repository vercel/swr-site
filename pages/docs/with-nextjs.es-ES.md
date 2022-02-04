import Callout from 'nextra-theme-docs/callout'

# Uso con Next.js

## Obtención de datos del lado del cliente

Si su página contiene datos que son actualizados frecuentemente y no necesita renderizar previamente los datos, SWR se adapta perfectamente y no se necesita una configuración especial: solo importe `useSWR` y use el hook dentro de cualquier componente que use los datos.

Así es como funciona:

- En primer lugar, muestre inmediatamente la página sin datos. Puede mostrar un loading state para los datos que faltan.

- A continuación, se obtienen los datos en el lado del cliente y se muestran cuando están listos.

Este enfoque funciona bien, por ejemplo, para páginas que son dashboard. Dado que un dashboard es una página privada y específica del usuario, el SEO no es relevante y la página no necesita ser pre-renderizado. Los datos se actualizan con frecuencia, lo que requiere la obtención de datos en el momento de la solicitud.

## Pre-rendering with Default Data

If the page must be pre-rendered, Next.js supports [2 forms of pre-rendering](https://nextjs.org/docs/basic-features/data-fetching):  
**Static Generation (SSG)** and **Server-side Rendering (SSR)**.

Together with SWR, you can pre-render the page for SEO, and also have features such as caching, revalidation, focus tracking, refetching on interval on the client side.

You can use the `fallback` option of [`SWRConfig`](/docs/global-configuration) to pass the pre-fetched data as the initial value of all SWR hooks. 
For example with `getStaticProps`:

```jsx
 export async function getStaticProps () {
  // `getStaticProps` is executed on the server side.
  const article = await getArticleFromAPI()
  return {
    props: {
      fallback: {
        '/api/article': article
      }
    }
  }
}

function Article() {
  // `data` will always be available as it's in `fallback`.
  const { data } = useSWR('/api/article', fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  // SWR hooks inside the `SWRConfig` boundary will use those values.
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```

The page is still pre-rendered. It's SEO friendly, fast to response, but also fully powered by SWR on the client side. The data can be dynamic and self-updated over time.

<Callout emoji="💡">
  The `Article` component will render the pre-generated data first, and after the page is hydrated, it will fetch the latest data again to keep it refresh.
</Callout>

### Complex Keys

`useSWR` can be used with keys that are `array` and `function` types. Utilizing pre-fetched data with these kinds of keys requires serializing the `fallback` keys with `unstable_serialize`.

```jsx
import useSWR, { unstable_serialize } from 'swr'

export async function getStaticProps () {
  const article = await getArticleFromAPI(1)
  return {
    props: {
      fallback: {
        // unstable_serialize() array style key
        [unstable_serialize(['api', 'article', 1])]: article,
      }
    }
  }
}

function Article() {
  // using an array style key.
  const { data } = useSWR(['api', 'article', 1], fetcher)
  return <h1>{data.title}</h1>
}

export default function Page({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}
```
