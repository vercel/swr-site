# ミューテーション

SWR はリモートデータ及びキャッシュデータの更新のために [`mutate`](/docs/mutation#mutate) と [`useSWRMutation`](/docs/mutation#useswrmutation) を提供しています。

## mutate

```js
const data = await mutate(key, data, options)
```

### API

#### パラメーター

- `key`: `useSWR` の `key` と同じですが関数を渡した場合は[フィルタリング関数](/docs/mutation#mutate-multiple-items)として振る舞います
- `data`: クライアントキャッシュを更新するためのデータ、またはリモートミューテーションのための Async Functions
- `options`: 下記のオプションを受け取ります
  - `optimisticData(currentData)`: 即座にクライアントキャッシュを更新するためのデータ、または現在のデータを受け取り新しいキャッシュデータを返す関数。楽観的な UI 更新を実現するために使われます
  - `revalidate = true`: リモートミューテーションが完了した際にキャッシュを再検証するかどうか
  - `populateCache = true`: リモートミューテーションの結果をキャッシュに書き込むかどうか、または更新後のデータと現在のデータを受け取りミューテーションの結果としてキャッシュに保存するデータを返す関数
  - `rollbackOnError = true`: リモートミューテーションでエラーが発生した才にキャッシュをロールバックするかどうか

#### 返り値

`mutate` は `data` パラメーターが解決された結果を返します。`mutate` に渡されるこの関数は、対応するキャッシュ値を更新できるように、更新されたデータを返します。この関数を実行している際にエラーが発生したときには、適切な対処ができるようにそのエラーを投げます。


```jsx
try {
  const user = await mutate('/api/user', updateUser(newUser))
} catch (error) {
  // ここでユーザーの更新中にエラーを処理します
}
```

## 再検証

`useSWRConfig()` フックから `mutate` 関数を取得し、`mutate(key)` を呼び出すことで、
再検証メッセージを他の SWR フック<sup>\*</sup>に渡すことができます。

次の例では、ユーザーが "Logout" ボタンをクリックしたときに、ログイン情報
（ たとえば `<Profile/> `の中身 ）を自動的に取得する方法を示します。

```jsx
import useSWR, { useSWRConfig } from 'swr'

function App () {
  const { mutate } = useSWRConfig()

  return (
    <div>
      <Profile />
      <button onClick={() => {
        // クッキーを期限切れとして設定します
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'

        // このキーを使用してすべての SWR に再検証するように指示します
        mutate('/api/user')
      }}>
        Logout
      </button>
    </div>
  )
}
```

\*: 同じ [キャッシュプロバイダー](advanced/cache) のスコープ下では、 SWR フックに渡されます。もしキャッシュプロバイダーが無ければ、すべての SWR フックに渡されます。

## 楽観的な更新

多くの場合、データにローカルミューテーションを適用することは、変更をより速く
感じさせるための良い方法です。データのリモートソースを待つ必要はありません。

`mutate` を使用すると、再検証の間にプログラムでローカルデータを更新しておき、
最終的に最新のデータに置き換えることができます。

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        const user = { ...data, name: newName }
        const options = { optimisticData: user, rollbackOnError: true }

        // 再検証をせずに直ちにローカルデータを更新します
        // ソースを更新するためにリクエストを送信します
        // ローカルデータが最新であることを確かめるために再検証（再取得）を起動します
        mutate('/api/user', updateFn(user), options);
      }}>Uppercase my name!</button>
    </div>
  )
}
```

> **`updateFn`** は、リモートミューテーションを処理するための promise 関数か非同期関数でなければならず、更新されたデータを返す必要があります。

`optimisticData` に関数を渡すこともできます。

```jsx
import useSWR, { useSWRConfig } from 'swr'

