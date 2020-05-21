import { readFileSync } from 'fs'
import { join } from 'path'
import markdownToHtml from 'lib/markdown-to-html'
import Head from 'next/head'
import Header from 'components/header'
import Footer from 'components/footer'

// TODO h3 # links

export default ({ html }) => (
  <>
    <Head>
      <title>SWR: React Hooks for Remote Data Fetching</title>
    </Head>

    <Header />

    <main className="post" dangerouslySetInnerHTML={{ __html: html }} />

    <Footer />

    <style jsx global>{`
      .post {
        font-size: 1rem;
        width: 35rem;
        max-width: 100vw;
        padding: 0 2rem;
        background: var(--bg);
        margin: 0 auto;
      }

      .post h3 {
        font-size: 1.25rem;
        letter-spacing: -0.02rem;
        display: inline-block;
        margin: calc(2 * var(--gap-double)) 0 0;
      }

      .post p {
        color: #555;
        font-weight: 400;
        font-size: 0.94rem;
        line-height: 1.7;
      }

      .post a {
        color: #0070f3;
        text-decoration: none;
      }

      .post pre {
        white-space: pre;
      }

      .post pre code {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
      }

      .post code {
        font-size: 0.8rem;
        background: #f1f1f1;
        padding: 0.2rem;
        border-radius: var(--radius);
        font-family: var(--font-mono);
      }

      .post code:not(.inline) {
        display: block;
        padding: 0.8rem;
        line-height: 1.5;
        background: #f5f5f5;
        font-size: 0.75rem;
        border-radius: var(--radius);
      }

      .post figure {
        width: 1080px;
        max-width: calc(100vw - 40px);
        transform: translateX(-50%);
        margin-left: 50%;
        text-align: center;
        cursor: pointer;
      }

      .post figure video {
        max-width: 100%;
        max-height: 90vh;
        outline: none;
      }

      @media (max-width: 600px) {
        .post {
          padding: 0 1rem;
        }
      }
    `}</style>
  </>
)

export const getStaticProps = async () => {
  const markdown = readFileSync(join(process.cwd(), 'docs', 'index.md'))

  const html = await markdownToHtml(markdown)

  return {
    props: {
      html
    }
  }
}
