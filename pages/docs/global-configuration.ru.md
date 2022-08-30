# Глобальная конфигурация

Контекст `SWRConfig` может предоставить глобальные конфигурации ([опции](/docs/options)) для всех SWR хуков.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

В этом примере все SWR хуки будут использовать один и тот же fetcher, предоставленный для загрузки данных JSON, и по умолчанию обновляться каждые 3 секунды:

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // переопределение

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

## Дополнительные API

### Провайдер кеша

Помимо всех перечисленных [опций](/docs/options), `SWRConfig` также принимает опциональную функцию `provider`.
Пожалуйста, обратитесь к разделу [Кэш](/docs/advanced/cache) для более подробной информации.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### Доступ к глобальным конфигурациям

Вы можете использовать ловушку `useSWRConfig` для получения глобальных конфигураций,
а также [`mutate`](/docs/mutation) и [`cache`](/docs/advanced/cache):

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

Вложенные конфигурации будут расширены. Если не используется `<SWRConfig>`, вернётся значение по умолчанию.
