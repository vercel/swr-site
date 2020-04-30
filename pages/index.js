import { useState, useEffect } from 'react'
import cn from 'classnames'

import Vercel from '../components/vercel'
import GitHub from '../components/github'

import FeatureList from '../components/feature-list'
import Heading from '../components/heading'
import Video from '../components/video'
import Code from '../components/code'

const ANIMATION_COOKIE = 'swr-animated'

const Index = () => {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    try {
      const localStorageValue = localStorage.getItem(ANIMATION_COOKIE)

      if (localStorageValue) {
        // Don't run the animation
        setAnimate(false)
      } else {
        // Don't run the animation the next time
        localStorage.setItem(ANIMATION_COOKIE, Date.now())
      }
    } catch (e) {
      // Ignore
    }
  }, [])

  return (
    <div className={cn('page', { animate })}>
      <main>
        <div className="landing">
          <div className="title">
            <h1>
              <span className="slice">SWR</span>
            </h1>
            <h2>
              <span className="slice">
                React Hooks for Remote Data Fetching
              </span>
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
            fetch request (revalidate), and finally comes with the up-to-date
            data again.
          </p>
        </div>

        <div className="explanation">
          <Heading>Basic Data Loading</Heading>
          <pre>
            <Code
              code={`import useSWR from 'swr'

function Profile () {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}`}
            />
          </pre>

          <p>
            In this example, the React Hook <code>useSWR</code> accepts a{' '}
            <code>key</code> and a <code>fetch</code> function. <code>key</code>{' '}
            is a unique identifier of the data, normally the URL of the API.
            Then <code>key</code> will be passed to <code>fetch</code>, which
            can be any asynchronous function which returns the data.
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
            <Video src="https://assets.zeit.co/video/upload/q_auto,e_accelerate:50/v1572271867/swr/example-videos/focus-revalidate.mp4" />
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
            To achieve eventual consistency, SWR will automatically revalidate
            the data from the origin as soon as data is rendered from the cache.
          </p>

          <div className="video">
            <Video
              style={{ maxHeight: 600 }}
              src="https://assets.zeit.co/video/upload/q_auto,e_accelerate:70/v1572278352/swr/example-videos/fast-navigation.mp4"
            />
            <figure>
              SWR will make cached pages render much faster, then update the
              cache with the latest data.
            </figure>
          </div>
        </div>

        <div className="explanation">
          <Heading>Refetch on Interval</Heading>
          <p>
            In many cases, data changes because of multiple devices, multiple
            users, multiple tabs. How can we over time update the data on
            screen?
          </p>
          <p>
            SWR will give you the option to automatically refetch data. It’s{' '}
            <mark>smart</mark> which means refetching will only happen if the
            component associated with the hook is <mark>on screen</mark>.
          </p>

          <div className="video">
            <Video src="https://assets.zeit.co/video/upload/q_auto,e_accelerate:40/v1572274198/swr/example-videos/refetch-interval.mp4" />
            <figure>
              When a user makes a change, both sessions will eventually render
              the same data.
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
            In many cases, applying local mutations to data is a good way to
            make changes feel faster — no need to wait for the remote source of
            data. Local mutations are a completely optional way to set a
            temporary local state that will automatically update on the next
            revalidation.
          </p>

          <div className="video">
            <Video
              style={{ maxHeight: 600 }}
              src="https://assets.zeit.co/video/upload/q_auto,e_accelerate:40/v1572283098/swr/example-videos/local-mutation.mp4"
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
              src="https://assets.zeit.co/video/upload/q_auto,e_accelerate:80/v1572275644/swr/example-videos/swr-pages.mp4"
            />
            <figure>
              An infinite scroll UI on the <a href="https://zeit.co">ZEIT</a>{' '}
              dashboard, SWR will recover your scroll position.
            </figure>
          </div>
        </div>

        <div className="explanation">
          <Heading>Custom Data Fetching</Heading>
          <p>
            SWR uses <code>fetch</code> by default and assumes a REST-style API
            call. However, the developer can define any asynchronous function as
            the fetcher. For example, GraphQL:
          </p>
          <pre>
            <Code
              code={`import { request } from 'graphql-request'
import useSWR from 'swr'

const API = 'https://api.graph.cool/simple/v1/movies'

function Profile () {
  const { data, error } = useSWR(
    \`{
      Movie(title: "Inception") {
        releaseDate
        actors {
          name
        }
      }
    }\`,
    query => request(API, query)
  )

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>Movie: {data.title}!</div>
}`}
            />
          </pre>
        </div>

        <div className="explanation">
          <Heading>Dependent Fetching</Heading>
          <p>
            SWR allows you to fetch data that depends on other data. It ensures
            the maximum possible parallelism (avoiding waterfalls), as well as
            serial fetching when a piece of dynamic data is required for the
            next data fetch to happen.
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
            <code>suspense: true</code> in the SWR config and everything will
            work smoothly.
          </p>
          <pre>
            <Code
              code={`import { Suspense } from 'react'
import useSWR from 'swr'

function Profile () {
  const { data } = useSWR(
    '/api/user',
    fetch,
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

        .page:not(.animate) .slice::after {
          content: unset;
        }

        .page.animate .slice {
          animation: fadeIn 1.8s ease-in-out forwards;
        }

        .page.animate .slice::after {
          animation: slideRight 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)
            forwards;
          animation-delay: 0.8s;
        }

        .page.animate .features {
          opacity: 0;
          animation: fadeIn 0.5s ease-in-out forwards;
          animation-delay: 2s;
        }

        .page.animate .explanation {
          opacity: 0;
          animation: fadeIn 0.5s ease-in-out forwards;
          animation-delay: 2.5s;
        }

        .page.animate .links {
          opacity: 0;
          animation: fadeIn 0.5s ease-in-out forwards;
          animation-delay: 2s;
        }

        .page.animate h1 .slice::after {
          width: 105%;
          left: -1%;
          animation-delay: 0.5s;
          animation-duration: 0.5s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideRight {
          0% {
            width: 120%;
            left: 0;
            background-image: none;
          }

          100% {
            width: 0;
            left: 120%;
            opacity: 0.6;
          }
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

      <style jsx global>{`
        :root {
          --gap-quarter: 0.25rem;
          --gap-half: 0.5rem;
          --gap: 1rem;
          --gap-double: 2rem;

          --bg: #fff;
          --fg: #000;
          --accents-1: #111;
          --accents-2: #333;
          --accents-3: #888;
          --geist-foreground: #000;

          --radius: 8px;

          --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
            'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
            'Helvetica Neue', sans-serif;
          --font-mono: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body {
          padding: 0;
          margin: 0;
          font-size: 20px;
        }

        body {
          min-height: 100vh;
          background: var(--bg);
          color: var(--fg);
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;

          background-image: radial-gradient(#ddd 1px, transparent 1px),
            radial-gradient(#ddd 1px, transparent 1px);
          background-position: 0 0, 25px 25px;
          background-attachment: fixed;
          background-size: 50px 50px;

          /* Hack */
          overflow-x: hidden;
        }
      `}</style>

      <style jsx global>{`
        code[class*='language-'],
        pre[class*='language-'] {
          color: #000;
          text-align: left;
          white-space: pre;
          word-spacing: normal;
          word-break: normal;
          font-size: 0.95em;
          line-height: 1.4em;
          tab-size: 4;
          hyphens: none;
        }
        .token.comment,
        .token.prolog,
        .token.doctype,
        .token.cdata {
          color: #999;
        }
        .token.namespace {
          opacity: 0.7;
        }
        .token.string,
        .token.attr-value {
          color: #028265;
        }
        .token.punctuation,
        .token.operator {
          color: #000;
        }
        .token.url,
        .token.symbol,
        .token.boolean,
        .token.variable,
        .token.constant {
          color: #36acaa;
        }
        .token.atrule,
        .language-autohotkey .token.selector,
        .language-json .token.boolean,
        code[class*='language-css'] {
          font-weight: 600;
        }
        .language-json .token.boolean {
          color: var(--geist-success);
        }
        .token.keyword {
          color: #ff0078;
          font-weight: bolder;
        }
        .token.function,
        .token.tag,
        .token.class-name,
        .token.number,
        .token.tag .token.punctuation {
          color: var(--geist-success);
        }
        .language-autohotkey .token.tag {
          color: #9a050f;
        }
        .token.selector,
        .language-autohotkey .token.keyword {
          color: #00009f;
        }
        .token.important,
        .token.bold {
          font-weight: bold;
        }
        .token.italic {
          font-style: italic;
        }
        .token.deleted {
          color: red;
          font-weight: bolder;
        }
        .token.inserted {
          color: var(--geist-success);
          font-weight: bolder;
        }
        .language-json .token.property,
        .language-markdown .token.title {
          color: #000;
          font-weight: bolder;
        }
        .language-markdown .token.code {
          color: var(--geist-success);
          font-weight: normal;
        }
        .language-markdown .token.list,
        .language-markdown .token.hr {
          color: #999;
        }
        .language-markdown .token.url {
          color: #ff0078;
          font-weight: bolder;
        }
        .token.selector {
          color: #2b91af;
        }
        .token.property,
        .token.entity {
          color: #f00;
        }
        .token.attr-name,
        .token.regex {
          color: #d9931e;
        }
        .token.directive.tag .tag {
          background: #ff0;
          color: #393a34;
        }
        /* dark */
        pre.dark[class*='language-'] {
          color: #fafbfc;
        }
        .language-json .dark .token.boolean {
          color: var(--geist-success);
        }
        .dark .token.string {
          color: #50e3c2;
        }
        .dark .token.function,
        .dark .token.tag,
        .dark .token.class-name,
        .dark .token.number {
          color: #2ba8ff;
        }
        .dark .token.attr-value,
        .dark .token.punctuation,
        .dark .token.operator {
          color: #efefef;
        }
        .dark .token.attr-name,
        .dark .token.regex {
          color: #fac863;
        }
        .language-json .dark .token.property,
        .language-markdown .dark .token.title {
          color: #fff;
        }
        .language-markdown .dark .token.code {
          color: #50e3c2;
        }
      `}</style>
    </div>
  )
}

export default Index
