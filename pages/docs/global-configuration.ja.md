# グローバルな設定

`SWRConfig` コンテキストによって、すべての SWR フックに対するグローバルな設定（ [オプション](/docs/options) ）を提供できます。

```jsx
<SWRConfig value={options}>
  <Component/>
</SWRConfig>
```

次の例では、すべての SWR フックに対して、JSON データをロードする同じフェッチャーを使い、デフォルトでは 3 秒ごとに更新するように設定します：

```jsx
import useSWR, { SWRConfig } from 'swr'

function Dashboard () {
  const { data: events } = useSWR('/api/events')
  const { data: projects } = useSWR('/api/projects')
  const { data: user } = useSWR('/api/user', { refreshInterval: 0 }) // オーバーライド

  // ...
}

function App () {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      <Dashboard />
    </SWRConfig>
  )
}
```

## ネストした設定

`SWRConfig` は親で指定された設定をマージします。

```jsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 100,
        refreshInterval: 100,
        fallback: { a: 1, b: 1 },
      }}
    >
      <SWRConfig
        value={{
          dedupingInterval: 200, // 親から渡された値を上書き
          fallback: { a: 2, c: 2 }, // 親から受け取った値とマージ
        }}
      >
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 200,
  //   refreshInterval: 100,
  //   fallback: { a: 2,  b: 1, c: 2 },
  // }
}
```

親から受け取ったプロパティをそのままマージするのではなく、それを組み合わせて新しい設定を作りたい場合には、`SWRConfig` の `value` プロパティに関数を渡すことで実現できます。関数は親で指定された設定を受け取り新しい設定を返します。

```jsx
import { SWRConfig, useSWRConfig } from 'swr'

function App() {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 100,
        refreshInterval: 100,
        fallback: { a: 1, b: 1 },
      }}
    >
      <SWRConfig
        value={parent => ({
          dedupingInterval: parent.dedupingInterval * 5,
          fallback: { a: 2, c: 2 },
        })}
      >
        <Page />
      </SWRConfig>
    </SWRConfig>
  )
}

function Page() {
  const config = useSWRConfig()
  // {
  //   dedupingInterval: 500,
  //   fallback: { a: 2, c: 2 },
  // }
}
```

## Extra APIs

### キャッシュプロバイダー

紹介されているすべてのオプションに加えて、 `SWRConfig` または `provider` 関数も受け入れます。詳細は[キャッシュ](/docs/advanced/cache)セクションを参照してください。

```jsx
<SWRConfig value={{ provider: () => new Map() }}>
  <Dashboard />
</SWRConfig>
```

### グローバル設定へアクセス

`useSWRConfig` フックを使ってグローバル設定、および[`ミューテーション`](/docs/mutation)と[`キャッシュ`](/docs/advanced/cache)を取得できます:

```jsx
import { useSWRConfig } from 'swr'

function Component () {
  const { refreshInterval, mutate, cache, ...restConfig } = useSWRConfig()

  // ...
}
```

ネストされた設定の場合は拡張されます。もし `<SWRConfig>` を使用してない場合は、デフォルトの値を返します。
