import React from 'react';
import { getSession } from 'next-auth/client';

import Placeholder from '@/components/placeholder';
import { generateCallID } from 'utils/utils';
import Head from '@/components/head';

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
          destination: `/call/${roomId}`,
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
