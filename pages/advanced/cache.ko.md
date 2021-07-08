import Callout from 'nextra-theme-docs/callout'

# 커스텀 캐시

<Callout emoji={<span style={{fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'}}>⚠️</span>}>
아직 베타 기능입니다. 사용해보려면 `swr@beta`를 설치해주세요.
</Callout>

기본적으로 SWR은 전역 캐시를 사용해 모든 컴포넌트에서 데이터를 저장하고 공유합니다. 이제 자신만의 캐시 제공자로 이를 커스터마이징 할 수 있는 새로운 방법이 있습니다.
새로운 `cache` 설정과 `createCache` API가 `swr@beta`에서 도입되었습니다. 더 맞춤화된 저장소와 함께 SWR을 사용하고 캐시에 대한 직접 접근을 제공하는 문제를 해결하기 위한 것입니다.

## 커스텀 캐시 생성하기

### `createCache`

이 API는 기저를 이루는 캐시 `provider`를 인자로 받습니다. SWR hook에 의해 사용되는 `cache` 인스턴스와 함께 객체를 반환합니다.
그리고 `mutate` API는 일치하는 캐시를 조작합니다. 이것은 전역 `mutate` API가 아님을 유의하세요.

```js
const { mutate, cache } = createCache(provider)
```

SWRConfig 또는 `useSWR` hook 옵션을 통해 `cache`를 전달할 수 있습니다.

```jsx
import { SWRConfig, createCache } from 'swr'

const provider = new Map()

const { mutate, cache } = createCache(provider)

// SWR 컨텍스트로 전달
<SWRConfig value={{ cache }}>
  <Page />
</SWRConfig>

// 또는 hook 옵션으로 전달
useSWR(key, fetcher, { cache })
```

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  `createCache`는 렌더링 내에서 호출되어서는 안 되며 전역 싱글톤이어야 합니다.
</Callout>

### `provider`

provider는 사용자가 캐시 값을 직접 관리할 수 있도록 하는 데 사용되며 인터페이스는 다음 정의와 일치해야 합니다:

```ts
interface Cache<Data = any> {
  get(key: string): Data | null | undefined
  set(key: string, value: Data): void
  delete(key: string): void
}
```

SWR 내에서 캐시를 관리하기 위해 이러한 메서드를 사용합니다. SWR 자체를 넘어 사용자는 이제 `provider`의 캐시 된 키, 값에 직접 접근할 수 있습니다.
예를 들어 provider가 Map 인스턴스라면 `Map.prototype.keys()`를 사용하여 provider를 통해 사용된 키에 접근할 수 있습니다.

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  대부분의 경우 캐시 된 데이터를 직접 조작하지 않아야 합니다. 대신에 뮤테이트를 사용하여 상태와 캐시를 일관성 있게 유지하세요.
</Callout>

### `mutate`

`createCache`에 의해 반환된 `mutate` 함수의 사용법은 [뮤테이션 페이지](/docs/mutation)에서 설명한 전역 `mutate` 함수와 유사하지만, 특정 캐시 provider로 제한됩니다. 예를 들어 주어진 캐시로부터 일부 키를 갱신하려면:

```jsx
const { cache, mutate } = createCache(new Map())

export default function App() {
  return (
    <SWRConfig value={{ cache }}>
      <div className="App">
        <Section />
        <button onClick={() => mutate('A')}>revalidate A</button>
        <button onClick={() => mutate('B')}>revalidate B</button>
      </div>
    </SWRConfig>
  )
}
```

## 예시

### 다중 키 뮤테이트

이러한 아토믹 API의 유연함으로 부분적인 뮤테이션 스케줄링과 같은 커스텀 로직을 구성할 수 있습니다.
아래 예시에서는 `matchMutate`는 정규 표현식을 키로 받고, 이 패턴에 일치하는 것들을 뮤테이트하는데 사용합니다.

```js
function matchMutate(matcher, data, shouldRevalidate = true) {
  const keys = []
  if (matcher instanceof RegExp) {
    // `provider`는 캐시 구현입니다, 에: `Map()`
    for (const k of provider.keys()) {
      if (matcher.test(k)) {
        keys.push(k)
      }
    }
  } else {
    keys.push(matcher)
  }

  const mutations = keys.map((k) => mutate(k, data, shouldRevalidate))
  return Promise.all(mutations)
}

matchMutate(/^key-/) // `key~`로 시작하는 키 갱싱하기
matchMutate('key-a') // `key-a` 갱신하기
```

### LocalStorage에 캐시 동기화하기

다음에 앱을 다시 로딩할 때 계속 유지되는 상태로 더 쉽게 복구하기 위해, 특별한 경우 `localStorage`에 캐시 된 상태를 동기화하길 원할 수도 있습니다.

```js
function createProvider() {
  const map = new Map(JSON.parse(localStorage.getItem('app-cache')) || [])

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  return map
}

const provider = createProvider()
const { cache, mutate } = createCache(provider)
```
