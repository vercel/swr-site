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
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // Before hook runs...
    const swr = useSWRNext(key, fetcher, config)
    // After hook runs...
    return swr
  }
}
```

You can pass an array of middleware as an option to `SWRConfig` or `useSWR`:

```jsx
<SWRConfig value={{ middleware: [myMiddleware] }}>

// or...

useSWR(key, fetcher, { middleware: [myMiddleware] })
```

### Extend

Middleware will be extended like regular options. For example:

```jsx
function Bar () {
  useSWR(key, fetcher, { middleware: [c] })
  // ...
}

function Foo() {
  return (
    <SWRConfig value={{ middleware: [a] }}>
      <SWRConfig value={{ middleware: [b] }}>
        <Bar/>
      </SWRConfig>
    </SWRConfig>
  )
}
```

is equivalent to:

```js
useSWR(key, fetcher, { middleware: [a, b, c] })
```

### Multiple Middleware

Each middleware wraps the next middleware, and the last one just wraps the SWR hook. For example:

```jsx
useSWR(key, fetcher, { middleware: [a, b, c] })
```

The order of middleware executions will be `a → b → c`, as shown below:

```
enter A
  enter B
    enter C
      useSWR()
    exit  C
  exit  B
exit  A
```

## Examples

### Request Logger

Let's build a simple request logger middleware as an example. It prints out all the fetcher requests sent from this SWR hook. You can also use this middleware for all SWR hooks by adding it to `SWRConfig`.


```jsx
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(res => res.json())

function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // Add logger to the original fetcher.
    const entendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config)
  }
}

useSWR(key, fetcher, { middleware: [logger] })
```

Every time the request is fired, it outputs the SWR key to the console:

```
SWR Request: /api/user1
SWR Request: /api/user2
```