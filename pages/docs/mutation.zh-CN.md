# 数据更改 & 重新验证

SWR provides the [`mutate`](/docs/mutation#mutate) and [`useSWRMutation`](/docs/mutation#useswrmutation) APIs for mutating remote data and related cache.

## `mutate`

There're 2 ways to use the `mutate` API to mutate the data, the global mutate API which can mutate any key and the bound mutate API which only can mutate the data of corresponding SWR hook.

#### Global Mutate

推荐使用 [`useSWRConfig`](/docs/global-configuration#access-to-global-configurations) hook 获取全局 `mutator`：

```js
import { useSWRConfig } from "swr"

function App() {
  const { mutate } = useSWRConfig()
  mutate(key, data, options)
}
```

你也可以全局引入它：

```js
import { mutate } from "swr"

function App() {
  mutate(key, data, options)
}
```

#### 绑定数据更改

绑定数据更改以更便捷的方式来更改当前 key 数据，它的 `key` 与传递给 `useSWR` 的 `key` 相绑定，并接收 `data` 作为第一个参数。

它在功能上等同于上文提到的的全局 `mutate` 函数，但它不需要传入 `key` 参数：

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // 发送请求给 API 以更新数据
        await requestUpdateUsername(newName)
        // 立即更新并重新验证本地数据
        // 注意： 当使用 useSWR 的 mutate 时，key 并不是必须的，因为它已经预先绑定了。
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

#### 重新验证

当你调用 `mutate(key)`（或者只是使用绑定数据更改 API `mutate()`）时没有传入任何数据，它会触发资源的重新验证(将数据标记为已过期并触发重新请求)。这个例子展示了当用户点击 “Logout” 按钮时如何自动重新请求登陆信息。

```jsx {14}
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // set the cookie as expired
        // 设置 cookie 为已过期
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // tell all SWRs with this key to revalidate
        // 通知所有拥有这个 key SWR 重新验证 
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

import Callout from 'nextra-theme-docs/callout'

<Callout>
它向同一个 [缓存 provider](/docs/advanced/cache) 范围内的 SWR hook 进行广播。如果不存在缓存 provider 就会向 SWR hook 进行广播。
</Callout>


### API

#### Parameters

- `key`：与 `useSWR` 的 `key` 相同，但函数则表现为 [过滤函数](/docs/mutation#mutate-multiple-items)。
- `data`：用于更新客户端缓存的数据，或者用一个异步函数来进行远程数据更改。
- `options`：接受下列选项
  - `optimisticData`：用于立即更新客户端缓存的数据，或是一个接受当前数据并返回新的客户端缓存数据的函数，通常用于乐观 UI。
  - `revalidate = true`：一旦异步更新完成，重新验证缓存。
  - `populateCache = true`：将远程数据更改的结果写入缓存，或者将接收新结果和当前结果作为参数并返回数据更改结果的函数。
  - `rollbackOnError = true`：如果远程数据更改失败，缓存会回滚。或者接受一个函数，接收从 fetcher 抛出的错误作为参数，并返回一个布尔值判断是否应该回滚。
  - `throwOnError = true`：数据更改失败时抛出错误。

#### 返回值

`mutate` 返回参数的 `data` 是被解析过的结果。传递给 `mutate` 的函数将返回一个更新后的数据，用于更新相应的缓存值。如果在执行函数时出现错误，错误将被抛出，以便进行合适的处理。

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // 处理更新用户时出现的错误
}
```

## `useSWRMutation`

SWR 还提供了 `useSWRMutation` 作为一个远程更改数据的 hook。远程数据更改只能手动触发，而不像 `useSWR` 那样会自动触发。

另外，这个 hook 不会与其他 `useSWRMutation` hook 共享状态。

```jsx
import useSWRMutation from 'swr/mutation'

// 实现 fetcher
// 额外的参数可以通过第二个参数 `arg` 传入
// 在下例中，`arg` 为 `'my_token'`
async function updateUser(url, { arg }) {
  await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${arg}`
    }
  })
}

