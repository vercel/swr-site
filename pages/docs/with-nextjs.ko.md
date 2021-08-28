import Callout from 'nextra-theme-docs/callout'

# Next.js와 함께 사용하는 방법

## 클라이언트 사이드 데이터 가져오기

페이지가 빈번하게 업데이트하는 데이터를 포함하고 이를 프리렌더링할 필요가 없다면, SWR은 완벽하게 적합하며 어떠한 특별한 설정도 필요하지 않습니다. `useSWR`을 임포트하고 데이터를 사용하는 컴포넌트 내에서 이 hook을 사용하기만 하면 됩니다.

동작 방식:

- 먼저, 데이터 없이 페이지를 즉시 보여줍니다. 빠진 데이터를 위한 로딩 상태를 보여주어도 됩니다.
- 그다음, 클라이언트 사이드에서 데이터를 가져와 준비되면 보여줍니다.

이런 접근은 사용자 대시보드 페이지 같은 곳에 적합합니다. 대시보드는 비공개용이며 사용자별 페이지이므로 SEO와 관계가 없고 페이지를 프리렌더링할 필요도 없습니다. 데이터는 빈번하게 업데이트되므로 요청 시에 데이터를 가져와야 합니다.

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
