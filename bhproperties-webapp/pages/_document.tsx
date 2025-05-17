import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Icon-font CSS served directly from /public */}
        <link
          rel="stylesheet"
          href="/assets/icon-fonts/remixicon/fonts/remixicon.css"
        />
        <link rel="stylesheet" href="/assets/icon-fonts/feather/feather.css" />
        <link rel="stylesheet" href="/assets/icon-fonts/bootstrap-icons/icons/font/bootstrap-icons.css" />
        <link rel="stylesheet" href="/assets/icon-fonts/tabler-icons/webfont/tabler-icons.css" />
        <link rel="stylesheet" href="/assets/icon-fonts/line-awesome/1.3.0/css/line-awesome.css" />
        <link rel="stylesheet" href="/assets/icon-fonts/boxicons/css/boxicons.css" />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