function Profile() {
  // 一个类似 useSWR + mutate 的 API，但是它不会自动发送请求
  const { trigger } = useSWRMutation('/api/user', updateUser, options?)

  return <button onClick={() => {
    // Trigger `updateUser` with a specific argument.
    // 以特定参数触发 `updateUser`
    trigger('my_token')
  }}>Update User</button>
}
```

### API

#### 参数

- `key`: same as [`mutate`](/docs/mutation#mutate)'s `key`
- `key`: 与 [`mutate`](/docs/mutation#mutate) 的 `key` 相同
- `fetcher(key, { arg })`: an async function for remote mutation
- `fetcher(key, { arg })`：一个用于远程数据更改的异步函数
- `options`: an optional object with the following properties:
- `options`：一个可选的对象，包含了下列属性：
  - `optimisticData`: same as `mutate`'s `optimisticData`
  - `optimisticData`：与 `mutate` 的 `optimisticData` 相同
  - `revalidate = true`: same as `mutate`'s `revalidate`
  - `revalidate = true`：与 `mutate` 的 `revalidate` 相同
  - `populateCache = false`: same as `mutate`'s `populateCache`, but the default is `false`
  - `rollbackOnError = true`: same as `mutate`'s `rollbackOnError`
  - `throwOnError = true`: same as `mutate`'s `throwOnError`
  - `onSuccess(data, key, config)`:　callback function when a remote mutation has been finished successfully
  - `onError(err, key, config)`: callback function when a remote mutation has returned an error

#### Return Values
#### 返回值

- `data`：从 `fetcher` 返回给定 key 的数据 
- `error`: error thrown by `fetcher` (or undefined)
- `error`：`fetcher` 中抛出的错误（或 undefined）。
- `trigger(arg, options)`：一个用于触发远程数据更改的函数
- `reset`：一个用于重置状态的函数（ `data`, `error`, `isMutating` ）
- `isMutating`：有一个正在进行中的远程数据变更

### 基本用法

```jsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  }).then(res => res.json())
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
          // 错误处理
        }
      }}
    >
      Create User
    </button>
  )
}
```

如果你想在渲染时使用数据更改的结果，你可以从 `useSWRMutation` 的返回值中获得。

```jsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

`useSWRMutation` 与 `useSWR` 共享一个缓存空间，所以它可以避免 `useSWR` 间的竞态条件。它还支持 `mutate` 的功能，如乐观更新和错误回滚。你可以将这些选项传入 `useSWRMutation` 和它的 `trigger` 函数。

```jsx
const { trigger } = useSWRMutation('/api/user', updateUser, {
  optimisticData: current => ({ ...current, name: newName })
})

// 或者

trigger(newName, {
  optimisticData: current => ({ ...current, name: newName })
})
```

### 延迟加载数据，直到需要的时候

你也可以使用 `useSWRMutation` 来加载数据。`useSWRMutation` 在 `trigger` 被调用之前永远不会开始请求，所以你可以推迟到真正需要时再加载数据。

```jsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // 直到 trigger 被调用前，data 都为 undefined 
  const { data: user, trigger } = useSWRMutation('/api/user', fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && user ? <div>{user.name}</div> : null}
    </div>
  );
}
```

## 乐观更新

很多情况下，应用本地的数据更改是一个让人感觉快速的好方法--不需要等待远程数据源。

With the `optimisticData` option, you can update your local data manually, while
waiting for the remote mutation to finish. Composing `rollbackOnError` you can also
control when to rollback the data.

使用 `optimisticData` 选项，你可以手动更新你的本地数据，同时等待远程数据更改的完成。搭配 `rollbackOnError` 使用，你还可以
控制何时回滚数据。

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
        const options = {
          optimisticData: user,
          rollbackOnError(error) {
            // If it's timeout abort error, don't rollback
            // 如果超时中止请求的错误，不执行回滚
            return error.name !== 'AbortError'
          },
        }

        // updates the local data immediately
        // 立即更新本地数据
        // send a request to update the data
        // 发送一个请求以更新数据
        // triggers a revalidation (refetch) to make sure our local data is correct
        // 触发重新验证（重新请求）确保本地数据正确
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> The **`updateFn`** should be a promise or asynchronous function to handle the remote mutation, it should return updated data.
> **`updateFn`** 应该是一个 promise 或者异步函数以处理远程数据更改，它应该返回更新后的数据。

You can also pass a function to `optimisticData` to make it depending on the current data:

你也可以为 `optimisticData` 传入一个函数使其可以获取当前数据：

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

You can also create the same thing with `useSWRMutation` and `trigger`:

你还可以通过 `useSWRMutation` 和 `trigger` 实现相同的功能：

```jsx
import useSWRMutation from 'swr/mutation'

function Profile () {
  const { trigger } = useSWRMutation('/api/user', updateUserName)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()

        trigger(newName, {
          optimisticData: user => ({ ...user, name: newName }),
          rollbackOnError: true
        })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## Rollback on Errors
## 错误回滚

When you have `optimisticData` set, it’s possible that the optimistic data gets
displayed to the user, but the remote mutation fails. In this case, you can enable
`rollbackOnError` to revert the local cache to the previous state, to make sure
the user is seeing the correct data.

当你设置了`optimisticData` 选项时，有可能在乐观数据展示给用户后，远程数据更改却失败了。在这种情况下，你可以启用`rollbackOnError`，将本地缓存恢复到之前的状态，确保用户看到的是正确的数据。

## Update Cache After Mutation
## 在数据更改后更新缓存

Sometimes, the remote mutation request directly returns the updated data, so there is no need to do an extra fetch to load it.
You can enable the `populateCache` option to update the cache for `useSWR` with the response of the mutation:

有时，远程数据更改的请求直接返回更新后的数据，所以不需要做额外的请求来加载它。
你可以启用 `populateCache` 选项，用数据更改的响应来更新 `useSWR` 的缓存。

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // 过滤列表，并将更新项返回
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // Since the API already gives us the updated information,
  // we don't need to revalidate here.
  // 因为 API 已经给了我们更新后的数据，所以我们不需要重新验证它。
  revalidate: false
})
```

