### Introduction

SWR is a React Hooks library for remote data fetching.

The name “**SWR**” is derived from
`stale-while-revalidate`, a HTTP cache invalidation
strategy popularized by RFC 5861.

**SWR** first returns the data from cache (stale), then sends the
fetch request (revalidate), and finally comes with the up-to-date data
again.

### Basic Data Loading

```jsx
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

In this example, the React Hook `useSWR` accepts a
`key` and a `fetcher` function. `key`
is a unique identifier of the data, normally the URL of the API. Then
`key` will be passed to `fetcher`, which can be
any asynchronous function which returns the data.

`useSWR` also returns 2 values: `data` and
`error`, based on the status of the request.

For the detailed API and more examples, visit the [repository](https://github.com/zeit/swr).
