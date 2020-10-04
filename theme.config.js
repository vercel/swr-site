import DocSearch from 'components/docsearch'

const Logo = ({ height }) => <svg height={height} viewBox="0 0 291 69" fill="none">
  <path d="M0 36.53c.07 17.6 14.4 32.01 32.01 32.01a32.05 32.05 0 0032.01-32V32a13.2 13.2 0 0123.4-8.31h20.7A32.07 32.07 0 0077.2 0a32.05 32.05 0 00-32 32.01v4.52A13.2 13.2 0 0132 49.71a13.2 13.2 0 01-13.18-13.18 3.77 3.77 0 00-3.77-3.77H3.76A3.77 3.77 0 000 36.53zM122.49 68.54a32.14 32.14 0 01-30.89-23.7h20.67a13.16 13.16 0 0023.4-8.3V32A32.05 32.05 0 01167.68 0c17.43 0 31.64 14 32 31.33l.1 5.2a13.2 13.2 0 0023.4 8.31h20.7a32.07 32.07 0 01-30.91 23.7c-17.61 0-31.94-14.42-32.01-32l-.1-4.7v-.2a13.2 13.2 0 00-13.18-12.81 13.2 13.2 0 00-13.18 13.18v4.52a32.05 32.05 0 01-32.01 32.01zM247.94 23.7a13.16 13.16 0 0123.4 8.31 3.77 3.77 0 003.77 3.77h11.3a3.77 3.77 0 003.76-3.77A32.05 32.05 0 00258.16 0a32.07 32.07 0 00-30.92 23.7h20.7z" fill="currentColor"/>
</svg>

const Vercel = ({ height = 20 }) => (
  <svg height={height} viewBox="0 0 283 64" fill="none">
    <path fill="currentColor" d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"/>
  </svg>
)

export default {
  github: 'https://github.com/vercel/swr',
  siteGithub: 'https://github.com/vercel/swr-site',
  titleSuffix: ' – SWR',
  customSearch: <DocSearch/>,
  logo: <>
    <Logo height={18}/>
    <span className="mx-2 font-extrabold hidden md:inline">SWR</span>
    <span className="text-gray-600 font-normal hidden md:inline whitespace-no-wrap">React Hooks for data fetching</span>
  </>,
  head: <>
    {/* Favicons, meta */}
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/favicon/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/favicon/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/favicon/favicon-16x16.png"
    />
    <link rel="manifest" href="/favicon/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/favicon/safari-pinned-tab.svg"
      color="#000000"
    />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="theme-color" content="#ffffff" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta httpEquiv="Content-Language" content="en" />
    <meta
      name="description"
      content="SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again."
    />
    <meta
      name="og:description"
      content="SWR is a React Hooks library for data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again."
    />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@vercel" />
    <meta
      name="twitter:image"
      content="https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg"
    />
    <meta
      name="og:title"
      content="SWR: React Hooks for Data Fetching"
    />
    <meta name="og:url" content="https://swr.vercel.com" />
    <meta
      name="og:image"
      content="https://assets.vercel.com/image/upload/v1572282926/swr/twitter-card.jpg"
    />
    <meta name="apple-mobile-web-app-title" content="SWR" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css" media="print" onload="this.media='all'" />
  </>,
  footerText: <a href="https://vercel.com/?utm_source=swr" target="_blank" rel="noopener" className="inline-flex items-center no-underline text-black font-semibold">
    <span className="mr-1">Powered by</span><span><Vercel/></span>
  </a>
}
