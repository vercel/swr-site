import Callout from 'nextra-theme-docs/callout'

# Usage with Next.js

## Client Side Data Fetching

If your page contains frequently updating data, and you don’t need to pre-render the data, SWR is a perfect fit and no special setup needed: just import `useSWR` and use the hook inside any components that use the data.

Here’s how it works:

- First, immediately show the page without data. You can show loading states for missing data.
- Then, fetch the data on the client side and display it when ready.

This approach works well for user dashboard pages, for example. Because a dashboard is a private, user-specific page, SEO is not relevant and the page doesn’t need to be pre-rendered. The data is frequently updated, which requires request-time data fetching.

## Pre-rendering

If the page must be pre-rendered, Next.js supports [2 forms of pre-rendering](https://nextjs.org/docs/basic-features/data-fetching):  
**Static Generation (SSG)** and **Server-side Rendering (SSR)**.

Together with SWR, you can pre-render the page for SEO, and also have features such as caching, revalidation, focus tracking, refetching on interval in the client side.

You can pass the pre-fetched data as the initial value to the `initialData` option. For example together with [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation):

```jsx
export async function getStaticProps() {
  // `getStaticProps` is invoked on the server-side,
  // so this `fetcher` function will be executed on the server-side.
  const posts = await fetcher('/api/posts')
  return { props: { posts } }
}

function Posts (props) {
  // Here the `fetcher` function will be executed on the client-side.
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts })

  // ...
}
```

The page is still pre-rendered. That means it's SEO friendly, can be cached and accessed very fast. But after hydration, it’s also fully powered by SWR in the client side. 
Which means the data can be dynamic and update itself over time and user interactions.

<Callout emoji="💡">
  In the example above, <code>fetcher</code> is used to load the data from both client and server, 
  and it needs to support both environments. But this is not a requirement. You can use different ways to load data from server or client.
</Callout>
