import React, { useEffect } from 'react';
import { providers, signIn, getSession } from 'next-auth/client';
import { SiGoogle, SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';
import { useRouter } from 'next/router';

export default function Login({ session, providers }) {
  const router = useRouter();

  return (
    <main className='bg-gray-900 flex flex-col items-center h-screen space-y-8 justify-center text-gray-200'>
      <div className='flex flex-col items-center space-y-5'>
        <img
          src='/images/msft_logo.png'
          alt='microsoft logo'
          className='w-8 h-8'
        />
        <div className='text-3xl'>
          <p className='inline'> Sign in to </p>
          <p className='font-bold text-blue-400 inline'>Teams</p>
        </div>
      </div>
      <div className='bg-gray-800 rounded-lg border border-gray-600 p-8 flex flex-col space-y-5'>
        <div className='flex flex-col space-y-4'>
          <button
            className='btn'
            onClick={() =>
              signIn(providers.github.id, {
                callbackUrl: router.query.callbackUrl,
              })
            }
          >
            <SiGithub className='btn-icon' />
            Sign in with GitHub
          </button>
          <button
            className='btn'
            onClick={() =>
              signIn(providers.google.id, {
                callbackUrl: router.query.callbackUrl,
              })
            }
          >
            <SiGoogle className='btn-icon' />
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
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
