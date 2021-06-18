import Callout from 'nextra-theme-docs/callout'

# Custom Cache

<Callout emoji={<span style={{fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'}}>⚠️</span>}>
  This is still a beta feature. Please install `swr@beta` to try it out.
</Callout>

By default, SWR uses a global cache to store and share data across all components. Now, there's a new way to customize it with your own cache provider.
The new `cache` configuration and `createCache`  API are now introduced in `swr@beta`. They're intended to solve problems of using SWR with more customized storages, and providing direct access to the cache.

## Create Custom Cache

### `createCache`

This API receive a underlay cache `provider` as argument. Returns an object, with `cache` instance that could be consumed by SWR hooks,
and `mutate` API to manipulate the corresponding cache. Note that it's not the global `mutate` API.

```js
const { mutate, cache } = createCache(provider)
```

You can pass down `cache` through SWRConfig or the `useSWR` hook options.

```jsx
import { SWRConfig, createCache } from 'swr'

const provider = new Map()

const { mutate, cache } = createCache(provider)

// pass to SWR context
<SWRConfig value={{ cache }}>
  <Page />
</SWRConfig>

// or pass to hook options
useSWR(key, fetcher, { cache })
```

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  `createCache` should not be called inside render, it should be a global singleton.
</Callout>

### `provider`

The provider is used to let user manage cache values directly, and the interface should match the following definition:

```ts
interface Cache<Data = any> {
  get(key: string): Data | null | undefined
  set(key: string, value: Data): void
  delete(key: string): void
}
```

Those methods are being used inside SWR to manage cache. Beyond SWR itself, now user can access the cached keys, values from `provider` directly.
For instance if the provider is a Map instance, you'll be able to access the used keys through provider by using `Map.prototype.keys()`.

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  In most cases, you shouldn't directly manipulate cached data. Instead always use mutate to keep the state and cache consistent.
</Callout>


### `mutate`

The usage of the `mutate` function returned by `createCache`, is similar to the global `mutate` function described on the [Mutation page](/docs/mutation), but bound to the specific cache provider. For instance, if you want to revalidate some keys from the given cache:

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

## Examples

### Mutate Multiple Keys

With the flexibilities of those atomic APIs, you can compose them with your custom logic, such as scheduling partial mutations.
In the below example, `matchMutate` can receive a regex expression as key, and be used to mutate the ones who matched this pattern.

```js
function matchMutate(matcher, data, shouldRevalidate = true) {
  const keys = [];
  if (matcher instanceof RegExp) {
    // `provider` is your cache implementation, for example a `Map()`
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

matchMutate(/^key-/) // revalidate keys starting with `key-`
matchMutate('key-a') // revalidate `key-a`
```
