import Callout from 'nextra-theme-docs/callout'

# 中间件

<Callout emoji="✅">
  请更新到最新版本（≥ 1.0.0）来使用该选项。
</Callout>

`use` 是 SWR 1.0 中新增的一个选项，它让你能够在 SWR hook 之前和之后执行代码。

## 用法

### API

中间件接收 `useSWR` hook 的返回值并将其传递给下一个中间件（如果有的话）。你可以转换数据，使用新属性扩展返回值，还可以在 hook 运行之前或之后执行任何额外操作。

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // hook 运行之前...
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

```
enter A
  enter B
    enter C
      useSWR()
    exit  C
  exit  B
exit  A
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

```
SWR Request: /api/user1
SWR Request: /api/user2
```
