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
