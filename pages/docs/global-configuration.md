# Global Configuration

The context `SWRConfig` can provide global configurations ([options](/docs/options)) for all SWR hooks.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

In this example, all SWR hooks will use the same fetcher provided to load JSON data, and refresh every 3 seconds by default:

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
        fetcher: (input, init) => fetch(input, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```
