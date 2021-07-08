import React from 'react';
import { signIn, getSession, getProviders } from 'next-auth/client';
import { SiGoogle, SiGithub } from 'react-icons/si';
import url from '@/lib/url';

export default function Login({ providers, callbackUrl }) {
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
      <div className='p-5 flex flex-col space-y-5'>
        <div className='flex flex-col space-y-4'>
          <button
            className='btn'
            onClick={() =>
              signIn(providers.github.id, {
                callbackUrl,
              })
            }
          >
            <SiGithub className='btn-icon' />
            Sign in with GitHub
          </button>
          <button
            className='btn'
            onClick={() => signIn(providers.google.id, { callbackUrl })}
          >
            <SiGoogle className='btn-icon' />
            Sign in with Google
          </button>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  try {
    const { req } = context;
    const session = await getSession({ req });
    if (session) {
      // if user is already logged in, redirect to /dashboard
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  const providers = await getProviders();

  return {
    props: { providers, callbackUrl: `${url.client}/dashboard` },
  };
}