Or with the `useSWRMutation` hook:

```jsx
useSWRMutation('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // filter the list, and return it with the updated item
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // Since the API already gives us the updated information,
  // we don't need to revalidate here.
 // 因为 API 已经给了我们更新后的数据，所以我们不需要重新验证它。
  revalidate: false
})
```

When combined with `optimisticData` and `rollbackOnError`, you’ll get a perfect optimistic UI experience.
当 `optimisticData` 与 `rollbackOnError` 搭配使用时，你将获得最佳的乐观 UI 体验。

## Avoid Race Conditions
## 避免竞态条件

Both `mutate` and `useSWRMutation` can avoid race conditions between `useSWR`. For example,
`mutate` 和 `useSWRMutation` 都可以避免 `useSWR` 之间的竞赛条件。例如：

```tsx
function Profile() {
  const { data } = useSWR('/api/user', getUser, { revalidateInterval: 3000 })
  const { trigger } = useSWRMutation('/api/user', updateUser)

  return <>
    {data ? data.username : null}
    <button onClick={() => trigger()}>Update User</button>
  </>
}
```

The normal `useSWR` hook might refresh its data any time due to focus, polling, or other conditions. This way the displayed username
can be as fresh as possible. However, since we have a mutation there that can happen at the nearly same time of a refetch of `useSWR`, there
could be a race condition that `getUser` request starts earlier, but takes longer than `updateUser`.
正常情况下 `useSWR` hook 可能会因为聚焦，轮询或者其他条件在任何时间刷新，这使得展示的 username 尽可能是最新的。然而，由于我们在`useSWR` 的刷新过程中几乎同时发生了一个数据更改，可能会出现 `getUser` 请求更早开始，但是花的时间比 `updateUser` 更长，导致竞态情况。

Luckily, `useSWRMutation` handles this for you automatically. After the mutation, it will tell `useSWR` to ditch the ongoing request and revalidate,
so the stale data will never be displayed.

幸运的是 `useSWRMutation` 可以为你自动处理这种情况。在数据更改后，它会告诉 `useSWR` 放弃正在进行的请求和重新验证，所以旧的数据永远不会被显示。

## Mutate Based on Current Data
## 基于当前数据进行数据更改

Sometimes, you want to update a part of your data based on the current data.
有时你想根据当前的数据来更新部分数据。

With `mutate`, you can pass an async function which will receive the current cached value, if any, and returns an updated document.

通过 `mutate `，你可以传入一个接收当前缓存值的异步函数，如果有的话，并返回一个更新的文档。

```jsx
mutate('/api/todos', async todos => {
  // let's update the todo with ID `1` to be completed,
  // this API returns the updated data
  // 让我们将 ID 为 `1` 的待办事项更新为已完成
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // filter the list, and return it with the updated item
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// Since the API already gives us the updated information,
// we don't need to revalidate here.
// 因为 API 已经给了我们更新后的信息，所以我们不需要去重新验证它。
}, { revalidate: false })
```

## Mutate Multiple Items
## 更改多项数据

The global `mutate` API accepts a filter function, which accepts `key` as the argument and returns which keys to revalidate. The filter function is applied to all the existing cache keys:
全局 `mutate` API 接受一个过滤函数，它接受 `key' 作为参数并返回需要重新验证的 key。过滤函数会被应用于所有已有的缓存 key。

```jsx
import { mutate } from 'swr'
// Or from the hook if you customized the cache provider:
// 如果你自定义了缓存 provider，也可以从 hook 上获取。
// { mutate } = useSWRConfig()

mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)
```

This also works with any key type like an array. The mutation matches all keys, of which the first element is `'item'`.
这同时适用于如数组等任何类型的 key 。这个数据更改会匹配所有第一个元素为 `'item'` 的 key。

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
过滤函数应用于所有现有的缓存 key，所以当使用多种形状的键时，你不应该假设键的形状。

```jsx
// ✅ 匹配的数组 key 值
mutate((key) => key[0].startsWith('/api'), data)
// ✅ 匹配字符串 key 值
mutate((key) => typeof key === 'string' && key.startsWith('/api'), data)

// ❌ ERROR: mutate uncertain keys (array or string)
// ❌ ERROR: 更改不确定的key 的数据 (array or string)
mutate((key: any) => /\/api/.test(key.toString()))
```

You can use the filter function to clear all cache data, which is useful when logging out:
你可以使用过滤函数来清除所有的缓存数据，这在退出登陆时很有用。

```js
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)

// ...clear cache on logout
// ...退出登陆时清除所有缓存
clearCache()
```
