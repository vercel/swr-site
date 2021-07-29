# Prefetching Data

## Top-Level Page Data

There’re many ways to prefetch the data for SWR. For top level requests, [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) is highly recommended:

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

Just put it inside your HTML `<head>`. It’s easy, fast and native.

It will prefetch the data when the HTML loads, even before JavaScript starts to download. All your incoming fetch requests with the same URL will reuse the result (including SWR, of course).

## Programmatically Prefetch

Sometimes, you want to preload a resource conditionally. For example, preloading the data when the user is [hovering](https://github.com/GoogleChromeLabs/quicklink) [a](https://github.com/guess-js/guess) [link](https://instant.page). The most intuitive way is to have a function to refetch and set the cache via the global [mutate](/docs/mutation):

```js
import { mutate } from 'swr'

function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // the second parameter is a Promise
  // SWR will use the result when it resolves
}
```

Together with techniques like [page prefetching](https://nextjs.org/docs/api-reference/next/router#routerprefetch) in Next.js, you will be able to load both next page and data instantly.
