import React, { useEffect } from 'react';
import Head from 'next/head';
import { CgSpinner } from 'react-icons/cg';
// import { v4 as uuidV4 } from 'uuid';
import short from 'short-uuid';

const Call = () => {
  useEffect(() => {
    window.location.href = `/call/${short.generate()}`;
  }, []);

  return (
    <>
      <Head>
        <title>Call</title>
      </Head>
      <div className='flex flex-col h-screen w-screen justify-center items-center text-5xl '>
        <h1 className='text-5xl font-bold'>Loading Page...</h1>
        <CgSpinner className='w-20 h-20 animate-spin ' />
      </div>
    </>
  );
};

export default Call;
