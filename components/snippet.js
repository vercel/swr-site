import Copy from './copy-icon'
import { toClipboard } from 'copee'

const text = 'yarn add use-swr'

const Snippet = () => {
  return (
    <div className="snippet">
      <span>{text}</span>

      <button className="copy" onClick={() => toClipboard(text)}>
        <Copy />
      </button>

      <style jsx>{`
        .snippet {
          font-size: 0.75rem;
          width: 300px;
          border: 1px solid var(--accents-2);
          border-radius: var(--radius);
          padding: var(--gap-half);
          font-family: var(--font-mono);
          background: var(--bg);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .copy {
          outline: none;
          cursor: pointer;
          background: none;
          padding: 0;
          margin: 0;
          border: none;
          color: var(--fg);
          transition: color 0.2s ease-in-out;
        }

        .copy:hover {
          color: var(--accents-3);
        }

        span::before {
          content: '$ ';
        }
      `}</style>
    </div>
  )
}

export default Snippet
