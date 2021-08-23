import Callout from 'nextra-theme-docs/callout'

# Middleware

<Callout emoji="✅">
  Please update to the latest version (≥ 1.0.0) to use this option.
</Callout>

Option `middleware` is the new addition in SWR 1.0, giving user ability to compose multiple data processors. This option let you apply any data transformers onto SWR hooks and extend the their functionality easily.

## Usage

### API

Middleware can access the previous wrapped or original `useSWR` hook, and return a function with arguments of `useSWR`. Expect to return the transformed data with the composition of hook, arguments and your optional operations here.

```jsx
const middleware(useSWRNext) => (key, fetcher, config) => {
  // enter phase ...
  const swr = useSWRNext(key, fetcher, config)
  // exit phase ...
  return swr
}
```

Grab your middlewares into an array then pass to useSWR

## Example

### Request Logger

Let's build a simple request logger middleware as example. Then use it to print out all the fetcher requests sending from SWR hook.


```jsx
import useSWR from 'swr'

const fetcher (key) => fetch(`/api?key=${key}`).then(res => res.text())

const loggerMiddleware = (useSWRNext) => (key, fetcher, config) => {
  console.log(`Request to /api with param key=${key}`)
  return useSWRNext(key, fetcher, config)
}

useSWR(key, fetcher, {
  middlewares: [loggerMiddleware]
})
```

Output in console

```
Request to /api with param key=key1
Request to /api with param key=key2
Request to /api with param key=key3
```

### Nested Middlewares

Middlwares are applied like layers of onions as the common practice of JavaScript community. 

If you have multiple fetcher inside one hook
```jsx
useSWR(key, fetcher, {
  middlewares: [A, B, C]
})
```

The execute order will be `A -> B -> C` like below:
```
enter A
  enter B
    enter C
    exit  C
  exit  B
exit  A
```

If you have any middleware configured in `SWRConfig`, it will obey the order from most outside to most inside. The order will be `A -> B`

```
<SWRConfig value={{middlewares: [A]}}>
  <SWRConfig value={{middlewares: [B]}}>
    <Page />
  </SWRConfig>
</SWRConfig>
```
