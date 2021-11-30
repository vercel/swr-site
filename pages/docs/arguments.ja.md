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

import Callout from 'nextra-theme-docs/callout'

<Callout>
  Since SWR 1.1.0, object-like keys will be serialized under the hood automatically. 
</Callout>
  
Say you have another function that fetches data with a user scope: `fetchWithUser(api, user)`. You can do the following:

```js
const { data: user } = useSWR(['/api/user', token], fetchWithToken)

// ...and then pass it as an argument to another useSWR hook
const { data: orders } = useSWR(user ? ['/api/orders', user] : null, fetchWithUser)
```

You can directly pass an object as the key, and `fetcher` will receive that object too:

```js
const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
```

<Callout emoji="⚠️">
  In older versions (< 1.1.0), SWR **shallowly** compares the arguments on every render, and triggers revalidation if any of them has changed. 
</Callout>
  
