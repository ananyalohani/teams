import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CgSpinner } from 'react-icons/cg';
import { useSession } from 'next-auth/client';

import Placeholder from '@/components/placeholder';
import { generateCallID } from 'utils/utils';
import Head from '@/components/head';

export default function CallRedirect({ room }) {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    // redirect to a call/active socket
    console.log(session);
    if (session) {
      const roomId = room.name ? room.name : generateCallID();
      router.push(`/call/${roomId}`); // ? why doesn't this work?
    }

    // if user not logged in, redirect to login page
    if (session === null)
      router.push({
        pathname: '/login',
        query: {
          callbackUrl: '/home',
        },
      });
  }, [session]);

  if (loading || session === null) return <Placeholder />;

  return (
    <>
      <Head title={'Call'} />
      <div className='h-screen w-screen flex flex-col justify-center items-center space-y-3 bg-gray-900 text-light text-5xl font-semibold'>
        <img
          src='/images/connecting.png'
          alt='connecting people'
          className='w-80'
        />
        <div className='flex flex-row items-center space-x-2'>
          <CgSpinner className='w-12 h-12 animate-spin' />
          <h1>Connecting you now...</h1>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query: name }) {
  return {
    props: {
      room: name,
    },
  };
}
