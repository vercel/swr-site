# 전역 설정

`SWRconfig` 컨텍스트는 모든 SWR hook에 대한 전역 설정([options](/docs/options))을 제공합니다.

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

이 예시에서, 모든 SWR hook은 제공된 동일한 fetcher를 사용해 JSON 데이터를 로드하고 기본적으로 3초마다 갱신합니다.

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // 오버라이드

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

## 부가적인 APIs

### 캐시 공급자

나열된 모든 [옵션](/docs/options) 외에도, `SWRConfig`는 선택적으로 `provider` 함수도 받습니다. 더 자세한 내용은 [캐시](/docs/advanced/cache) 섹션을 참고해 주세요.

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### 전역 설정에 접근하기

`useSWRConfig` hook을 사용해 전역 설정과 [`mutate`](/docs/mutation) 및 [`cache`](/docs/advanced/cache)를 얻을 수 있습니다.

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

중첩된 설정은 확장됩니다. `<SWRConfig>`를 사용하지 않았다면 기본값을 반환합니다.
