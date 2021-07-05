import { Provider } from 'next-auth/client';

import 'styles/tailwind.css';
import 'styles/globals.css';
import 'styles/segoe-ui.css';

import { RoomContextProvider } from 'context/RoomContext';

function Application({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <RoomContextProvider>
        <Component {...pageProps} />
      </RoomContextProvider>
    </Provider>
  );
}

export default Application;
