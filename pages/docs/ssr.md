# SSR with Next.js

With the `initialData` option, you pass an initial value to the hook. It works perfectly with many SSR solutions
such as `getServerSideProps` in [Next.js](https://github.com/zeit/next.js):

```js
export async function getServerSideProps() {
  const data = await fetcher('/api/data')
  return { props: { data } }
}

function App (props) {
  const initialData = props.data
  const { data } = useSWR('/api/data', fetcher, { initialData })

  return <div>{data}</div>
}
```

It is still a server-side rendered site, but it’s also fully powered by SWR in the client side. 
Which means the data can be dynamic and update itself over time and user interactions.
