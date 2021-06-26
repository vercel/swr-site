import Callout from 'nextra-theme-docs/callout'

# カスタムキャッシュ

<Callout emoji={<span style={{fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'}}>⚠️</span>}>
  この機能はまだベータ版です。試すには `swr@beta` をインストールしてください。
</Callout>

デフォルトでは、 SWR はグローバルキャッシュを使用して、すべてのコンポーネント間でデータを保存し共有しますが、今回キャッシュプロバイダーを使用してカスタマイズする方法が追加されました。新しい `cache` 設定と `createCache` API が `swr@beta` に導入されています。
これらは、よりカスタマイズされたストレージを SWR で使用する際の問題を解決するためのもので、キャッシュに直接アクセスできるようになっています。

## カスタムキャッシュの作成

### `createCache`

この API は、キャッシュの基礎となる `provider` を引数で受け取り、 SWR フックで使用可能な `cache` インスタンスと
対応するキャッシュを操作するための `mutate` API を含むオブジェクトを返します。 グローバル `mutate` API では無いことに注意してください。

```js
const { mutate, cache } = createCache(provider)
```

また、SWRConfig や `useSWR` フックのオプションでも `cache` を渡すことができます。

```jsx
import { SWRConfig, createCache } from 'swr'

const provider = new Map()

const { mutate, cache } = createCache(provider)

// SWR コンテキストに渡す
<SWRConfig value={{ cache }}>
  <Page />
</SWRConfig>

// または、フックオプションに渡す
useSWR(key, fetcher, { cache })
```

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  `createCache` は、描画内部で呼び出すべきではなく、グローバルなシングルトンであるべきです。
</Callout>

### `provider`

プロバイダーは、ユーザーがキャッシュ値を直接管理できるようにするために使用され、インターフェースは次の定義に一致する必要があります：

```ts
interface Cache<Data = any> {
  get(key: string): Data | null | undefined
  set(key: string, value: Data): void
  delete(key: string): void
}
```

これらのメソッドは、 SWR 内部でキャッシュを管理するために使用されています。 SWR 自体を越えて、ユーザーはキャッシュされたキー、つまり `provider` からの値に直接アクセスできるようになりました。
たとえば `provider` が Map インスタンスの場合、 `Map.prototype.keys()` を使用して、プロバイダー経由で使用されているキーにアクセスすることができます。

<Callout emoji="🚨" background="bg-red-200 dark:text-gray-800">
  ほとんどの場合、キャッシュデータを直接操作するべきではありません。代わりに、常に mutate を使用してステートとキャッシュの一貫性を保つようにしてください。
</Callout>

### `mutate`

`createCache` によって返された `mutate` 関数の使い方は、[ミューテーションのページ](/docs/mutation) で解説されているグローバル `muate` 関数と同様ですが、特定のキャッシュプロバイダーにバインドされています。たとえば、指定されたキャッシュからいくつかのキーを再検証したい場合は、次のようにします：

```jsx
const { cache, mutate } = createCache(new Map())

export default function App() {
  return (
    <SWRConfig value={{ cache }}>
      <div className="App">
        <Section />
        <button onClick={() => mutate('A')}>revalidate A</button>
        <button onClick={() => mutate('B')}>revalidate B</button>
      </div>
    </SWRConfig>
  )
}
```

## 実例

### 複数のキーを変更する

これらのアトミックな API の柔軟性により、部分的な変更をスケジューリングするなど、独自のロジックで構成することができます。
以下の例では、 `matchMutate` は正規表現をキーとして受け取り、パターンに一致したモノを変更するために使用することができます。

```js
function matchMutate(matcher, data, shouldRevalidate = true) {
  const keys = []
  if (matcher instanceof RegExp) {
    // `provider` は、たとえば `Map()` のような、キャッシュの実装です。
    for (const k of provider.keys()) {
      if (matcher.test(k)) {
        keys.push(k)
      }
    }
  } else {
    keys.push(matcher)
  }

  const mutations = keys.map((k) => mutate(k, data, shouldRevalidate))
  return Promise.all(mutations)
}

matchMutate(/^key-/) // `key-` で始まるキーを再検証する
matchMutate('key-a') // `key-a` の再検証する
```

### キャッシュを LocalStorage に同期する

特別な場合には、キャッシュされたステートを `localStorage` に同期して、次回のアプリの再読み込み時に永続化されたステートをより簡単に取り出すことができます。

```js
function createProvider() {
  const map = new Map(localStorage.getItem('app-cache') || [])
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('app-cache', map.entries())
  })
  return map
}
const provider = createProvider()
const { cache, mutate } = createCache(provider)
```
