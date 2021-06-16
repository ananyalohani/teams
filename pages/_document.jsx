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
          <meta name='description' content='Generated by create next app' />
          <meta
            httpEquiv='Content-Security-Policy'
            content='upgrade-insecure-requests'
          />
          <link
            href='data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAACr/AA6/8AD/ewAAHrA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzMzMwIiIiIDMzMzAiIiIgMzMzMCIiIiAzMzMwIiIiIDMzMzAiIiIgMzMzMCIiIiAzMzMwIiIiIAAAAAAAAAAAEREREEREREAREREQREREQBERERBERERAEREREEREREAREREQREREQBERERBERERAEREREEREREAREREQRERESAgAAAgIAAAICAAACAgAAAgIAAAICAAACAgAAA//8AAICAAACAgAAAgIAAAICAAACAgAAAgIAAAICAAACAgAAA'
            rel='icon'
            type='image/x-icon'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
