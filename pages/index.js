import { readFileSync } from 'fs'
import { join } from 'path'
import markdownToHtml from 'lib/markdown-to-html'
import Head from 'next/head'
import Header from 'components/header'
import Footer from 'components/footer'

export const config = {
  unstable_runtimeJS: false
}

export default ({ html }) => (
  <>
    <Head>
      <title>SWR: React Hooks for Remote Data Fetching</title>
    </Head>

    <Header />

    <main className="post" dangerouslySetInnerHTML={{ __html: html }} />

    <Footer />
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
