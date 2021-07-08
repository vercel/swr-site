import Callout from 'nextra-theme-docs/callout'

# Next.js와 함께 사용하는 방법

## 클라이언트 사이드 데이터 가져오기

페이지가 빈번하게 업데이트하는 데이터를 포함하고 이를 프리렌더링할 필요가 없다면, SWR은 완벽하게 적합하며 어떠한 특별한 설정도 필요하지 않습니다. `useSWR`을 임포트하고 데이터를 사용하는 컴포넌트 내에서 이 hook을 사용하기만 하면 됩니다.

동작 방식:

- 먼저, 데이터 없이 페이지를 즉시 보여줍니다. 빠진 데이터를 위한 로딩 상태를 보여주어도 됩니다.
- 그다음, 클라이언트 사이드에서 데이터를 가져와 준비되면 보여줍니다.

이런 접근은 사용자 대시보드 페이지 같은 곳에 적합합니다. 대시보드는 비공개용이며 사용자별 페이지이므로 SEO와 관계가 없고 페이지를 프리렌더링할 필요도 없습니다. 데이터는 빈번하게 업데이트되므로 요청 시에 데이터를 가져와야 합니다.

## 프리렌더링

페이지가 반드시 프리렌더링 되어야 한다면, Next.js는 [두 가지 형식의 프리렌더링](https://nextjs.org/docs/basic-features/data-fetching)을 지원합니다: 
**정적 생성(SSG)**과 **서버 사이드 렌더링(SSR)**.

SWR을 함께 사용하여 SEO를 위한 페이지를 프리렌더링할 수 있으며 클라이언트 사이드에서 캐싱, 갱신, 포커스 추적, 인터벌 시에 다시 가져오기와 같은 기능들도 사용할 수 있습니다.

프리패치된 데이터를 초기값으로써 `initialData` 옵션에 전달할 수 있습니다. [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)와 함께 사용하는 예시입니다.

```jsx
 export async function getStaticProps() {
  // `getStaticProps`는 서버 사이드에서 실행되므로,
  // 이 `fetcher` 함수는 서버 사이드에서 실행됩니다.
  const posts = await fetcher('https://jsonplaceholder.typicode.com/posts')
  return { props: { posts } }
}

function Posts (props) {
  // 여기 `fetcher` 함수는 클라이언트 사이드에서 실행됩니다.
  const { data } = useSWR('/api/posts', fetcher, { initialData: props.posts })

  // ...
}
```

페이지가 여전히 프리렌더링 됩니다. 이는 SEO 친화적이며 캐싱할 수 있어 빠르게 접근할 수 있음을 의미합니다. 하이드레이션 이후에는 클라이언트 사이드에서 SWR에 의해 완전하게 구동됩니다.
데이터는 동적일 수 있으며 시간의 흐름과 사용자 상호 작용에 따라 스스로 업데이트할 수 있습니다.

<Callout emoji="💡">
  위 예시에서 <code>fetcher</code>는 클라이언트 및 서버 모두로부터 데이터를 로드하기 위해 사용했으며,
  두 환경을 지원해야 했습니다. 하지만 이것이 필수는 아닙니다. 다른 방법을 사용해 서버나 클라이언트로부터 데이터를 로드할 수 있습니다.
</Callout>
