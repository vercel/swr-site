# Configuración Global

El contexto `SWRConfig` puede proporcionar configuraciones globales ([opciones](/docs/options)) para todos los hooks de SWR.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

En este ejemplo, todos los hooks de SWR utilizarán el mismo fetcher proporcionando para cargar datos JSON, 
y se actualizarán cada 3 segundos por defecto:

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

`SWRConfig` merges the configuration from the parent context.

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
          dedupingInterval: 200, // override the parent value
          fallback: { a: 2, c: 2 }, // merge with the parent value
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

You can also pass a function as the `value` property when you want to pick some properties from the parent context and decide how to combine them with the current `SWRConfig`. The function receives a parent config and returns a new config.

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
