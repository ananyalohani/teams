import { Provider } from 'next-auth/client';

import 'styles/tailwind.css';
import 'styles/globals.css';
import 'styles/segoe-ui.css';

import { CallContextProvider } from '@/context/callContext';

function Application({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <CallContextProvider>
        <Component {...pageProps} />
      </CallContextProvider>
    </Provider>
  );
}

export default Application;
