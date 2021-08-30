import Callout from 'nextra-theme-docs/callout'

# 配合 Next.js 使用

## 客户端数据请求

如果你的页面包含频繁更新的数据，并且你不需要预渲染数据，那么 SWR 是一个完美选择，而且不需要特别配置：只需要引入 `useSWR`，并在使用该数据的任意组件中使用该 hook 即可。

工作原理：

- 首先，立即显示没有数据的空页面。也可以显示加载进度条。
- 然后，在客户端请求数据并在准备就绪时渲染数据。

这种方法适用于登录后的页面（控制面板）等。因为登录后的页面是一个私有的、特定于用户的页面，与 SEO 无关，页面也不需要预渲染。数据经常更新，这需要即时数据加载。

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
