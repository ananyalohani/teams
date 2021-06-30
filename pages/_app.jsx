import { Provider } from 'next-auth/client';

import 'styles/tailwind.css';
import 'styles/globals.css';
import 'styles/segoe-ui.css';

import { RoomCallContextProvider } from '@/context/roomCallContext';

function Application({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <RoomCallContextProvider>
        <Component {...pageProps} />
      </RoomCallContextProvider>
    </Provider>
  );
}

export default Application;
