# 引数

デフォルトで `key` は引数として `fetcher` に渡されます。したがって、次の三つの式は同等です：

```js
useSWR('/api/user', () => fetcher('/api/user'))
useSWR('/api/user', url => fetcher(url))
useSWR('/api/user', fetcher)
```

## 複数の引数

一部のシナリオでは、`fetcher` 関数に複数の引数（任意の値またはオブジェクト）を渡すと便利です。
たとえば、認証されたフェッチリクエスト：

```js
useSWR('/api/user', url => fetchWithToken(url, token))
```

これは**正しくありません**。データの識別子（キャッシュキーも） `'/api/user'` であるため、
`token` が変更された場合でも、SWR は同じキーを使用してしまい間違ったデータを返します。

代わりに、`fetcher` の複数の引数を含む**配列**を `key` パラメーターとして使用できます。

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
```

この関数 `fetchWithToken` は引き続き同じ二つの引数を受け取りますが、キャッシュキーも `token` と関連付けられます。

## オブジェクトの受け渡し

ユーザースコープでデータをフェッチする別の関数 `fetchWithUser(api, user)` があるとします。次のようなことができます：

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)
// ...そして、これを引数として別のクエリに渡します
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

リクエストのキーは、両方の値の組み合わせになりました。SWR は、すべてのレンダリングで
引数を**浅く**比較し、引数のいずれかが変更された場合は再検証を開始します。
オブジェクトはレンダリングごとに異なるオブジェクトとして扱われるため、レンダリング時にオブジェクトを再作成しないでください。

```js
// このようにしないでください！深さをもつオブジェクトはレンダリングごとに変更されます。
useSWR(['/api/user', { id }], query)

// 代わりに、"安定した" 値のみを渡す必要があります。
useSWR(['/api/user', id], (url, id) => query(url, { id }))
```

Dan Abramov は、[こちらのブログ投稿](https://overreacted.io/a-complete-guide-to-useeffect/#but-i-cant-put-this-function-inside-an-effect) で依存関係について非常によく説明しています。
