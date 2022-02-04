import Callout from 'nextra-theme-docs/callout'

# 中间件

<Callout>
  升级到最新版本（≥ 1.0.0）来使用该功能。
</Callout>

中间件是 SWR 1.0 中新增的一个功能，它让你能够在 SWR hook 之前和之后执行代码。

## 用法

中间件接收 SWR hook，可以在运行它之前和之后执行逻辑。如果有多个中间件，则每个中间件包装下一个中间件。列表中的最后一个中间件将接收原始的 SWR hook `useSWR`。

### API

_Notes: 函数名开头最好不要大写 (如使用 `myMiddleware` 来代替 `MyMiddleware`)，否则 React lint 规则会抛出 `Rules of Hook` 的错误_

[TypeScript](/docs/typescript#middleware-types)

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // hook 运行之前...

    // 处理下一个中间件，如果这是最后一个，则处理 `useSWR` hook。
    const swr = useSWRNext(key, fetcher, config)

    // hook 运行之后...
    return swr
  }
}
```

你可以将一个中间件数组作为选项传递给 `SWRConfig` 或 `useSWR`：

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// 或...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### 扩展

中间件会像常规选项一样进行扩展。例如：

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

相当于：

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### 多个中间件

每个中间件包装下一个中间件，最后一个只包装 SWR hook。例如：

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

中间件执行的顺序是 `a → b → c`，如下所示：

```plaintext
enter a
  enter b
    enter c
      useSWR()
    exit  c
  exit  b
exit  a
```

## 示例

### 请求日志记录器

我们以构建一个简单的请求日志记录器中间件为例。它打印出从这个 SWR hook 发送的所有 fetcher 请求。你也可以将这个中间件添加到 `SWRConfig` 中，以用于所有的 SWR hook。


```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // 将日志记录器添加到原始 fetcher。
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // 使用新的 fetcher 执行 hook。
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... 在你的组件里使用
useSWR(key, fetcher, { use: [logger] })
```

每次触发请求时，它都会将 SWR key 输出到控制台：

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### 保留之前的结果

有时你希望 `useSWR` 返回的数据“延迟”。即使 key 发生了变化，你仍然希望它返回之前的结果，直到新数据加载完毕。

这可以与 `useRef` 一起构建一个延迟中间件。在这个例子中，我们还将扩展 `useSWR` hook 的返回对象：

```jsx
import { useRef, useEffect, useCallback } from 'react'

// 这是一个 SWR 中间件，用于在 key 发生变化时保留数据。
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // 使用 ref 来存储之前返回的数据。
    const laggyDataRef = useRef()

    // 实际的 SWR hook。
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // 如果数据不是 undefined，更新 ref。
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // 暴露一个方法来清除延迟的数据（如果有）。
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // 如果当前数据是 undefined，则回退到之前的数据。
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data
    
    // 是否显示之前的数据？
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined
    
    // 同时将 `isLagging` 字段添加到 SWR 中。
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

当你需要一个 SWR hook 延迟时，你可以使用这个中间件：

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### 序列化对象 key

<Callout>
  从 SWR 1.1.0 开始，object 类型的 keys 可以在内部自动被序列化。
</Callout>

<Callout emoji="⚠️">
  在旧版本(< 1.1.0)中，SWR 会**浅**比较每次渲染时的参数，如果其中任何一个发生了变化，就会触发重新验证。
  如果你只是传入可序列化的对象作为 key。你可以序列化对象 key 以确保其稳定性，一个简单的中间件可以帮助你：
</Callout>

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // 序列化 key。
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // 传递序列化的 key，并在 fetcher 中将其反序列化。
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ...或全局启用
<SWRConfig value={{ use: [serialize] }}>
```

你无需担心对象在渲染期间可能会发生变化。它总是被序列化为相同的字符串，并且 fetcher 仍将接收这些对象参数。

<Callout>
  此外，你还可以使用 [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) 之类的库代替 `JSON.stringify` — 更快更稳定。
</Callout>
