import Callout from 'nextra-theme-docs/callout'

# 自定义缓存

<Callout emoji={<span style={{fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'}}>⚠️</span>}>
  这还只是 beta 版。请安装 `swr@beta` 来试用。
</Callout>

默认情况下，SWR 使用全局缓存来存储和共享所有组件的数据。现在有了一种新方法，可以用你自己的缓存 provider 来定制。`swr@beta` 引入了新的 `cache` 配置和 `createCache` API。它们旨在解决 SWR 使用更多定制存储的问题，并提供对缓存的直接访问。

## 创建自定义缓存

### `createCache`

这个 API 接收一个底层缓存 `provider` 作为参数。返回一个对象，该对象包括可以被 SWR hook 使用的 `cache` 实例，以及可以操作相应缓存的 `mutate` API。注意，它不是全局 `mutate` API。

```js
const { mutate, cache } = createCache(provider)
```

你可以通过 SWRConfig 或 `useSWR` hook 选项传递 `cache`。

```jsx
import { SWRConfig, createCache } from 'swr'

const provider = new Map()

const { mutate, cache } = createCache(provider)

// 传递给 SWR 上下文
<SWRConfig value={{ cache }}>
  <Page />
</SWRConfig>

// 或者传递给 hook 选项
useSWR(key, fetcher, { cache })
```

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  `createCache` 不应该在渲染内部调用，它应该是一个全局单例。
</Callout>

### `provider`

provider 用于让用户直接管理缓存值，interface 应该匹配以下定义：

```ts
interface Cache<Data = any> {
  get(key: string): Data | null | undefined
  set(key: string, value: Data): void
  delete(key: string): void
}
```

在 SWR 中使用这些方法来管理缓存。除了 SWR 本身，现在用户可以直接从  `provider` 访问缓存的 key 和 value。例如，如果 provider 是一个 Map 实例，则可以使用 `Map.prototype.keys()` 通过 provider 访问使用的 key。

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  在大多数情况下，不应该直接操作缓存数据。 而应该使用 mutate 来保持状态和缓存一致。
</Callout>

### `mutate`

`createCache` 返回的 `mutate` 函数的用法类似于[数据更改](/docs/mutation)里描述的全局 `mutate` 函数，但要绑定到特定的缓存 provider。比如你想重新验证给定缓存的一些 key。

```jsx
const { cache, mutate } = createCache(new Map());

export default function App() {
  return (
    <SWRConfig value={{ cache }}>
      <div className="App">
        <Section />
        <button onClick={() => mutate("A")}>revalidate A</button>
        <button onClick={() => mutate("B")}>revalidate B</button>
      </div>
    </SWRConfig>
  );
}
```

## 示例

### 更改多个 Key

利用这些原子 API 的灵活性，你可以使用你自己的逻辑来写，例如做部分更改。在下面的示例中，`matchMutate` 接收一个正则表达式作为 key，对匹配该模式的进行更改。

```js
function matchMutate(matcher, data, shouldRevalidate = true) {
  const keys = [];
  if (matcher instanceof RegExp) {
    // `provider` 是你的缓存实现，例如 `Map()`
    for (const k of provider.keys()) {
      if (matcher.test(k)) {
        keys.push(k);
      }
    }
  } else {
    keys.push(matcher);
  }

  const mutations = keys.map((k) => mutate(k, data, shouldRevalidate));
  return Promise.all(mutations);
}

matchMutate(/^key-/) // 重新请求以 `key-` 开头的 key
matchMutate('key-a') // 重新请求 `key-a`
```
