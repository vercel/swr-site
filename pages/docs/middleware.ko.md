import Callout from 'nextra-theme-docs/callout'

# 미들웨어

<Callout>
  이 기능을 사용하려면 최신 버전(≥ 1.0.0)으로 업그레이드해 주세요.
</Callout>

미들웨어 기능은 SWR hooks의 전후에 로직을 실행할 수 있도록 SWR 1.0에 새로 추가된 것입니다. 

## 사용법

미들웨어는 SWR hook을 받아서 실행 전후에 로직을 수행할 수 있습니다. 만일 다수의 미들웨어가 있다면, 각 미들웨어는 다음 미들웨어를 감쌉니다. 목록 중 마지막 미들웨어는 원래 SWR hook인 `useSWR`을 받습니다. 

### API

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // hook을 실행하기 전...
    
    // 다음 미들웨어를 처리하거나, 이것이 마지막 미들웨어라면 `useSWR` hook을 처리.
    const swr = useSWRNext(key, fetcher, config)

    // hook을 실행한 후...
    return swr
  }
}
```

미들웨어 배열을 `SWRConfig`혹은 `useSWR`에 옵션으로 넘겨줄 수 있습니다:

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// 혹은...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### 확장

미들웨어는 보통의 옵션들처럼 확장될 수 있습니다. 예를 들면:

```jsx
function Bar () {
  useSWR(key, fetcher, { use: [c] })
  // ...
}

function Foo() {
  return (
    <SWRConfig value={{ use: [a] }}>
      <SWRConfig value={{ use: [b] }}>
        <Bar/>
      </SWRConfig>
    </SWRConfig>
  )
}
```

아래와 동일합니다:

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### 다수의 미들웨어

각 미들웨어는 다음 미들웨어를 감싸고 마지막 미들웨어는 SWR hook을 감쌉니다. 예를 들면:

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

미들웨어 실행 순서는 아래 보여지는 것과 같이 `a → b → c` 가 될 것입니다:

```plaintext
enter a
  enter b
    enter c
      useSWR()
    exit  c
  exit  b
exit  a
```

## 예시

### 요청 로거

예시로 간단한 요청 로거 미들웨어를 만들어 봅시다. 요청 로거는 이 SWR hook에서 보낸 모든 fetcher 요청을 출력합니다. 이 미들웨어를 `SWRConfig`에 추가하여 모든 SWR hooks에서도 사용할 수 있습니다.


```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // 로거를 기존 fetcher에 추가.
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // hook을 새로운 fetcher와 함께 실행.
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... 자신의 컴포넌트 내부에서
useSWR(key, fetcher, { use: [logger] })
```

매번 요청이 실행될 때마다, 콘솔에 SWR 키를 출력합니다:

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### 이전 결과 유지

때때로 `useSWR`에서 반환된 데이터가 "지연(laggy)"되기를 원할 수 있습니다. 키가 바꿔더라도 새로운 데이터가 로드될 때까지 여전히 이전 결과가 반환되기를 원할 수 있습니다.

이것을 `useRef`와 함께 지연(laggy) 미들웨어로 구현할 수 있습니다. 이 예시에서 또한 `useSWR` hook의 반환된 객체를 확장할 것입니다:

```jsx
import { useRef, useEffect, useCallback } from 'react'

// 이것은 키가 바뀌더라도 데이터를 유지해주는 SWR 미들웨어 입니다.
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // 이전에 반환된 데이터를 저장하기 위해 ref를 사용.
    const laggyDataRef = useRef()

    // 실제 SWR hook.
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // 데이터가 undefined가 아니라면 ref를 업데이트.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // 만일 지연(laggy) 데이터가 존재한다면 지우기 위해 함수를 노출함.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // 현재 데이터가 undefined라면 이전 데이터로 대체.
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data

    // 이전 데이터를 보여주나요?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    // 또한 `isLagging` 필드를 SWR에 추가.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

지연되는 SWR hook이 필요할 때, 이 미들웨어를 사용할 수 있습니다:

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### 객체 키 직렬화

기본적으로, SWR은 React처럼 객체 키를 **얕은 비교** (관련 주제: [객체 전달 – 인자](/docs/arguments#passing-objects))를 합니다. 이것은 다수의 "연결된" `useSWR` hooks가 있거나, 직렬화 할 수 없는 키를 사용하는 경우 강력합니다:

```jsx
// 다른 hook의 데이터를 키로 사용하는 hook
const { data: user } = useSWR('API_CURRENT_USER', fetcher)
const { data: userSettings } = useSWR(['API_USER_SETTINGS', user], fetcher)

// 전역 함수를 키로 사용하는 hook
const { data: items } = useSWR([getItems], getItems)
```

하지만, 어떤 경우에는 직렬화 가능한 객체를 키로 전달하는 경우가 있습니다. 안정성을 보장하기 위해 객체 키를 직렬화 할 수 있는데 단순한 미들웨어가 이것을 도와줄 수 있습니다:

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // 키 직렬화.
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // 직렬화된 키를 전달하고 fetcher에서 직렬화 해제.
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... 혹은 아래와 같이 전역화 
<SWRConfig value={{ use: [serialize] }}>
```

객체가 렌더링 사이에 바뀔까봐 걱정할 필요가 없습니다. 항상 동일한 문자열로 직렬화되고 fetcher는 여전히 해당 객체의 인자를 받을 것입니다.

<Callout>
  게다가, `JSON.stringify` 대신에 [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify)와 같은 라이브러리를 사용할 수 있습니다 — 더 빠르고 안정적인.
</Callout>
