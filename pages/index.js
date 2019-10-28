import { useState, useEffect } from 'react'
import cn from 'classnames'

import ZEIT from '../components/zeit'
import GitHub from '../components/github'

import FeatureList from '../components/feature-list'
import Heading from '../components/heading'

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
            <code>{`import useSWR from '@zeit/swr'

function Profile () {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}`}</code>
          </pre>

          <p>
            In this example, the React Hook <code>useSWR</code> accepts a{' '}
            <code>key</code> and a <code>fetch</code> function. <code>key</code>{' '}
            is a unique identifier of the data, normally the URL of the API.
            Then <code>key</code> will be passed to <code>fetch</code>, which
            returns the data asynchronously.
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
            <video controls>
              <source
                src="https://assets.zeit.co/video/upload/q_auto/v1572271867/swr/example-videos/focus-revalidate.mp4"
                type="video/mp4"
              />
            </video>
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
            <video controls style={{ maxHeight: 600 }}>
              <source
                src="https://assets.zeit.co/video/upload/q_auto/v1572278352/swr/example-videos/fast-navigation.mp4"
                type="video/mp4"
              />
            </video>
            <figure>
              SWR will make cached pages render much faster, then update the
              cache with the latest data.
            </figure>
          </div>
        </div>

        <div className="explanation">
          <Heading>Refetch on Interval</Heading>
          <p>
            Data is dynamic. Changes made through different devices, multiple
            tabs, or your teammates means that the data shown on screen can very
            quickly become outdated. How can we keep the data on screen
            up-to-date?
          </p>
          <p>
            SWR gives you the option to automatically refetch data. Refetching
            happens <mark>efficiently</mark>, only when the components
            associated with the hook are on screen.
          </p>

          <div className="video">
            <video controls>
              <source
                src="https://assets.zeit.co/video/upload/q_auto/v1572274198/swr/example-videos/refetch-interval.mp4"
                type="video/mp4"
              />
            </video>
            <figure>
              A user make a change and then both sessions eventually rendering
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
            <video controls style={{ maxHeight: 600 }}>
              <source
                src="https://assets.zeit.co/video/upload/q_auto/v1572275644/swr/example-videos/swr-pages.mp4"
                type="video/mp4"
              />
            </video>
            <figure>
              An infinite scroll UI on the <a href="https://zeit.co">ZEIT</a>{' '}
              dashboard, SWR will recover your scroll position.
            </figure>
          </div>
        </div>

        <div className="explanation">
          <Heading>Custom Data Fetching</Heading>
          <p>
            SWR uses `fetch` by default and assumes a REST-style API call.
            However, the developer can define any asynchronous function as the
            fetcher, including GraphQL.
          </p>
        </div>

        <div className="explanation">
          <Heading>Suspense</Heading>
          <p>
            You can also use SWR Hooks with React Suspense. Just enable{' '}
            <code>suspense: true</code> in the SWR config and everything will
            work smoothly.
          </p>
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
          href="https://zeit.co"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Made by ZEIT"
        >
          <ZEIT />
        </a>
      </footer>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 0 var(--gap);
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
          max-width: 35rem;
          padding: 0 2rem;
          background: var(--bg);
          margin: calc(2 * var(--gap-double)) auto;
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
        }
        .video video {
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

        code {
          font-size: 0.8rem;
          background: #f1f1f1;
          padding: 0.2rem;
          border-radius: var(--radius);
          font-family: var(--font-mono);
        }

        pre {
          white-space: pre-wrap;
        }
        pre code {
          display: block;
          padding: 0.8rem;
          line-height: 1.4;
          background: #f5f5f5;
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
            padding: 0;
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
    </div>
  )
}

export default Index
