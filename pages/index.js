import Head from 'next/head'
import Header from 'components/header'
import Footer from 'components/footer'
import Content from 'docs/index.mdx'

export default () => (
  <>
    <Head>
      <title>SWR: React Hooks for Remote Data Fetching</title>
    </Head>

    <Header />

    <Content />

    <Footer />
  </>
)
