# 뮤테이션

```js
mutate(key, data, options)
```

## Options

- `optimisticData`: 클라이언트 캐시를 즉시 업데이트하기 위한 데이터. 일반적으로 낙관적인 UI에서 사용됩니다.
- `revalidate`: 비동기 업데이트가 해소되면 캐시를 갱신합니다.
- `populateCache`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
- `rollbackOnError`: 원격 뮤테이션 에러 시 캐시를 롤백합니다.

## 갱신하기

`useSWRConfig()` hook으로부터 `mutate` 함수를 얻을 수 있으며, `mutate(key)`를 호출하여
동일한 키를 사용하는 다른 SWR hook<sup>*</sup>에게 갱신 메시지를 전역으로 브로드캐스팅할 수 있습니다.

이 예시는 유저가 “로그아웃” 버튼을 클릭할 때 로그인 정보(예, `<Profile/>` 내부)를 자동으로 갱신하는
방법을 보여줍니다.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // 쿠키를 만료된 것으로 설정
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // 이 키로 모든 SWR에게 갱신하도록 요청
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

*: _동일한 [캐시 공급자](/docs/advanced/cache) 범위 아래의 SWR hook에게 브로드캐스팅합니다. 캐시 공급자가 존재하지 않을 경우, 모든 SWR hook으로 브로드캐스팅합니다._

## 낙관적인 업데이트

많은 경우에, 데이터에 로컬 뮤테이션을 적용하는 것은 변경을 더 빠르게 느낄 수 있게 해주는 좋은 방법입니다.
데이터의 원격 소스를 기다릴 필요가 없습니다.

`mutate`를 사용하면 데이터를 재검증하고 최종적으로 최신 데이터로 대체하는 동안에,
로컬 데이터를 프로그래밍 방식으로 업데이트할 수 있습니다.

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }
        const options = { optimisticData: user, rollbackOnError: true }

        // 로컬 데이터를 즉시 업데이트하고
        // 데이터 업데이트 요청을 전송하고
        // 로컬 데이터가 올바른지 확인하기 위해 갱신(다시 가져오기)을 트리거합니다.
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> **`updateFn`**은 원격 뮤테이션을 다루기 위한 promise 또는 비동기 함수여야 합니다. 업데이트한 데이터를 반환해야 합니다.

## 현재 데이터를 기반으로 뮤테이트

현재 데이터를 기반으로 데이터의 일부를 업데이트하려는 경우가 있습니다.

`mutate`를 사용해 현재 캐시 된 값을 받는(있으면 업데이트된 문서를 반환) 비동기 함수를 전달할 수 있습니다. 

```jsx
mutate('/api/todos', async todos => {
  // ID `1`을 갖는 todo를 업데이트해 완료되도록 해봅시다
  // 이 API는 업데이트된 데이터를 반환합니다
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // 리스트를 필터링하고 업데이트된 항목을 반환합니다
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// Since the API already gives us the updated information,
// we don't need to revalidate here.
}, { revalidate: false })
```

You can also use the `populateCache` option.

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // filter the list, and return it with the updated item
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // Since the API already gives us the updated information,
  // we don't need to revalidate here.
  revalidate: false
})
```

## 뮤테이트로부터 반환된 데이터

여러분 대부분은 아마도 캐시를 업데이트하기 위한 어떤 데이터가 필요할 것입니다. 데이터는 `mutate`로 전달했던 프로미스나 비동기 함수로부터 이행되었거나 반환되었습니다.

`mutate`로 전달된 함수는 적합한 캐시 값을 업데이트하기 위해 사용되는 업데이트된 문서를 반환합니다. 해당 함수를 실행하는 동안 에러가 발생한다면,
적절하게 처리할 수 있도록 에러가 던져집니다.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // 여기에서 user를 업데이트하는 동안 발생하는 에러를 처리
}
```

## 바인딩 된 뮤테이트

`useSWR`에 의해 반환된 SWR 객체는 SWR의 키로 미리 바인딩 된 `mutate()` 함수도 포함합니다.
기능적으로는 전역 `mutate` 함수와 동일하지만 `key` 파라미터를 요구하지 않습니다.

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // 데이터를 업데이트하기 위해 API로 요청을 전송
        await requestUpdateUsername(newName)
        // 로컬 데이터를 즉시 업데이트하고 갱신(refetch)
        // 노트: 미리 바인딩 되었으므로 useSWR의 뮤테이트를 사용할 때는 key가 요구되지 않음
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```
