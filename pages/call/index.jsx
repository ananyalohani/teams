import React, { useEffect } from 'react';
import { CgSpinner } from 'react-icons/cg';
import short from 'short-uuid';
import Head from '@/components/head';

const Call = () => {
  useEffect(() => {
    window.location.href = `/call/${short.generate()}`;
  }, []);

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
};

export default Call;
