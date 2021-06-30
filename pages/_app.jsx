import { Provider } from 'next-auth/client';

import 'styles/tailwind.css';
import 'styles/globals.css';
import 'styles/segoe-ui.css';

import { CallContextProvider } from '@/context/callContext';
import { RoomCallContextProvider } from '@/context/roomCallContext';

function Application({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <CallContextProvider>
        <RoomCallContextProvider>
          <Component {...pageProps} />
        </RoomCallContextProvider>
      </CallContextProvider>
    </Provider>
  );
}

export default Application;
