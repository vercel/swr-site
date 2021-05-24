import Callout from 'nextra-theme-docs/callout'

# Next.jsでの利用

## クライアント側のデータフェッチ

ページに頻繁に更新されるデータがあり、データを事前にレンダリングする必要がない場合、 SWR は特別な設定が必要ないほどピッタリです：
`useSWR` をインポートして、データを使用するコンポーネント内でフックを使用するだけです。

方法は以下の通りです：

- まず、データのないページをすぐに表示します。データがないときはローディング状態を表示することができます。
- 続いて、クライアント側でデータを取得し、準備ができたら表示します。

このアプローチは、たとえばユーザーのダッシュボードページなどで有効です。ダッシュボードは、ユーザー専用のプライベートなページであるため SEO は関係なく、
ページを事前にレンダリングする必要もありません。データは頻繁に更新されるため、リクエスト時のデータ取得処理が必要です。

## 事前レンダリング

ページを事前にレンダリングする必要がある場合、 Next.js は [二種類の事前レンダリング](https://nextjs.org/docs/basic-features/data-fetching) をサポートしています：
**Static Generation (SSG)** と **Server-side Rendering (SSR)** です。

SWR と一緒に使えば、 SEO のためにページを事前にレンダリングしたり、キャッシュ、再検証、フォーカストラッキング、定期的な再取得などの機能を
クライアント側に持たせることができます。

`initialData` オプションには、あらかじめ取得したデータを初期値として渡すことができます。たとえば、 [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation) と一緒に使うことができます：

```jsx
 export async function getStaticProps() {
  // `getStaticProps`がサーバー側で呼び出されるので、
  // この`fetcher`関数はサーバーサイドで実行されます。
  const posts = await fetcher('/api/posts')
  return { props: { posts } }
}

function Posts (props) {
  // ここでは、クライアント側で`fetcher`関数が実行されます。
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts })

  // ...
}
```

このページはまだ事前にレンダリングされています。つまり、 SEO にも強く、キャッシュにも対応し、アクセスも非常に速いということです。
しかし、再利用後には SWR によってクライアント側が強化されています。
これはつまり、データは動的であり、時間の経過やユーザーの操作によって更新される可能性があります。

<Callout emoji="💡">
  上記の例では、 <code>fetcher</code> はクライアントとサーバーの両方からデータを取得するために使用されており、
  両方の環境をサポートする必要があります。しかし、これは必須ではありません。サーバーまたはクライアントからデータを取得するには、様々な方法を使うことができます。
</Callout>
