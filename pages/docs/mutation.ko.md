# 뮤테이션

SWR provides the [`mutate`](/docs/mutation#mutate) and [`useSWRMutation`](/docs/mutation#useswrmutation) APIs for mutating remote data and related cache.

## mutate

There're 2 ways to use the `mutate` API to mutate the data, the global mutate API which can mutate any key and the bound mutate API which only can mutate the data of corresponding SWR hook.

#### Global Mutate

```js
import { mutate as globalMutate, useSWRConfig } from "swr"

function App() {
  const { mutate } = useSWRConfig()
  const data = mutate(key, data, options)

  // Or you can use globalMutate directly
  // await globalMutate(key, data, options)

}
```
#### Bound Mutate

[Bound Mutate](/docs/mutation#bound-mutate) is the short path to mutate the current key with data. Which `key` is bounded to the `key` passing to SWR, and receive the `data` as the first argument.


```js
const { mutate } = useSWR(key, fetcher)

await mutate(data)
```

### API

#### Parameters

- `key`: same as `useSWR`'s `key`, but a function behaves as [a filter function](/docs/mutation#mutate-multiple-items)
- `data`: data to update the client cache, or an async function for the remote mutation
- `options`: accepts the following options
  - `optimisticData(currentData)`: data to immediately update the client cache, or a function that receives current data and returns the new client cache data, usually used in optimistic UI.
  - `revalidate = true`: should the cache revalidate once the asynchronous update resolves.
  - `populateCache = true`: should the result of the remote mutation be written to the cache, or a function that receives new result and current result as arguments and returns the mutation result.
  - `rollbackOnError = true`: should the cache rollback if the remote mutation errors.

#### Return Values

`mutate` returns the results the `data` parameter has been resolved. The function passed to `mutate` will return an updated data which is used to update the corresponding cache value. If there is an error thrown while executing the function, the error will be thrown so it can be handled appropriately.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // 여기에서 user를 업데이트하는 동안 발생하는 에러를 처리
}
```

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

You can also pass a function to `optimisticData`.

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
        mutate('/api/user', updateUserName(newName), {
            optimisticData: user => ({ ...user, name: newName }),
            rollbackOnError: true
        });
      }}>Uppercase my name!</button>
    </div>
  )
}
```

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

## Mutate Multiple Items

`mutate` accepts a filter function, which accepts `key` as the argument and returns which keys to revalidate. The filter function is applied to all the existing cache keys.

```jsx
import { mutate } from 'swr'
// Or from the hook if you customized the cache provider:
// { mutate } = useSWRConfig()

mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)
```

This also works with any key type like an array. The mutation matches all keys, of which the first element is `'item'`.

```jsx
useSWR(['item', 123], ...)
useSWR(['item', 124], ...)
useSWR(['item', 125], ...)

mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)
```

The filter function is applied to all existing cache keys, so you should not assume the shape of keys when using multiple shapes of keys.

```jsx
// ✅ matching array key
mutate((key) => key[0].startsWith('/api'), data)
// ✅ matching string key
mutate((key) => typeof key === 'string' && key.startsWith('/api'), data)

// ❌ mutate all when key's type is unsure (array or string)
mutate((key: any) => /\/api/.test(key.toString()))
```

You can use the filter function to clear all cache data, which is useful when logging out.


```js
mutate(
  () => true,
  undefined,
  { revalidate: false }
)
```

But it is unclear what it does, so you can name it `clearCache`.

```js
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)
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

## useSWRMutation

SWR also provides `useSWRMutation` as a hook for remote mutations. The remote mutations are only triggered manually, instead of automatically like `useSWR`.

```jsx
import useSWRMutation from 'swr/mutation'

async function getData(url, { arg }) {
  // Fetcher implementation.
  // The extra argument will be passed via the `arg` property of the 2nd parameter.
  // For the example below, `arg` will be `'my_token'`
}

// A useSWR + mutate like API, but it will never start the request.
const { data, error, trigger, reset, isMutating } = useSWRMutation('/api/user', getData, options?)
trigger('my_token');
```

### API

#### Parameters

- `key`: same as [`mutate`](/docs/mutation#mutate)'s `key`
- `fetcher(key, { arg })`: an async function for remote mutation
- `options`: accepts the following options
  - `optimisticData(currentData)`: same as `mutate`'s `optimisticData`
  - `revalidate = true`: same as `mutate`'s `revalidate`
  - `populateCache = false`: same as `mutate`'s `populateCache`, but the default is `false`
  - `rollbackOnError = true`: same as `mutate`'s `rollbackOnError`
  - `onSuccess(data, key, config)`:　callback function when a remote mutation has been finished successfully
  - `onError(err, key, config)`: callback function when a remote mutation has returned an error

#### Return Values

- `data`: data for the given key returned from `fetcher`
- `error`: error thrown by `fetcher` (or undefined)
- `trigger(arg, options)`: a function to trigger a remote mutation
- `reset`: a function to reset the state (`data`, `error`, `isMutating`)
- `isMutating`: if there's an ongoing remote mutation

### Basic Examples

```jsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

function App() {
  const { trigger, isMutating } = useSWRMutation('/api/user', sendRequest, /* options */)

  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'johndoe' }, /* options */)
        } catch (e) {
          // error handling
        }
      }}
    >
      Create User
    </button>
  )
}
```

If you want to use the mutation results in rendering, you can get them from the return values of `useSWRMutation`.

```jsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

`useSWRMutation` shares a cache store with `useSWR`, so it can detect and avoid race conditions between `useSWR`. It also supports `mutate`'s functionalities like optimistic updates and rollback on errors. You can pass these options `useSWRMutation` and its `trigger` function.

```jsx
const { trigger } = useSWRMutation('/api/user', updateUser, {
  optimisticData: current => ({ ...current, name: newName })
})

// or

trigger(newName, {
  optimisticData: current => ({ ...current, name: newName })
})
```

### Defer loading data until needed

You can also use `useSWRMutation` for loading data. `useSWRMutation` never start requesting until `trigger` is called, so you can defer loading data when you actually need it.

```jsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // data is undefined until trigger is called
  const { data: user, trigger } = useSWRMutation('/api/user', fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && user ? <div>{usre.name}</div> : null}
    </div>
  );
}
```
