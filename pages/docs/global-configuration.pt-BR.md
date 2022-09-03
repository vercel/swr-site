# Configuração Global

O contexto `SWRConfig` pode fornecer configurações globais ([opções](/docs/api)) para todos os hooks SWR.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

Neste exemplo, todos os hooks SWR usarão o mesmo fetcher fornecido para carregar dados JSON, e atualizar a cada 3 segundos por padrão:

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

## APIs Extras

### Cache Provider

Além de todas as [opções](/docs/api) listadas, `SWRConfig` também aceita uma função opcional `provider`. Consulte a seção [Cache](/docs/advanced/cache) para obter mais detalhes.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Acesso às Configurações Globais

Você pode usar o hook `useSWRConfig` para obter as configurações globais, assim como [`mutate`](/docs/mutation) e [`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

Configurações aninhadas serão extendidas. Se não houver nenhum `<SWRConfig>` usado, será retornado as configurações padrão.
