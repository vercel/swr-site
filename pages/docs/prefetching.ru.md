# Предварительная выборка данных

## Данные страницы верхнего уровня

Есть много способов предварительно получить данные для SWR. Для запросов верхнего уровня настоятельно рекомендуется использовать [`rel="preload"`](https://developer.mozilla.org/ru/docs/Web/HTML/Preloading_content):

```html
<link rel="preload" href="/api/data" as="fetch" crossorigin="anonymous">
```

Просто поместите его в свой HTML `<head>`. Это просто, быстро и нативно.

Он выполнит предварительную выборку данных при загрузке HTML, даже до того, как начнется загрузка JavaScript. Все ваши входящие запросы на выборку с одним и тем же URL-адресом будут повторно использовать этот результат (включая, конечно, SWR).

## Программная предварительная выборка

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

Within React rendering tree, `preload` is also avaiable to use in event handlers or effects.

```jsx
function App({ userId }) {
  const [show, setShow] = useState(false)

  // preload in effects
  useEffect(() => {
    preload('/api/user?id=' + userId, fetcher)
  }, [useId])

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

Вместе с такими техниками, как [предзагрузка страниц](https://nextjs.org/docs/api-reference/next/router#routerprefetch) в Next.js, вы сможете мгновенно загружать как следующую страницу, так и данные.

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

## Предварительное заполнение данных

Если вы хотите предварительно заполнить существующие данные в кэш SWR, вы можете использовать опцию `fallbackData`. Например:

```jsx
useSWR('/api/data', fetcher, { fallbackData: prefetchedData })
```

Если SWR ещё не получил данные, этот хук вернёт `prefetchedData` в качестве запасного варианта.

Вы также можете настроить это для всех SWR хуков и множественных ключей с помощью `<SWRConfig>` и опцией `fallback`. Смотрите подробности в разделе [Next.js SSG и SSR](/docs/with-nextjs).
