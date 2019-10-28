import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'

import syntax from './syntax'

const Code = ({ code }) => {
  return (
    <>
      <code
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(code, Prism.languages['jsx'])
        }}
      />

      <style jsx>{`
        code {
          display: block;
          padding: 0.8rem;
          line-height: 1.5;
          background: #f5f5f5;
          font-size: 0.75rem;
          border-radius: var(--radius);
        }
      `}</style>
    </>
  )
}

export default Code
