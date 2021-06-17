import React, { useEffect } from 'react';
import { providers, signIn, getSession } from 'next-auth/client';
import { SiGoogle, SiGithub } from 'react-icons/si';
import { MdEmail } from 'react-icons/md';

export default function Login({ session, providers }) {
  useEffect(() => {
    console.log(session);
    console.dir(providers);
    if (session) window.location.href = '/';
  }, [session]);

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
        <form className='flex flex-col space-y-4'>
          <div className='flex flex-col space-y-2'>
            <label htmlFor='#email'>Email Address</label>
            <input
              className='bg-gray-900 border border-gray-600 rounded-md p-1 py-2 w-72'
              type='text'
              name='email'
              id='email'
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <label htmlFor='#password'>Password</label>
            <input
              className='bg-gray-900 border border-gray-600 rounded-md p-1 py-2 w-72'
              type='password'
              name='password'
              id='password'
            />
          </div>
          <button
            className='btn'
            type='submit'
            // key={providers.email.name}
            // onClick={() => signIn(providers.email.id)}
          >
            <MdEmail className='btn-icon' />
            Sign in with Email
          </button>
        </form>
        <div style={{ height: 1 }} className='bg-gray-600' />
        <div className='flex flex-col space-y-4'>
          <button className='btn' onClick={() => signIn(providers.github.id)}>
            <SiGithub className='btn-icon' />
            Sign in with GitHub
          </button>
          <button className='btn' onClick={() => signIn(providers.google.id)}>
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
