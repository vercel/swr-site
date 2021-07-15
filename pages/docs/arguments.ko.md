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

사용자 스코프를 데이터와 함께 가져오는 다른 함수가 있다고 해봅시다: `fetchWithuser(api, user)`. 다음과 같이 할 수 있습니다.

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
// ...그리고 이를 다른 쿼리의 인자로 전달
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

이 요청의 키는 이제 두 값의 조합입니다. SWR은 렌더링할 때마다 인자들을
**얕게** 비교하여 변경된 것이 있으면 갱신을 트리거 합니다.
렌더링할 때마다 객체들은 다른 객체로 취급되므로 렌더링 시에 객체를 다시 생성하지 않아야 함을 염두에 두세요.

```js
// 이렇게 하지마세요! 의존성은 렌더링할 때마다 변경될 것입니다.
useSWR(['/api/user', { id }], query)

// 대신에 “안정적인” 값들만 전달하세요.
useSWR(['/api/user', id], (url, id) => query(url, { id }))
```

Dan Abramov는 [이 블로그 글](https://overreacted.io/a-complete-guide-to-useeffect/#but-i-cant-put-this-function-inside-an-effect)에서 의존성에 대해 아주 잘 설명하고 있습니다.
