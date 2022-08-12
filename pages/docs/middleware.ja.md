import Callout from 'nextra-theme-docs/callout'

# ミドルウェア

<Callout>
  この機能を使うには最新バージョン（ ≥ 1.0.0 ）へアップグレードしてください。
</Callout>

ミドルウェア機能は SWR 1.0 に新しく追加されたもので、 SWR の前後にロジックを実行できます。

## 使い方

ミドルウェアは SWR フックを受け取り、実行の前後にロジックを実行できます。複数のミドルウェアがある場合、各ミドルウェアは次のミドルウェアをラップします。リストの最後のミドルウェアは、元の SWR フックである `useSWR` を受け取ります。

### API

_注意： 関数名は大文字にしないでください（たとえば `myMiddleware` の代わりに `MyMiddleware` を使うなど）。そうしないと、 React lint のルールが `Rules of Hook` エラーを投げます。_

[TypeScript](https://swr.vercel.app/ja/docs/typescript#ミドルウェアの型)

```jsx
function myMiddleware (useSWRNext) {
  return (key, fetcher, config) => {
    // フックが実行される前...

    // 次のミドルウェア、またはこれが最後のミドルウェアの場合は `useSWR` を処理します。
    const swr = useSWRNext(key, fetcher, config)

    // フックが実行された後...
    return swr
  }
}
```

オプションとして、ミドルウェアの配列を `SWRConfig` または `useSWR` に渡すことができます：

```jsx
<SWRConfig value={{ use: [myMiddleware] }}>

// または...

useSWR(key, fetcher, { use: [myMiddleware] })
```

### 拡張

ミドルウェアは通常のオプションのように拡張されます。たとえば：

```jsx
function Bar () {
  useSWR(key, fetcher, { use: [c] })
  // ...
}

function Foo() {
  return (
    <SWRConfig value={{ use: [a] }}>
      <SWRConfig value={{ use: [b] }}>
        <Bar/>
      </SWRConfig>
    </SWRConfig>
  )
}
```

と同等です：

```js
useSWR(key, fetcher, { use: [a, b, c] })
```

### 複数のミドルウェア

各ミドルウェアは次のミドルウェアをラップし、最後のミドルウェアは SWR フックをラップするだけです。例として：

```jsx
useSWR(key, fetcher, { use: [a, b, c] })
```

以下に示すように、ミドルウェアの実行順は `a → b → c` になります：

```plaintext
enter a
  enter b
    enter c
      useSWR()
    exit  c
  exit  b
exit  a
```

## 例

### リクエストを記録する

例として、リクエストを記録する簡単なミドルウェアを作成してみましょう。この SWR フックから送信されたすべての取得リクエストを出力します。このミドルウェアを `SWRConfig` に追加することで、すべての SWR フックに使用することもできます。

```jsx
function logger(useSWRNext) {
  return (key, fetcher, config) => {
    // 元の fetcher に logger を追加します。
    const extendedFetcher = (...args) => {
      console.log('SWR Request:', key)
      return fetcher(...args)
    }

    // 新しいフェッチャーでフックを実行します。
    return useSWRNext(key, extendedFetcher, config)
  }
}

// ... コンポーネント内
useSWR(key, fetcher, { use: [logger] })
```

リクエストが発生するたびに、 SWR キーがコンソールに出力されます：

```plaintext
SWR Request: /api/user1
SWR Request: /api/user2
```

### 以前の結果を保持する

`useSWR` によって返されるデータを"遅延"させたい場合があります。
キーが変わっても新しいデータがロードされるまで、以前の結果を返すようにします。

これは、 `useRef` と一緒に遅延ミドルウェアとして構築できます。例では、 `useSWR` フックの返されたオブジェクトを拡張します：

```jsx
import { useRef, useEffect, useCallback } from 'react'

// これはキーが変更された場合でもデータを保持するための SWR ミドルウェアです。
function laggy(useSWRNext) {
  return (key, fetcher, config) => {
    // 以前に返されたデータを格納するには、 ref を使用します。
    const laggyDataRef = useRef()

    // 実際の SWR フック。
    const swr = useSWRNext(key, fetcher, config)

    useEffect(() => {
      // データが未定義ではない場合は、 ref を更新します。
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data
      }
    }, [swr.data])

    // 遅延データがある場合は、それをクリアするメソッドを公開します。
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined
    }, [])

    // 現在のデータが未定義の場合、前のデータに置き換えられます。
    const dataOrLaggyData = swr.data === undefined ? laggyDataRef.current : swr.data

    // 以前のデータを表示していますか？
    const isLagging = swr.data === undefined && laggyDataRef.current !== undefined

    // また `isLagging` フィールドを SWR に追加します。
    return Object.assign({}, swr, {
      data: dataOrLaggyData,
      isLagging,
      resetLaggy,
    })
  }
}
```

SWR フックを遅らせる必要がある場合は、次のミドルウェアを使用できます：

```js
const { data, isLagging, resetLaggy } = useSWR(key, fetcher, { use: [laggy] })
```

### オブジェクトキーをシリアライズする

<Callout>
  SWR 1.1.0 からは、オブジェクトのようなキーは内部で自動的にシリアライズされます。
</Callout>

<Callout emoji="⚠️">
  古いバージョン（< 1.1.0）では、SWR はすべてのレンダリングで引数を**浅く**比較し、いずれかが変更された場合は再検証を実行します。
  シリアライズ可能なオブジェクトをキーとして渡す場合、オブジェクトのキーをシリアライズして安定性を確保できます。以下のシンプルなミドルウェアが役立ちます：
</Callout>

```jsx
function serialize(useSWRNext) {
  return (key, fetcher, config) => {
    // キーをシリアライズする
    const serializedKey = Array.isArray(key) ? JSON.stringify(key) : key

    // シリアライズされたキーを渡し、フェッチャーでシリアライズを解除します。
    return useSWRNext(serializedKey, (k) => fetcher(...JSON.parse(k)), config)
  }
}

// ...
useSWR(['/api/user', { id: '73' }], fetcher, { use: [serialize] })

// ... またはグローバルに有効にします
<SWRConfig value={{ use: [serialize] }}>
```

レンダリング間でオブジェクトが変わる可能性があることを心配する必要はありません。常に同じ文字列にシリアライズされるため、フェッチャーは引き続きオブジェクトを引数に受け取ります。

<Callout>
  さらに、 `JSON.stringify` の代わりに [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify) のようなライブラリを使用できます — より高速で安定しています。
</Callout>
