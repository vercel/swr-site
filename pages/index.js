import Head from 'next/head'

import Vercel from '../components/vercel'
import GitHub from '../components/github'

import FeatureList from '../components/feature-list'
import Heading from '../components/heading'
import Video from '../components/video'
import Code from '../components/code'

const Index = () => (
  <div className="page">
    <Head>
      <title>SWR: React Hooks for Remote Data Fetching</title>
    </Head>
    <main>
      <div className="landing">
        <div className="title">
          <h1>
            <span className="slice">SWR</span>
          </h1>
          <h2>
            <span className="slice">React Hooks for Remote Data Fetching</span>
          </h2>
        </div>

        <div className="links">
          <a
            href="https://github.com/zeit/swr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
          >
            <GitHub />
          </a>
        </div>
      </div>

      <div className="features">
        <FeatureList />
      </div>

      <div className="explanation">
        <Heading>Introduction</Heading>
        <p>SWR is a React Hooks library for remote data fetching.</p>

        <p>
          The name “<b>SWR</b>” is derived from{' '}
          <code>stale-while-revalidate</code>, a HTTP cache invalidation
          strategy popularized by RFC 5861.
        </p>

        <p>
          <b>SWR</b> first returns the data from cache (stale), then sends the
          fetch request (revalidate), and finally comes with the up-to-date data
          again.
        </p>
      </div>

      <div className="explanation">
        <Heading>Basic Data Loading</Heading>
        <pre>
          <Code
            code={`import useSWR from 'swr'

function Profile () {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}`}
          />
        </pre>

        <p>
          In this example, the React Hook <code>useSWR</code> accepts a{' '}
          <code>key</code> and a <code>fetcher</code> function. <code>key</code>{' '}
          is a unique identifier of the data, normally the URL of the API. Then{' '}
          <code>key</code> will be passed to <code>fetcher</code>, which can be
          any asynchronous function which returns the data.
        </p>

        <p>
          <code>useSWR</code> also returns 2 values: <code>data</code> and{' '}
          <code>error</code>, based on the status of the request.
        </p>

        <p>
          For the detailed API and more examples, visit the{' '}
          <a
            href="https://github.com/zeit/swr"
            target="_blank"
            rel="noopener noreferrer"
          >
            repository
          </a>
          .
        </p>
      </div>

      <div className="explanation">
        <Heading>Focus Revalidation</Heading>
        <p>
          When you re-focus a page or switch between tabs, SWR automatically
          revalidates data.
        </p>

        <p>
          This can be useful to immediately synchronize to the latest state.
          This is helpful for refreshing data in scenarios like stale mobile
          tabs, or laptops that <mark>went to sleep</mark>.
        </p>

        <div className="video">
          <Video src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:50/v1572271867/swr/example-videos/focus-revalidate.mp4" />
          <figure>
            Using focus revalidation to automatically sync login state between
            pages.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <Heading>Fast Navigation</Heading>
        <p>
          When navigating through pages or sections inside a system (e.g.: in
          Next.js), or when pressing the back button, it’s often desirable to
          load a cached version of the data.
        </p>

        <p>
          To achieve eventual consistency, SWR will automatically revalidate the
          data from the origin as soon as data is rendered from the cache.
        </p>

        <div className="video">
          <Video
            style={{ maxHeight: 600 }}
            src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:70/v1572278352/swr/example-videos/fast-navigation.mp4"
          />
          <figure>
            SWR will make cached pages render much faster, then update the cache
            with the latest data.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <Heading>Refetch on Interval</Heading>
        <p>
          In many cases, data changes because of multiple devices, multiple
          users, multiple tabs. How can we over time update the data on screen?
        </p>
        <p>
          SWR will give you the option to automatically refetch data. It’s{' '}
          <mark>smart</mark> which means refetching will only happen if the
          component associated with the hook is <mark>on screen</mark>.
        </p>

        <div className="video">
          <Video src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:40/v1572274198/swr/example-videos/refetch-interval.mp4" />
          <figure>
            When a user makes a change, both sessions will eventually render the
            same data.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <Heading>Local Mutation</Heading>
        <p>
          SWR scales extremely well because it requires very little effort to
          write applications that automatically and eventually converge to the
          most recent remote data.
        </p>

        <p>
          In many cases, applying local mutations to data is a good way to make
          changes feel faster — no need to wait for the remote source of data.
          Local mutations are a completely optional way to set a temporary local
          state that will automatically update on the next revalidation.
        </p>

        <div className="video">
          <Video
            style={{ maxHeight: 600 }}
            src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:40/v1572283098/swr/example-videos/local-mutation.mp4"
          />
          <figure>
            Notice that we also still revalidate, which means our backend is
            decapitalizing the name and applying different rules that our
            frontend has forgotten to enforce.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <Heading>Scroll Position Recovery and Pagination</Heading>
        <p>
          SWR features built-in support for APIs that return data in chunks,
          with the corresponding UI for “load more”.
        </p>
        <p>
          And even further, when navigating back to the “load more” list,
          everything including the <mark>scroll position</mark> will be
          recovered automatically.
        </p>

        <div className="video">
          <Video
            style={{ maxHeight: 600 }}
            src="https://assets.vercel.com/video/upload/q_auto,e_accelerate:80/v1572275644/swr/example-videos/swr-pages.mp4"
          />
          <figure>
            An infinite scroll UI on the <a href="https://vercel.com">Vercel</a>{' '}
            dashboard, SWR will recover your scroll position.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <Heading>Custom Data Fetching</Heading>
        <p>
          Other than using the native <code>fetch</code> and assumes a
          REST-style API call, the developer can define any asynchronous
          function as the fetcher. For example, GraphQL:
        </p>
        <pre>
          <Code
            code={`import { request } from 'graphql-request'
import useSWR from 'swr'

const API = 'https://api.graph.cool/simple/v1/movies'

function MovieActors () {
  const { data, error } = useSWR(
    \`{
      Movie(title: "Inception") {
        actors {
          id
          name
        }
      }
    }\`,
    query => request(API, query)
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return data.actors.map(actor => <li key={actor.id}>{actor.name}</li>)
}`}
          />
        </pre>
      </div>

      <div className="explanation">
        <Heading>Dependent Fetching</Heading>
        <p>
          SWR allows you to fetch data that depends on other data. It ensures
          the maximum possible parallelism (avoiding waterfalls), as well as
          serial fetching when a piece of dynamic data is required for the next
          data fetch to happen.
        </p>
        <pre>
          <Code
            code={`import useSWR from 'swr'

function MyProjects () {
  const { data: user } = useSWR('/api/user')
  const { data: projects } = useSWR(
    () => '/api/projects?uid=' + user.id
  )
  // When passing a function, SWR will use the
  // return value as \`key\`. If the function throws,
  // SWR will know that some dependencies are not
  // ready. In this case it is \`user\`.

  if (!projects) return 'loading...'
  return 'You have ' + projects.length + ' projects'
}`}
          />
        </pre>
      </div>

      <div className="explanation">
        <Heading>Suspense</Heading>
        <p>
          You can also use SWR Hooks with React Suspense. Just enable{' '}
          <code>suspense: true</code> in the SWR config and everything will work
          smoothly.
        </p>
        <pre>
          <Code
            code={`import { Suspense } from 'react'
import useSWR from 'swr'

function Profile () {
  const { data } = useSWR(
    '/api/user',
    fetcher,
    { suspense: true }
  )
  return <div>hello, {data.name}</div>
}

function App () {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Profile/>
    </Suspense>
  )
}`}
          />
        </pre>
        <br />
        <br />
        <p>
          Visit the{' '}
          <a
            href="https://github.com/zeit/swr"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Repository
          </a>{' '}
          for more examples and documentation.
        </p>
      </div>
    </main>

    <footer>
      <a
        href="https://vercel.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Made by Vercel"
      >
        <Vercel />
      </a>
    </footer>

    <style jsx>{`
      .page {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .landing {
        min-height: 350px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
      }

      .links {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
      }

      .features {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 1040px;
        max-width: calc(100vw - var(--gap-double));
      }

      .explanation {
        font-size: 1rem;
        width: 35rem;
        max-width: 100vw;
        padding: 0 2rem;
        background: var(--bg);
        margin: calc(2 * var(--gap-double)) auto;
      }
      figure {
        font-size: 0.85rem;
        color: #999;
        line-height: 1.8;
      }

      footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: calc(3 * var(--gap-double)) auto;
      }

      figure {
        font-size: 0.85rem;
        color: #999;
      }

      a {
        color: #0070f3;
        text-decoration: none;
      }

      .links {
        margin-top: var(--gap);
      }

      mark {
        padding: var(--gap-quarter);
        border-radius: var(--radius);
        background: rgba(247, 212, 255, 0.8);
      }

      .title {
        text-align: center;
      }

      .logo :global(svg) {
        max-width: calc(100vw - var(--gap-double));
      }

      h1 {
        margin: var(--gap-double) 0 calc(0.5 * var(--gap)) 0;
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.05rem;
      }

      h2 {
        margin: 0;
        font-weight: 300;
        font-size: 1.25rem;
        letter-spacing: -0.02rem;
        color: var(--accents-3);
      }

      .video {
        width: 1080px;
        max-width: calc(100vw - 40px);
        transform: translateX(-50%);
        margin-left: 50%;
        text-align: center;
        cursor: pointer;
      }
      .video :global(video) {
        max-width: 100%;
        max-height: 90vh;
        outline: none;
      }

      p {
        color: #555;
        font-weight: 400;
        font-size: 0.94rem;
        line-height: 1.7;
      }
      pre {
        white-space: pre;
      }
      pre :global(code) {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }

      code {
        font-size: 0.8rem;
        background: #f1f1f1;
        padding: 0.2rem;
        border-radius: var(--radius);
        font-family: var(--font-mono);
      }

      .slice {
        position: relative;
      }

      .slice::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 130%;
        background: #fff;
        transform: skew(-20deg);
      }

      @media (max-width: 600px) {
        .explanation {
          padding: 0 1rem;
        }

        h2 {
          font-size: 1rem;
        }
      }
    `}</style>
  </div>
)

export default Index
