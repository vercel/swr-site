import Logo from '../components/logo'
import Snippet from '../components/snippet'
import ZEIT from '../components/zeit'

const Index = () => (
  <div className="page">
    <main>
      <div className="landing">
        <div className="logo slice">
          <Logo />
        </div>

        <div className="title">
          <h1>
            <span className="slice">useSWR</span>
          </h1>
          <h2>
            <span className="slice">Stale While Revalidate</span>
          </h2>
        </div>

        <div className="snippet">
          <Snippet />
        </div>
      </div>

      <div className="explanation">
        <p>
          <code>useSWR</code> is a React hook for efficient, auto-updating data
          fetching.
        </p>

        <p>
          SWR stands for <b>S</b>tale-<b>W</b>hile-<b>R</b>evalidate. The hook
          first returns the data from cache, then sends the fetch request, gets
          the up-to-date data and returns again. The cache is being stored in
          indexedDB, with memory cache as a fallback.
        </p>
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
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .explanation {
        font-size: 1.25rem;
        max-width: 35rem;
        margin-bottom: calc(10 * var(--gap-double));
      }

      footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: calc(3 * var(--gap-double));
      }

      .title {
        text-align: center;
      }

      .logo :global(svg) {
        max-width: calc(100vw - var(--gap-double));
      }

      h1 {
        margin: var(--gap-double) 0 var(--gap) 0;
        font-size: 3rem;
      }

      h2 {
        margin: 0;
        font-size: 1.5rem;
        color: var(--accents-3);
      }

      p {
        color: #eaeaea;
        line-height: 1.7;
      }

      code {
        font-size: 1rem;
        background: var(--accents-1);
        padding: var(--gap-quarter);
        border-radius: var(--radius);
        font-family: var(--font-mono);
      }

      .snippet {
        margin-top: calc(2 * var(--gap-double));
        opacity: 0;
        animation: fadeIn 2s ease-in-out forwards;
        animation-delay: 2s;
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
        width: 100%;
        background: #000;
        transform: skew(-20deg);
        animation: slideRight 2s ease-in-out forwards;
        animation-delay: 1s;
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
          transform: skew(-20deg) translateX(0);
        }

        99% {
          opacity: 0.8;
        }

        100% {
          transform: skew(-20deg) translateX(100%);
          opacity: 0;
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
        --accents-3: #444;

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
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;

        background-image: radial-gradient(#222 1px, transparent 1px),
          radial-gradient(#222 1px, transparent 1px);
        background-position: 0 0, 25px 25px;
        background-size: 50px 50px;

        /* Hack */
        overflow-x: hidden;
      }
    `}</style>
  </div>
)

export default Index
