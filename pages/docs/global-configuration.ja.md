# グローバルな設定

コンテキスト `SWRConfig` によって、すべての SWR フックに対するグローバルな設定（ [オプション](/docs/options) ）を提供できます。

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

次の例では、すべての SWR フックに対して、JSON データをロードする同じフェッチャーを使い、デフォルトでは 3 秒ごとに更新するように設定します：

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // オーバーライド

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

Besides all the [options](/docs/options) listed, `SWRConfig` also accepts an optional `provider` function. Please refer to the [Cache](/docs/cache) section for more details.

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