function Profile () {
  const { mutate } = useSWRConfig()
  const { data } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        mutate('/api/user', updateUserName(newName), {
            optimisticData: user => ({ ...data, name: newName }),
            rollbackOnError: true
        });
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## 現在のデータにもとづいたミューテート

現在のデータにもとづいて、データの一部を更新したい場合があります。

`mutate` を使用すると、現在キャッシュされている値がある場合はそれを受け取り、更新されたドキュメントを返す非同期関数を渡すことができます。

```jsx
mutate('/api/todos', async todos => {
  // 完了するために ID `1` で todo を更新しましょう。
  // この API は更新されたデータを返します。
  const updatedTodo = await fetch('/api/todos/1', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true })
  })

  // リストをフィルタリングし、更新されたアイテムを返します
  const filteredTodos = todos.filter(todo => todo.id !== '1')
  return [...filteredTodos, updatedTodo]
// API からすでに更新後の情報が取得できるため
// 再検証する必要はありません
},　{ revalidate: false })
```

`populateCache` オプションも使用可能です。

```jsx
const updateTodo = () => fetch('/api/todos/1', {
  method: 'PATCH',
  body: JSON.stringify({ completed: true })
})

mutate('/api/todos', updateTodo, {
  populateCache: (updatedTodo, todos) => {
    // リストをフィルタリングし、更新されたアイテムを返します
    const filteredTodos = todos.filter(todo => todo.id !== '1')
    return [...filteredTodos, updatedTodo]
  },
  // API からすでに更新後の情報が取得できるため
  // 再検証する必要はありません
  revalidate: false
})
```

## 複数のアイテムをミューテートする

`mutate` は `key` を引数として受け取りどのキーを再検証するかどうかを返すフィルタリング関数を受け取ります。フィルタリング関数は全てのキャッシュキーに対して適用されます。

```jsx
import { mutate } from 'swr'
// Or from the hook if you customized the cache provider:
// { mutate } = useSWRConfig()

mutate(
  key => typeof key === 'string' && key.startsWith('/api/item?id='),
  undefined,
  { revalidate: true }
)
```

This also works with any key type like an array. The mutation matches all keys, of which the first element is `'item'`.

```jsx
useSWR(['item', 123], ...)
useSWR(['item', 124], ...)
useSWR(['item', 125], ...)

mutate(
  key => Array.isArray(key) && key[0] === 'item',
  undefined,
  { revalidate: false }
)
```

You can use the filter function to clear all cache data, which is useful when logging out.


```js
mutate(
  () => true,
  undefined,
  { revalidate: false }
)
```

But it is unclear what it does, so you can name it `clearCache`.

```js
const clearCache = () => mutate(
  () => true,
  undefined,
  { revalidate: false }
)
```

## バウンドミューテート

`useSWR` によって返される SWR オブジェクトには、SWR のキーに事前にバインドされている `mutate()` 関数も含まれています。

機能的にはグローバルな `mutate` 関数と同等ですが、`key` パラメーターは必要ありません。

```jsx
import useSWR from 'swr'

function Profile () {
  const { data, mutate } = useSWR('/api/user', fetcher)

  return (
    <div>
      <h1>My name is {data.name}.</h1>
      <button onClick={async () => {
        const newName = data.name.toUpperCase()
        // このデータを更新するために API へリクエストを送ります
        await requestUpdateUsername(newName)
        // ローカルデータをすぐに更新し、再検証（再フェッチ）します
        // 注：useSWR の mutate を事前にバインドされているものとして使用する場合にはキーは必要ありません
        mutate({ ...data, name: newName })
      }}>Uppercase my name!</button>
    </div>
  )
}
```

## useSWRMutation

SWR はリモートミューテーションのためのフックとして `useSWRMutation` を提供します。このリモートミューテーションは `useSWR` のように自動的に実行されるのとは異なり手動でのみ実行されます。

```jsx
import useSWRMutation from 'swr/mutation'

async function getData(url, { arg }) {
  // fetcher の実装
  // 追加の引数は二番目の `arg` プロパティとして渡されます
  // 例えば下記ケースでは `arg` は `my_token` になります
}

// useSWR と mutate を組み合わせたような API ですが、下記ではリクエストは実行されません
const { data, error, trigger, reset, isMutating } = useSWRMutation('/api/user', getData, options?)
trigger('my_token');
```

### API

#### パラメーター

- `key`: [`mutate`](/docs/mutation#mutate) の `key` と同様
- `fetcher(key, { arg })`: リモートミューテーションのための Async Functions
- `options`: 下記のオプションを受けとります
  - `optimisticData(currentData)`: `mutate` の `optimisticData` と同様
  - `revalidate = true`:  `mutate` の `revalidate` と同様
  - `populateCache = false`: `mutate` の `populateCache` と同様。デフォルトは `false`
  - `rollbackOnError = true`: `mutate` の `rollbackOnError` と同様
  - `onSuccess(data, key, config)`: リモートミューテーションが成功した時に呼ばれるコールバック関数
  - `onError(err, key, config)`: リモートミューテーションが失敗した時に呼ばれるコールバック関数

#### 返り値

- `data`: `fetcher` から返された `key` に対応するデータ
- `error`: `fetcher` から返されたエラー (または undefined)
- `trigger(arg, options)`: リモートミューテーションを実行するための関数
- `reset`: 状態  (`data`, `error`, `isMutating`) をリセットするための関数
- `isMutating`: 実行中のリモートミューテーションがあるかどうか

### 基本的な例

```jsx
import useSWRMutation from 'swr/mutation'

async function sendRequest(url, { arg }) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg)
  })
}

function App() {
  const { trigger, isMutating } = useSWRMutation('/api/user', sendRequest, /* options */)

  return (
    <button
      disabled={isMutating}
      onClick={async () => {
        try {
          const result = await trigger({ username: 'johndoe' }, /* options */)
        } catch (e) {
          // エラーハンドリング
        }
      }}
    >
      Create User
    </button>
  )
}
```

リモートミューテーションの結果をレンダリング中に使いたい場合には、`useSWRMutation` の返り値から取得できます。

```jsx
const { trigger, data, error } = useSWRMutation('/api/user', sendRequest)
```

`useSWRMutation` はキャッシュを `useSWR` と共有します。そのため `useSWR` とのレースコンディションを検出して避けることができます。また楽観的な更新やエラー時のロールバックなど `mutation` と同様の機能をサポートしています。これらのオプションは `useSWRMutation` と `trigger` に渡すことができます。


```jsx
const { trigger } = useSWRMutation('/api/user', updateUser, {
  optimisticData: current => ({ ...current, name: newName })
})

// or

trigger(newName, {
  optimisticData: current => ({ ...current, name: newName })
})
```

### 必要になるまでデータのロードを遅延する

`useSWRMutation` はデータをロードするためにも利用できます。`useSWRMutation` は `trigger` が呼ばれるまでリクエストを開始しないため、データが本当に必要になるまで読み込みを遅らせることができます。

```jsx
import { useState } from 'react'
import useSWRMutation from 'swr/mutation'

const fetcher = url => fetch(url).then(res => res.json())

const Page = () => {
  const [show, setShow] = useState(false)
  // trigger が呼ばれるまで data は undefined です
  const { data: user, trigger } = useSWR('/api/user', fetcher);

  return (
    <div>
      <button onClick={() => {
        trigger();
        setShow(true);
      }}>Show User</button>
      {show && user ? <div>{usre.name}</div> : null}
    </div>
  );
}
```
