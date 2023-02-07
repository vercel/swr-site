# 全局配置

`SWRConfig` 可以为所有的 SWR hook 提供全局配置 ([选项](/docs/api))。

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

## Nesting Configurations

`SWRConfig` merges the configuration from the parent context. It can receive either an object or a functional configuration. The functional one receives the parent configuration as argument and returns a new configuration that you can customize it yourself. 

### Object Configuration Example

```jsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 100,
        refreshInterval: 100,
        fallback: { a: 1, b: 1 },
      }}
    >
      <SWRConfig
        value={{
          dedupingInterval: 200, // will override the parent value since the value is primitive
          fallback: { a: 2, c: 2 }, // will merge with the parent value since the value is a mergeable object
        }}
      >
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 200,
  //   refreshInterval: 100,
  //   fallback: { a: 2,  b: 1, c: 2 },
  // }
}
```

### Functional Configuration Example

```jsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 100,
        refreshInterval: 100,
        fallback: { a: 1, b: 1 },
      }}
    >
      <SWRConfig
        value={parent => ({
          dedupingInterval: parent.dedupingInterval * 5,
          fallback: { a: 2, c: 2 },
        })}
      >
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 500,
  //   fallback: { a: 2, c: 2 },
  // }
}
```

## 额外的 API

### 缓存 Provider

除去以上所列的 [选项](/docs/api)，`SWRConfig` 还接受一个可选的 `provider` 函数。详细信息请参考 [缓存](/docs/advanced/cache) 这一节。

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### 访问全局配置

你可以使用 `useSWRConfig` hook 来获取全局配置，以及[`数据更改`](/docs/mutation)和[`缓存`](/docs/advanced/cache)：

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

嵌套配置将会被扩展。如果没有使用 `<SWRConfig>`，将返回默认配置。
