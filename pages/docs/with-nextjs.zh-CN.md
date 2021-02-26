import Callout from 'nextra-theme-docs/callout'

# 配合 Next.js 使用

## 客户端数据请求

如果你的页面包含频繁更新的数据，并且你不需要预渲染数据，那么 SWR 是一个完美选择，而且不需要特别配置：只需要引入 `useSWR`，并在使用该数据的任意组件中使用该 hook 即可。

工作原理：

- 首先，立即显示没有数据的空页面。也可以显示加载进度条。
- 然后，在客户端请求数据并在准备就绪时渲染数据。

这种方法适用于登录后的页面（控制面板）等。因为登录后的页面是一个私有的、特定于用户的页面，与 SEO 无关，页面也不需要预渲染。数据经常更新，这需要即时数据加载。

## 预渲染

如果页面必须预渲染，Next.js 支持 [2 种形式的预渲染](https://nextjs.org/docs/basic-features/data-fetching)：  
**静态生成（Static Site Generation, SSG）** 和 **服务端渲染（Server-side Rendering, SSR）**。

用 SWR，你可以为了 SEO 预渲染页面，并且还有诸如缓存、重新验证、聚焦跟踪、在客户端间隔重新请求等功能。

你可以将预请求的数据作为初始值传递给 `initialData` 选项。比如和 [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) 一起：

```jsx
 export async function getStaticProps() {
  // 在服务器端调用 `getStaticProps`，
  // 所以 `fetcher` 函数将在服务端执行。
  const posts = await fetcher('/api/posts')
  return { props: { posts } }
}

function Posts (props) {
  // 这里的 `fetcher` 函数将在客户端执行。
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts })

  // ...
}
```

页面仍然是预渲染的的。这意味着它对搜索引擎友好的，页面也可以缓存下来以供快速访问。但在页面渲染后，它在客户端还是完全由 SWR 控制。这意味着数据可以是动态的，并且可以根据时间和用户交互而自动更新。

<Callout emoji="💡">
  在上面的示例中，<code>fetcher</code> 用来从客户端和服务端加载数据，它需要同时支持 2 种环境。但这不是必需的。你可以使用不同的方法从服务端或客户端加载数据。
</Callout>
