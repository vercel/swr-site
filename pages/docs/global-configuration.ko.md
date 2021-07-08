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
