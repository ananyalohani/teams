import React from 'react';
import { getSession } from 'next-auth/client';

import Placeholder from '@/components/Layout/Placeholder';
import { generateCallID } from 'utils';
import Head from '@/components/Head/Head';

export default function CallRedirect() {
  return (
    <>
      <Head title={'Call'} />
      <Placeholder />
    </>
  );
}

export async function getServerSideProps(context) {
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
