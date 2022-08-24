# 数据更改

## 选项

- `optimisticData`：立即更新客户端缓存的数据，通常用于 optimistic UI。
- `revalidate`：一旦完成异步更新，缓存是否重新请求。
- `populateCache`：远程更新的结果是否写入缓存，或者是一个以新结果和当前结果作为参数并返回更新结果的函数。
- `rollbackOnError`：如果远程更新出错，是否进行缓存回滚。

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

## Mutate 的返回值

最有可能的是，你需要一些数据来更新缓存。这些数据是从你传递给 `mutate` 的 promise 或 异步函数解析或返回的。

该函数将返回一个 updated document，让 `mutate` 更新相应的缓存值。每次调用它时，都可能以某种方式抛出错误。

```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // 在这里处理更新 user 时的错误
}
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
