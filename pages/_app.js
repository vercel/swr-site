import '.nextra/styles.css'

export default function Nextra({ Component, pageProps }) {
  return <>
    <Component {...pageProps} />
    <script src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"/>
  </>
}
