# 数据更改

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
  - `revalidate = true`: 一旦完成异步更新，缓存是否重新请求。
  - `populateCache = true`: 远程更新的结果是否写入缓存，或者是一个以新结果和当前结果作为参数并返回更新结果的函数。
  - `rollbackOnError = true`: 如果远程更新出错，是否进行缓存回滚。

#### Return Values

`mutate` returns the results the `data` parameter has been resolved. The function passed to `mutate` will return an updated data which is used to update the corresponding cache value. If there is an error thrown while executing the function, the error will be thrown so it can be handled appropriately.

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // 在这里处理更新 user 时的错误
}
```

## 重新验证

你可以使用 `useSWRConfig()` 所返回的 `mutate` 函数，来广播重新验证的消息给其他的 SWR hook<sup>*</sup>。使用同一个 key 调用 `mutate(key)` 即可。

以下示例显示了当用户点击 “注销” 按钮时如何自动重新请求登录信息（例如在 `<Profile/>` 内）：

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // 将 cookie 设置为过期
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // 告诉所有具有该 key 的 SWR 重新验证
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

*: _通常情况下 mutate 会广播给同一个 [cache provider](/docs/cache) 下面的 SWR hooks。如果没有设置 cache provider，即会广播给所有的 SWR hooks。_

## 乐观更新

在很多情况中，对数据应用本地 mutation 是一种让更改感觉更快的好办法 - 无需等待远程数据源。

使用 `mutate`，你可以以编程方式更新本地数据，同时重新验证并最终将其替换为最新数据。

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

        // 立即更新本地数据
        // 发送请求更新数据
        // 触发重新验证（重新请求）以确保本地数据是正确的
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```
> **`updateFn`** 应该是一个 promise 或异步函数来处理远程更新，它应该返回更新后的数据。

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

## 根据当前数据更改

有时，你想基于当前数据更新部分你的数据。

使用 `mutate`，你可以传递一个异步函数，该函数将接收当前缓存的值（如果有的话），并返回一个 updated document。

```jsx
mutate('/api/todos', async todos => {
  // 把 ID 为 1 的更新为 completed，
  // 该 API 返回更新后的数据
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // 筛选列表，返回更新后的 item
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
  // API 已经给我们提供了更新的信息，
  // 所以我们不需要在这里重新请求。
},　{ revalidate: false })
```

还可以使用 `populateCache`。

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // 筛选列表，返回更新后的 item
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // API 已经给我们提供了更新的信息，
  // 所以我们不需要在这里重新请求。
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

## 绑定的 Mutate 函数

`useSWR` 返回的 SWR 对象还包含一个 `mutate()` 函数，该函数预先绑定到 SWR 的 key。

它在功能上等同于全局 `mutate` 函数，但不需要 `key` 参数。

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // 向 API 发送请求以更新数据
        await requestUpdateUsername(newName)
        // 立即更新本地数据并重新验证 (重新请求)
        // 注意：在使用 useSWR 的 mutate 时，key 是不需要的，因为它是预先绑定的
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
