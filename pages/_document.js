import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Favicons */}
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

          {/* Font */}
          <link
            rel="preload"
            href="/inter.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta httpEquiv="Content-Language" content="en" />
          <meta
            name="description"
            content="SWR is a React Hooks library for remote data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again."
          />
          <meta
            name="og:description"
            content="SWR is a React Hooks library for remote data fetching. SWR first returns the data from cache (stale), then sends the fetch request (revalidate), and finally comes with the up-to-date data again."
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@zeithq" />
          <meta
            name="twitter:image"
            content="https://assets.zeit.co/image/upload/v1572282926/swr/twitter-card.jpg"
          />
          <meta
            name="og:title"
            content="SWR: React Hooks for Remote Data Fetching"
          />
          <meta name="og:url" content="https://swr.now.sh" />
          <meta
            name="og:image"
            content="https://assets.zeit.co/image/upload/v1572282926/swr/twitter-card.jpg"
          />
          <meta name="apple-mobile-web-app-title" content="SWR" />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            try {
              var alreadyAnimated = localStorage.getItem('swr-animated');
              if (!alreadyAnimated) {
                document.body.className = 'animate'
                localStorage.setItem('swr-animated', '1');
              }
            } catch (e) {}
          `
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
