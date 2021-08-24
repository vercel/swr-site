import Callout from 'nextra-theme-docs/callout'

# Middlewares

<Callout emoji="✅">
  Please update to the latest version (≥ 1.0.0) to use this option.
</Callout>

The `middlewares` option is a new addition in SWR 1.0 that enables you to execute code before and after SWR hooks.

## Usage

### API

Middleware receive the return value of a `useSWR` hook and pass it along to the next middleware, if any. You can transform the data, extend the return value with new attributes, and perform any additional operations before or after the hook runs.

```jsx
const middleware = (useSWRNext) => (key, fetcher, config) => {
  // Before hook runs...
  const swr = useSWRNext(key, fetcher, config)
  // After hook runs...
  return swr
}
```

Pass middleware as an array to any `useSWR` hook.

## Example

### Request Logger

Let's build a simple request logger middleware as an example. It simply prints out all the fetcher requests sent from the SWR hook.


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

Every time the SWR hook runs, it will output to the console:

```
Request to /api with param key=key1
Request to /api with param key=key2
Request to /api with param key=key3
```

### Nested Middlewares

Middlwares are applied on top of each other, as commonly found in other libraries. If you pass multiple middleware to one hook:

```jsx
useSWR(key, fetcher, {
  middlewares: [A, B, C]
})
```

The order of execution will be `A → B → C`, as shown below:
```
enter A
  enter B
    enter C
    exit  C
  exit  B
exit  A
```

If you have any middleware configured in `SWRConfig`, the outermost middleware will run first. In the following example, the order will be `A → B`:

```
<SWRConfig value={{middlewares: [A]}}>
  <SWRConfig value={{middlewares: [B]}}>
    <Page />
  </SWRConfig>
</SWRConfig>
```
