# 프리패칭 데이터

## 최상위 레벨 페이지 데이터

SWR을 위한 데이터 프리패칭 방법은 다양합니다. 최상위 요청에 대해서는 [`rel="preload"`](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content)를 적극적으로 권장합니다.

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

HTML `<head>` 안에 넣기만 하면 됩니다. 쉽고 빠르며 네이티브입니다.

심지어 JavaScript가 다운로드 되기 전에 HTML을 로드할 때 데이터를 프리패칭 합니다. 동일한 URL로의 모든 가져오기 요청은 결과를 재사용합니다(물론 SWR도 포함).

## 프로그래밍 방식으로 프리패치

SWR provides the `preload` API to prefetch the resources programmatically and store the results in the cache. `preload` accepts `key` and `fetcher` as the arguments.

You can call `preload` even outside of React.

```jsx
import { useState } from 'react'
import useSWR, { preload } from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

// Preload the resource before rendering the User component below,
// this prevents potential waterfalls in your application.
// You can also start preloading when hovering the button or link, too.
preload('/api/user', fetcher)

function User() {
  const { data } = useSWR('/api/user', fetcher)
  ...
}

export default function App() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button onClick={() => setShow(true)}>Show User</button>
      {show ? <User /> : null}
    </div>
  )
}
```

Within React rendering tree, `preload` is also available to use in event handlers or effects.

```jsx
function App({ userId }) {
  const [show, setShow] = useState(false)

  // preload in effects
  useEffect(() => {
    preload('/api/user?id=' + userId, fetcher)
  }, [userId])

  return (
    <div>
      <button
        onClick={() => setShow(true)}
        {/* preload in event callbacks */}
        onHover={() => preload('/api/user?id=' + userId, fetcher)}
      >
        Show User
      </button>
      {show ? <User /> : null}
    </div>
  )
}
```

Next.js내의 [페이지 프리패칭](https://nextjs.org/docs/api-reference/next/router#routerprefetch)같은 기술과 함께 다음 페이지와 데이터 모두를 즉시 로드할 수 있습니다.

In Suspense mode, you should utilize `preload` to avoid waterfall problems.

```jsx
import useSWR, { preload } from 'swr'

// should call before rendering
preload('/api/user', fetcher);
preload('/api/movies', fetcher);

const Page = () => {
  // The below useSWR hooks will suspend the rendering, but the requests to `/api/user` and `/api/movies` have started by `preload` already,
  // so the waterfall problem doesn't happen.
  const { data: user } = useSWR('/api/user', fetcher, { suspense: true });
  const { data: movies } = useSWR('/api/movies', fetcher, { suspense: true });
  return (
    <div>
      <User user={user} />
      <Movies movies={movies} />
    </div>
  );
}
```

## 데이터 프리필

이미 존재하는 데이터를 SWR 캐시에 미리 채우길 원한다면, `fallbackData` 옵션을 사용할 수 있습니다. 예를 들면: 

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

SWR가 데이터를 아직 가져오지 않았다면, 이 hook은 폴백으로 `prefetchedData` 를 반환할 것입니다. 

`<SWRConfig>` 및 `fallback` 옵션을 사용하여 모든 SWR hooks 및 다중 키에 대해서도 이것을 구성할 수 있습니다. 자세한 내용은 [Next.js SSG 및 SSR](/docs/with-nextjs)을 확인하세요.
