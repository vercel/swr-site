# 全局配置

`SWRConfig` 可以为所有的 SWR hook 提供全局配置 ([选项](/docs/options))。

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

在以下示例中，所有的 SWR hook 都将使用提供的相同的 fetcher 来加载 JSON 数据，默认每 3 秒刷新一次：

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // override

  // ...
}

function App () {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

## Extra APIs

### Cache Provider

除去以上所列的 [选项](/docs/options)，`SWRConfig` 还接受一个可选的 `provider` 函数。详细信息请参考 [缓存](/docs/cache) 这一节。

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Access To Global Configurations

You can use the `useSWRConfig` hook to get the global configurations, as well as [`mutate`](/docs/mutation) and [`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

Nested configurations will be extended. If no `<SWRConfig>` is used, it will return the default ones.
