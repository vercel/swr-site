import Callout from 'nextra-theme-docs/callout'

# 미들웨어

<Callout>
  이 기능을 사용하시려면 최신 버전(≥ 1.0.0)으로 업그레이드하세요.
</Callout>

미들웨어 기능은 SWR 1.0에 새롭게 추가되었으며 SWR hook의 전후에 로직을 실행할 수 있도록 해줍니다.

## 사용법

미들웨어는 SWR hook을 받고 hook의 실행 전후에 로직을 실행할 수 있습니다. 여러 미들웨어가 존재한다면, 각 미들웨어는 다음 미들웨어를 감쌉니다.
리스트의 마지막 미들웨어가 원본 SWR hook `useSWR`을 받습니다.

### API

_Notes: The function name shouldn't be capitalized (e.g. `myMiddleware` instead of `MyMiddleware`) or React lint rules will throw `Rules of Hook` error_

[TypeScript](https://swr.vercel.app/docs/typescript#middleware-types)

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // hook을 실행하기 전...
    
    // 다음 미들웨어를 처리하거나, 마지막인 경우 `useSWR` hook을 처리합니다.
    const swr = useSWRNext(key, fetcher, config)

    // hook을 실행한 후...
    return swr
  }
}
```

`SWRConfig` 또는 `useSWR`에 옵션으로 미들웨어 배열을 전달할 수 있습니다.

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// 또는...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### 확장하기

일반 옵션과 마찬가지로 미들웨어를 확장할 수 있습니다. 예를 들면:

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

다음과 동일합니다.

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### 다중 미들웨어

각 미들웨어는 다음 미들웨어를 감싸며, 마지막 미들웨어는 SWR hook을 감쌉니다. 예를 들면:

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

미들웨어의 실행 순서는 아래에서 보시다시피 `a → b → c`입니다.

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

### Request Logger

예시로 간단한 request logger 미들웨어를 만들어봅시다. 이 SWR hook으로부터 전송된 모든 가져오기 요청을 출력합니다. 이 미들웨어를 `SWRConfig`에 추가하여 모든 SWR hook에 대해 사용할 수도 있습니다.


```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // 원본 fetcher에 logger를 추가합니다.
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // 새로운 fetcher로 hook을 실행합니다.
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... 여러분의 컴포넌트 내부
useSWR(key, fetcher, { use: [logger] })
```

요청이 발생할 때마다, SWR 키가 콘솔에 출력됩니다.

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### 이전 결과 유지하기

때때로 `useSWR`이 반환한 데이터가 "지연"되길 원합니다. 키가 변경되었더라도,
새로운 데이터가 로드되기 전까지는 여전히 이전 결과를 반환하길 원합니다.

이는 `useRef`를 함께 사용하여 지연 미들웨어로 구축할 수 있습니다. 이 예시에서는
또한 `useSWR` hook이 반환한 객체를 확장합니다.

```jsx
import { useRef, useEffect, useCallback } from 'react'

// 키가 변경되더라도 데이터를 유지하기 위한 SWR 미들웨어입니다.
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // 이전에 반환된 데이터를 저장하기 위해 ref를 사용합니다.
    const laggyDataRef = useRef()

    // 실제 SWR hook.
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // 데이터가 undefined가 아니면 ref를 업데이트합니다.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // 지연 데이터가 존재할 경우 이를 제거하기 위한 메서드를 노출합니다.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // 현재 데이터가 undefined인 경우에 이전 데이터로 폴백
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data

    // 이전 데이터를 보여주고 있나요?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    // `isLagging` 필드 또한 SWR에 추가합니다.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

SWR hook이 지연될 필요가 있을 때, 이 미들웨어를 사용하면 됩니다.

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### 객체 키 직렬화하기

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed.
  If you are passing serializable objects as the key. You can serialize object keys to ensure its stability, a simple middleware can help:
</Callout>

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // 키 직렬화하기.
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // 직렬화된 키를 전달하고 fetcher에서 직렬화 해제하기.
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... 또는 전역으로 활성화
<SWRConfig value={{ use: [serialize] }}>
```

객체가 렌더링 사이에 변경될 수도 있다는 점에 대해 걱정할 필요가 없습니다. 항상 동일한 문자열로 직렬화되며 fetcher는 여전히 해당 객체 인자를 받습니다.

<Callout>
  더 나아가 `JSON.stringify` 대신에 [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify)와 같은 라이브러리를 사용하면 더 빠르고 더 안정적입니다.
</Callout>
