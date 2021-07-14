import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en'>
        <Head>
          <meta
            name='description'
            content='Teams is a web app implementation of Microsoft Teams'
          />
        </Head>
        <body>
          <script
            async
            defer
            src='https://scripts.simpleanalyticscdn.com/latest.js'
          ></script>
          <noscript>
            <img
              src='https://queue.simpleanalyticscdn.com/noscript.gif'
              alt=''
              referrerpolicy='no-referrer-when-downgrade'
            />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
