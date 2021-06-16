import React, { useEffect } from 'react';
import { providers, signIn, getSession } from 'next-auth/client';

export default function Login({ session, providers }) {
  useEffect(() => {
    console.log(session);
    if (session) window.location.href = '/';
  }, [session]);

  return (
    <div>
      <h1>Welcome to custom page</h1>
      <div>
        {Object.values(providers).map((provider) => {
          if (provider.id === 'Email') return;
          return (
            <button
              className='btn'
              key={provider.name}
              onClick={() => signIn(provider.id)}
            >
              Sign in with {provider.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

Login.getInitialProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });

  if (session && res && session.accessToken) {
    console.log(session.user);
    res.end();
    return;
  }

  return {
    session: session,
    providers: await providers(context),
  };
};
