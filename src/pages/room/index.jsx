import React from 'react';
import { getSession } from 'next-auth/client';

import Placeholder from '@/components/Layout/Placeholder';
import { generateCallID } from '@/lib/utils';
import Head from '@/components/Head/Head';

export async function getServerSideProps(context) {
  // fetch the next-auth user session
  try {
    const { req, query } = context;
    const session = await getSession({ req });

    if (session) {
      const roomId = query.name ? query.name : generateCallID();
      return {
        redirect: {
          destination: `/room/${roomId}`,
          permanent: false,
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  // user not logged in, redirect to /login page
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };
}

export default function CallRedirect() {
  return (
    <>
      <Head title={'Call'} />
      <Placeholder />
    </>
  );
}
