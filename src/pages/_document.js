import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>"></link>
        <meta name="description" content="Compare electricity plans in New Zealand"></meta>
        <meta property="og:title" content="Power Compare NZ" key="title" />
        <meta property="og:description" content="Get cheaper electricity in New Zealand" key="description" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
