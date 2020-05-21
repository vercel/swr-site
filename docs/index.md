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

### Focus Revalidation

When you re-focus a page or switch between tabs, SWR automatically
revalidates data.

This can be useful to immediately synchronize to the latest state.
This is helpful for refreshing data in scenarios like stale mobile
tabs, or laptops that <mark>went to sleep</mark>.

<figure>
    <video loop muted autoPlay playsInline src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:50/v1572271867/swr/example-videos/focus-revalidate.mp4"></video>
    <figcaption>Using focus revalidation to automatically sync login state between pages.</figcaption>
</figure>

### Fast Navigation

When navigating through pages or sections inside a system (e.g.: in
Next.js), or when pressing the back button, it’s often desirable to
load a cached version of the data.

To achieve eventual consistency, SWR will automatically revalidate the
data from the origin as soon as data is rendered from the cache.

<figure>
    <video loop muted autoPlay playsInline src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:70/v1572278352/swr/example-videos/fast-navigation.mp4"></video>
    <figcaption>
        SWR will make cached pages render much faster, then update the cache
        with the latest data.
    </figcaption>
</figure>

### Refetch on Interval

In many cases, data changes because of multiple devices, multiple
users, multiple tabs. How can we over time update the data on screen?

SWR will give you the option to automatically refetch data. It’s
<mark>smart</mark> which means refetching will only happen if the
component associated with the hook is <mark>on screen</mark>.

<figure>
    <video loop muted autoPlay playsInline src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:40/v1572274198/swr/example-videos/refetch-interval.mp4"></video>
    <figcaption>When a user makes a change, both sessions will eventually render the same data.</figcaption>
</figure>

### Local Mutation

SWR scales extremely well because it requires very little effort to
write applications that automatically and eventually converge to the
most recent remote data.

In many cases, applying local mutations to data is a good way to make
changes feel faster — no need to wait for the remote source of data.
Local mutations are a completely optional way to set a temporary local
state that will automatically update on the next revalidation.

<figure>
    <video loop muted autoPlay playsInline src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:40/v1572283098/swr/example-videos/local-mutation.mp4"></video>
    <figcaption>
        Notice that we also still revalidate, which means our backend is
        decapitalizing the name and applying different rules that our
        frontend has forgotten to enforce.
    </figcaption>
</figure>

### Scroll Position Recovery and Pagination

SWR features built-in support for APIs that return data in chunks,
with the corresponding UI for “load more”.

And even further, when navigating back to the “load more” list,
everything including the <mark>scroll position</mark> will be
recovered automatically.

<figure>
    <video loop muted autoPlay playsInline src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:80/v1572275644/swr/example-videos/swr-pages.mp4"></video>
    <figcaption>
        An infinite scroll UI on the <a href="https://vercel.com">Vercel</a>
        dashboard, SWR will recover your scroll position.
    </figcaption>
</figure>

### Custom Data Fetching

Other than using the native `fetch` and assumes a
REST-style API call, the developer can define any asynchronous
function as the fetcher. For example, GraphQL:

```jsx
import { request } from 'graphql-request'
import useSWR from 'swr'

const API = 'https://api.graph.cool/simple/v1/movies'

function MovieActors() {
  const { data, error } = useSWR(
    `{
      Movie(title: "Inception") {
        actors {
          id
          name
        }
      }
    }`,
    query => request(API, query)
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return data.actors.map(actor => <li key={actor.id}>{actor.name}</li>)
}
```

### Dependent Fetching

SWR allows you to fetch data that depends on other data. It ensures
the maximum possible parallelism (avoiding waterfalls), as well as
serial fetching when a piece of dynamic data is required for the next
data fetch to happen.

```jsx
import useSWR from 'swr'

function MyProjects() {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(() => '/api/projects?uid=' + user.id)
  // When passing a function, SWR will use the
  // return value as `key`. If the function throws,
  // SWR will know that some dependencies are not
  // ready. In this case it is `user`.

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}
```

### Suspense

You can also use SWR Hooks with React Suspense. Just enable
`suspense: true` in the SWR config and everything will work
smoothly.

```jsx
import { Suspense } from 'react'
import useSWR from 'swr'

function Profile() {
  const { data } = useSWR('/api/user', fetcher, { suspense: true })
  return <div>hello, {data.name}</div>
}

function App() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Profile />
    </Suspense>
  )
}
```

<br />
<br />

Visit the [GitHub Repository](https://github.com/zeit/swr) for more examples and documentation.
