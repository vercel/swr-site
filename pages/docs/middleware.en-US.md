import Callout from 'nextra-theme-docs/callout'

# Middleware

<Callout>
  Upgrade to the latest version (≥ 1.0.0) to use this feature.
</Callout>

The middleware feature is a new addition in SWR 1.0 that enables you to execute logic before and after SWR hooks.

## Usage

Middleware receive the SWR hook and can execute logic before and after running it. If there are multiple middleware, each middleware wraps the next middleware. The last middleware in the list will receive the original SWR hook `useSWR`.

### API

_Notes: The function name shouldn't be capitalized (e.g. `myMiddleware` instead of `MyMiddleware`) or React lint rules will throw `Rules of Hook` error_

[TypeScript](https://swr.vercel.app/docs/typescript#middleware-types)

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // Before hook runs...

    // Handle the next middleware, or the `useSWR` hook if this is the last one.
    const swr = useSWRNext(key, fetcher, config)

    // After hook runs...
    return swr
  }
}
```

You can pass an array of middleware as an option to `SWRConfig` or `useSWR`:

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// or...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### Extend

Middleware will be extended like regular options. For example:

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

is equivalent to:

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### Multiple Middleware

Each middleware wraps the next middleware, and the last one just wraps the SWR hook. For example:

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

The order of middleware executions will be `a → b → c`, as shown below:

```plaintext
enter a
  enter b
    enter c
      useSWR()
    exit  c
  exit  b
exit  a
```

## Examples

### Request Logger

Let's build a simple request logger middleware as an example. It prints out all the fetcher requests sent from this SWR hook. You can also use this middleware for all SWR hooks by adding it to `SWRConfig`.

```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // Add logger to the original fetcher.
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // Execute the hook with the new fetcher.
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... inside your component
useSWR(key, fetcher, { use: [logger] })
```

Every time the request is fired, it outputs the SWR key to the console:

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### Keep Previous Result

Sometimes you want the data returned by `useSWR` to be "laggy". Even if the key changes,
you still want it to return the previous result until the new data has loaded.

This can be built as a laggy middleware together with `useRef`. In this example, we are also going to
extend the returned object of the `useSWR` hook:

```jsx
import { useRef, useEffect, useCallback } from 'react'

// This is a SWR middleware for keeping the data even if key changes.
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // Use a ref to store previous returned data.
    const laggyDataRef = useRef()

    // Actual SWR hook.
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data

    // Is it showing previous data?
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    // Also add a `isLagging` field to SWR.
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

When you need a SWR hook to be laggy, you can then use this middleware:

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### Serialize Object Keys

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed.
  If you are passing serializable objects as the key. You can serialize object keys to ensure its stability, a simple middleware can help:
</Callout>

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // Serialize the key.
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // Pass the serialized key, and unserialize it in fetcher.
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... or enable it globally with
<SWRConfig value={{ use: [serialize] }}>
```

You don’t need to worry that object might change between renders. It’s always serialized to the same string, and the fetcher will still receive those object arguments.

<Callout>
  Furthermore, you can use libs like [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) instead of `JSON.stringify` — faster and stabler.
</Callout>
