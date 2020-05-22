import GitHub from 'components/github'
import FeatureList from 'components/feature-list'

const Header = () => (
  <header>
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

    <style jsx>{`
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

      .title {
        text-align: center;
      }

      .title h1 {
        margin: var(--gap-double) 0 calc(0.5 * var(--gap)) 0;
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.05rem;
      }

      .title h2 {
        margin: 0;
        font-weight: 300;
        font-size: 1.25rem;
        letter-spacing: -0.02rem;
        color: var(--accents-3);
      }

      .links {
        margin-top: var(--gap);
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
        h2 {
          font-size: 1rem;
        }
      }
    `}</style>
  </header>
)

export default Header
