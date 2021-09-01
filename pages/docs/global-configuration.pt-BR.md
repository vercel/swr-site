# Configuração Global

O contexto `SWRConfig` pode prover ([opcões](/docs/options) de) configurações globais para todos os hooks SWR.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

Neste exemplo, todos os hooks SWR vão usar o mesmo fetcher para carregar os dados do JSON, e fazer refresh a cada 3 segundos por padrão:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // sobrescreve o tempo do refresh

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

## APIs extras

### Provedor de Cache

Além de todas as [opções](/docs/options) listadas, `SWRConfig` também aceita uma função opcional de `provedor`. Consulte a seção de [Cache](/docs/cache) para obter mais detalhes.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Acesso a Configurações Globais

Você pode usar o hook `useSWRConfig` para obter as configurações globais, bem como [`mutate`](/docs/mutation) e [`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

As configurações aninhadas serão estendidas. Se nenhum `<SWRConfig>` for usado, ele retornará os padrões.