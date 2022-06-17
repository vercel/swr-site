# Configuração Global

O contexto `SWRConfig` pode fornecer configurações globais ([opções](/docs/options)) para todos os hooks SWR.

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

## APIs Extras

### Cache Provider

Além de todas as [opções](/docs/options) listadas, `SWRConfig` também aceita uma função opcional `provider`. Consulte a seção [Cache](/docs/advanced/cache) para obter mais detalhes.

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
