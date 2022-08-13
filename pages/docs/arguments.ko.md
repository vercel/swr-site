# 인자

기본값으로, `key`는 인자로써 `fetcher`에 전달됩니다. 따라서 다음 세 가지 표현식은 동일합니다.

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## 다중 인자

어떤 시나리오에서는 `fetcher` 함수에 여러 인자(어떠한 값이나 객체도 가능)를 전달하는 것이 유용합니다.
인증된 가져오기 요청 예시입니다: 

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

이는 **올바르지 않습니다**. 왜냐하면 데이터의 식별자(또한 캐시 키)가 `'/api/user'`이고,
만약 `token`이 변경되어도 SWR은 여전히 동일한 키를 사용하기 때문에 잘못된 데이터를 반환합니다.

대신에 `fetcher`의 다중 인자를 포함하는 **배열**을 `key` 파라미터로 사용할 수 있습니다.

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

`fetchWithToken` 함수는 여전히 동일한 두 개의 인자를 받지만, 캐시 키는 이제 `token`과 연결되었습니다.

## 객체 전달

import Callout from 'nextra-theme-docs/callout'

<Callout>
  SWR 1.1.0부터, 유사 객체 키들은 내부에서 자동으로 직렬화됩니다.
</Callout>
  
사용자 범위로 데이터를 가져오는 `fetchWithUser(api, user)` 함수가 있다고 해봅시다. 다음과 같이 사용할 수 있습니다.

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...그 후, 이를 또 다른 useSWR hook의 인자로 전달하세요
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

객체를 키로써 바로 전달할 수 있으며 `fetcher`가 그 객체를 받습니다.

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  이전 버전(< 1.1.0)에서는, SWR은 렌더링할 때마다 인자들을 **얕게** 비교하며, 변경이 있으면 갱신을 트리거합니다.
</Callout>
