import Logo from '../components/logo'
import ZEIT from '../components/zeit'

import Feature from '../components/feature'

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
        <Feature text='Lightweight' icon={<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={{ color: 'var(--geist-foreground)' }}><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>} />
        <Feature text='Backend agnostic' icon={<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" shapeRendering="geometricPrecision" style={{ color: 'var(--geist-foreground)' }}><path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 16.25" /><path d="M8 16h.01" /><path d="M8 20h.01" /><path d="M12 18h.01" /><path d="M12 22h.01" /><path d="M16 16h.01" /><path d="M16 20h.01" /></svg>} />
        <Feature text='Realtime' icon={
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            color='var(--geist-foreground)'
            shapeRendering='geometricPrecision'
            viewBox='0 0 24 24'
          >
            <path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'></path>
          </svg>} />
        <Feature text='JAMStack oriented' icon={
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            color='var(--geist-foreground)'
            shapeRendering='geometricPrecision'
            viewBox='0 0 24 24'
          >
            <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'></path>
          </svg>} />
        <Feature text='Suspense' icon={
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            color='var(--geist-foreground)'
            shapeRendering='geometricPrecision'
            viewBox='0 0 24 24'
          >
            <path fill='var(--geist-fill)' d='M6 4H10V20H6z'></path>
            <path fill='var(--geist-fill)' d='M14 4H18V20H14z'></path>
          </svg>} />
        <Feature text='TypeScript ready' icon={
          <svg
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            color='var(--geist-foreground)'
            shapeRendering='geometricPrecision'
            viewBox='0 0 24 24'
          >
            <path d='M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z'></path>
            <path d='M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12'></path>
          </svg>} />
        <Feature text='REST compatible' icon={
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            color="var(--geist-foreground)"
            shapeRendering="geometricPrecision"
            viewBox="0 0 24 24"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
          </svg>
        } />
        <Feature text='Remote + Local' icon={
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            color="var(--geist-foreground)"
            shapeRendering="geometricPrecision"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.24 7.76a6 6 0 010 8.49m-8.48-.01a6 6 0 010-8.49m11.31-2.82a10 10 0 010 14.14m-14.14 0a10 10 0 010-14.14"></path>
          </svg>
        } />
      </div>

      <div className="explanation">
        <h3>Basic Data Loading</h3>
        <p>
          SWR is a React Hooks library for remote data fetching.
        </p>

        <p>
          The name “<b>SWR</b>” is derived from <code>stale-while-revalidate</code>, a HTTP cache invalidation strategy popularized by RFC 5861.
          <br/>
          <b>SWR</b> first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again.  
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
        margin: calc(2 * var(--gap-double)) auto;
      }

      footer {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: calc(3 * var(--gap-double)) auto;
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
        letter-spacing: -.05rem;
      }

      h2 {
        margin: 0;
        font-weight: 300;
        font-size: 1.25rem;
        letter-spacing: -.02rem;
        color: var(--accents-3);
      }

      h3 {
        font-size: 1.25rem;
        letter-spacing: -.02rem;
      }

      p {
        color: #555;
        font-weight: 400;
        font-size: .94rem;
        line-height: 1.7;
      }

      code {
        font-size: .8rem;
        background: #eaeaea;
        padding: .2rem;
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
        animation-delay: .8s;
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
        background-size: 50px 50px;

        /* Hack */
        overflow-x: hidden;
      }
    `}</style>
  </div>
)

export default Index
