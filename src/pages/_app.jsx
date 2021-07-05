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
      <RoomContextProvider>
        <SocketContextProvider>
          <BackgroundContextProvider>
            <Component {...pageProps} />
          </BackgroundContextProvider>
        </SocketContextProvider>
      </RoomContextProvider>
    </Provider>
  );
}

export default Application;
