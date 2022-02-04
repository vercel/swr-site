# 参数

默认情况下，`key` 将作为参数传递给 `fetcher`。所以下面这 3 个表达式是等价的：

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## 多个参数

在某些场景中，向 `fetcher` 函数传递多个参数（可以是任何值或对象）非常有用。例如授权请求：

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

这是 **错误的**。 因为数据的标识符（也是缓存 key）是 `'/api/user'`，所以即使 `token` 变了，SWR 仍然会使用相同的 key 并返回错误的数据。

相反，你可以使用一个 **数组** 作为参数 `key`，它包含 `fetcher` 的多个参数：

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

`fetchWithToken` 函数仍然接受同样的2个参数，但现在缓存 key 也将与 `token` 相关联。

## 传入对象

import Callout from 'nextra-theme-docs/callout'

<Callout>
  从 SWR 1.1.0 开始，object 类型的 keys 可以在内部自动被序列化。
</Callout>

假设你还有另一个使用用户范围来请求数据的函数：`fetchWithUser(api, user)`。你可以执行以下操作：

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...然后将其作为参数传递给另一个 useSWR hook
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

你可以直接传递一个对象作为 key，`fetcher` 也会接收该对象：

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  在旧版本(< 1.1.0)中，SWR 会**浅**比较每次渲染时的参数，如果其中任何一个发生了变化，就会触发重新验证。
</Callout>
