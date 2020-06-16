# Prefetching Data

There’re many ways to prefetch the data for SWR. For top level requests, [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) is highly recommended:

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

This will prefetch the data before the JavaScript starts downloading. And your incoming fetch requests will reuse the result (including SWR, of course).

Another choice is to prefetch the data conditionally. You can have a function to refetch and set the cache via [mutate](/docs/mutation):

```js
function prefetch () {
  mutate('/api/data', fetch('/api/data').then(res => res.json()))
  // the second parameter is a Promise
  // SWR will use the result when it resolves
}
```

Then use it when you need to preload the **resources** (for example when [hovering](https://github.com/GoogleChromeLabs/quicklink) [a](https://github.com/guess-js/guess) [link](https://instant.page)).  

Together with techniques like [page prefetching](https://nextjs.org/docs#prefetching-pages) in Next.js, you will be able to load both next page and data instantly.
