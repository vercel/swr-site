import Callout from 'nextra-theme-docs/callout'

# Cache

By default, SWR uses a global cache to store and share data across all components. But you can also customize this behavior with the `provider` option of `SWRConfig`. 

Cache providers are intended to enable SWR with more customized storages.

<Callout emoji="⚠️">
  In most cases, you shouldn't directly _write_ to the cache, which might cause undefined behaviors of SWR. If you need to manually mutate a key, please consider using the SWR APIs.<br/><br/>
  See also: [Mutation](/docs/mutation), [Reset Cache Between Test Cases](#reset-cache-between-test-cases).
</Callout>

## Cache Provider

A cache provider is Map-like object which matches the following TypeScript definition (you can import it from `swr`):

```typescript
interface Cache<Data> {
  get(key: string): Data | undefined
  set(key: string, value: Data): void
  delete(key: string): void
}
```

For example, a JavaScript Map instance can be directly used as the cache provider for SWR.

## Create Cache Provider

The `provider` option of `SWRConfig` receives a function that returns a [cache provider](#cache-provider). The provider will then be used by all SWR hooks inside that `SWRConfig` boundary. For example:

```jsx
import useSWR, { SWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig value={{ provider: () => new Map() }}>
      <Page/>
    </SWRConfig>
  )
}
```

All SWR hooks inside `<Page/>` will read and write from that Map instance. You can also use other cache provider implementations as well for your specific use case.

<Callout>
  In the example above, when the `<App/>` component is re-mounted, the provider will also be re-creacted. Normally cache providers need to be put in a higher level in the component tree.
</Callout>

<Callout type="warning" emoji="⚠️">
   If a cache provider is used, the global `mutate` will **not** work for SWR hooks under that `<SWRConfig>` boundary. Please use [this](#access-current-cache-provider) instead. 
</Callout>

## Extend Cache Provider

When multiple `<SWRConfig>` components are nested, cache provider can be overriden or extended. 

The first argument for the `provider` function is the cache provider of the upper-level `<SWRConfig>` (or the default cache if there's no parent `<SWRConfig>`), you can use it to extend the cache provider:

```jsx
<SWRConfig value={{ provider: (cache) => newCache }}>
  ...
</SWRConfig>
```

The [Example](#example) below describes one of the use cases of this.

## Access Current Cache Provider

When inside a React component, you need to use the [`useSWRConfig`](#) hook to get access to the current cache provider as well as other configurations including `mutate`:

```jsx
import { useSWRConfig } from 'swr'

function Avatar() {
  const { cache, mutate, ...extraConfig } = useSWRConfig()
  // ...
}
```

If it's not under any `<SWRConfig>`, it will return the default configurations.

## Examples

### Mutate Multiple Keys from RegEx

With the flexibility of the cache provider API, you can even build a "partial mutation" helper.

In the example below, `matchMutate` can receive a regex expression as key, and be used to mutate the ones who matched this pattern.

```js
function useMatchMutate() {
  const { cache, mutate } = useSWRConfig()
  return (matcher, ...args) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    const keys = []

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key)
      }
    }

    const mutations = keys.map((key) => mutate(key, ...args))
    return Promise.all(mutations)
  }
}
```

Then inside your component:

```jsx
function Button() {
  const matchMutate = useMatchMutate()
  return <button onClick={() => matchMutate(/^\/api\//)}>
    Revalidate all keys start with "/api/"
  </button>
}
```

<Callout>
  Note that this example requires the cache provider to be a Map instance.
</Callout>

### LocalStorage Based Persistent Cache

You might want to sync your cache to `localStorage`. Here's an example implementation:

```jsx
function localStorageProvider() {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map(JSON.parse(localStorage.getItem('swr-cache') || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  // We still use the map for write & read for performance.
  return map
}
```

Then use it as a provider:

```jsx
<SWRConfig value={{ provider: localStorageProvider }}>
  <App/>
</SWRConfig>
```

<Callout>
  As an improvement, you can also use the memory cache as a buffer, and write to `localStorage` periodically.
</Callout>

### Reset Cache Between Test Cases

When testing your application, you might want to reset the SWR cache between test cases. You can simply wrap you application with an empty cache provider. Here's an example with Jest:

```jsx
describe('test suite', async () => {
  it('test case', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <App/>
      </SWRConfig>
    )
  })
})
```
