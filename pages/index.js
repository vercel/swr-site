import Logo from '../components/logo'
import ZEIT from '../components/zeit'

import FeatureList from '../components/feature-list'

const Index = () => (
  <div className="page">
    <main>
      <div className="landing">
        {/* <div className="logo slice">
          <Logo />
        </div> */}

        <div className="title">
          <h1>
            <span className="slice">SWR</span>
          </h1>
          <h2>
            <span className="slice">React Hooks for Remote Data Fetching</span>
          </h2>
        </div>

        {/* <div className="links">
          <h5>GitHub</h5>
          <h5>GitHub</h5>
        </div> */}
      </div>

      <div className="features">
        <FeatureList />
      </div>

      <div className="explanation">
        <h3>Basic Data Loading</h3>
        <p>SWR is a React Hooks library for remote data fetching.</p>

        <p>
          The name “<b>SWR</b>” is derived from{' '}
          <code>stale-while-revalidate</code>, a HTTP cache invalidation
          strategy popularized by RFC 5861.
          <br />
          <b>SWR</b> first returns the data from cache (stale), then sends the
          fetch request (revalidate), and finally comes with the up-to-date data
          again.
        </p>
      </div>

      <div className="explanation">
        <h3>Fast Navigation</h3>
        <p>
          When navigating through pages or sections inside a system (e.g.: in
          Next.js), or when pressing the back button, it’s often desirable to
          load a cached version of the data.
        </p>

        <p>
          To achieve eventual consistency, SWR will automatically revalidate the
          data from the origin as soon as data is rendered from the cache.
        </p>
      </div>

      <div className="explanation">
        <h3>Focus Revalidate</h3>
        <p>
          When you come back to a page that wasn’t focused, or you switch
          between tabs, we automatically revalidate data.
        </p>

        <p>
          This can be useful to immediately synchronize to the latest state.
          This is extremely helpful for refreshing data for common scenarios
          like stale mobile tabs, or laptops that <mark>went to sleep</mark>.
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
        <h3>Refetch on Interval</h3>
        <p>
          In many cases, data changes because of multiple devices, multiple
          users, multiple tabs. How can we over time update the data on screen?
        </p>
        <p>
          SWR will give you the option to automatically refetch data. It’s <mark>smart</mark>{' '}
          which means refetching will only happen if the component associated
          with the hook is <mark>on screen</mark>.
        </p>

        <div className="video">
          <video controls>
            <source
              src="https://assets.zeit.co/video/upload/q_auto/v1572274198/swr/example-videos/refetch-interval.mp4"
              type="video/mp4"
            />
          </video>
          <figure>
            A user make a change and then both sessions eventually rendering the same data.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <h3>Local Mutation</h3>
        <p>
          SWR scales extremely well because it requires very little effort on
          the developer side to write applications that automatically and
          eventually converge to the freshest remote state of the data.
        </p>

        <p>
          In many cases, the developer can make an extra effort to speed up
          local data changes by applying local mutations to the data. This is
          completely optional.
        </p>
      </div>

      <div className="explanation">
        <h3>Scroll Position Recovery and Pagination</h3>
        <p>
          SWR features built-in support for APIs that return data in chunks,
          with the corresponding UI for “load more”.
        </p>
        <p>
          And even further, when navigating back to the “load more” list, everything
          including the <mark>scroll position</mark> will be recovered automatically.
        </p>

        <div className="video">
          <video controls style={{ maxHeight: 600 }}>
            <source
              src="https://assets.zeit.co/video/upload/q_auto/v1572275644/swr/example-videos/swr-pages.mp4"
              type="video/mp4"
            />
          </video>
          <figure>
            An infinite scroll UI on the <a href="https://zeit.co">ZEIT</a> dashboard, SWR will recover your scroll position.
          </figure>
        </div>
      </div>

      <div className="explanation">
        <h3>Custom Data Fetching</h3>
        <p>
          SWR by default uses `fetch` and assumes a REST-style API call.
          However, the developer can define any asynchronous function as the
          fetcher. For example, GraphQL:
        </p>
      </div>

      <div className="explanation">
        <h3>React Suspense</h3>
        <p></p>
      </div>
    </main>

    <footer>
      <a href="https://zeit.co" target="_blank" rel="noopener noreferrer">
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
      }

      .features {
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
        width: 1040px;
        max-width: 100vw;
      }

      .explanation {
        font-size: 1rem;
        max-width: 35rem;
        padding: 0 2rem;
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
        color: #0076ff;
        text-decoration: none;
      }

      mark {
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

      h3 {
        font-size: 1.25rem;
        letter-spacing: -0.02rem;
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
        background: #eaeaea;
        padding: 0.2rem;
        border-radius: var(--radius);
        font-family: var(--font-mono);
      }

      .slice {
        opacity: 0;
        animation: fadeIn 1.8s ease-in-out forwards;
        position: relative;
      }

      .slice::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 120%;
        background: #fff;
        transform: skew(-20deg);
        animation: slideRight 2s cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
        animation-delay: 0.8s;
      }

      h1 .slice::after {
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
    `}</style>

    <style jsx global>{`
      :root {
        --gap-quarter: 0.25rem;
        --gap-half: 0.5rem;
        --gap: 1rem;
        --gap-double: 2rem;

        --bg: #000;
        --fg: #fff;
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
        background: var(--fg);
        color: var(--bg);
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
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

export default Index
