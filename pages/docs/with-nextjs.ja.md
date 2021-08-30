import Callout from 'nextra-theme-docs/callout'

# Next.jsでの利用

## クライアント側のデータフェッチ

ページに頻繁に更新されるデータがあり、データを事前にレンダリングする必要がない場合、 SWR は特別な設定が必要ないほどピッタリです：
`useSWR` をインポートして、データを使用するコンポーネント内でフックを使用するだけです。

方法は以下の通りです：

- まず、データのないページをすぐに表示します。データがないときはローディング状態を表示することができます。
- 続いて、クライアント側でデータを取得し、準備ができたら表示します。

このアプローチは、たとえばユーザーのダッシュボードページなどで有効です。ダッシュボードは、ユーザー専用のプライベートなページであるため SEO は関係なく、
ページを事前にレンダリングする必要もありません。データは頻繁に更新されるため、リクエスト時のデータ取得処理が必要です。

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
