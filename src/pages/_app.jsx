import { Provider } from 'next-auth/client';

import '@/styles/tailwind.css';
import '@/styles/globals.css';
import '@/styles/segoe-ui.css';

import { RoomContextProvider } from '@/context/RoomContext';
import { SocketContextProvider } from '@/context/SocketContext';
import { BackgroundContextProvider } from '@/context/BackgroundContext';

function Application({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <SocketContextProvider>
        <RoomContextProvider>
          <BackgroundContextProvider>
            <Component {...pageProps} />
          </BackgroundContextProvider>
        </RoomContextProvider>
      </SocketContextProvider>
    </Provider>
  );
}

export default Application;
