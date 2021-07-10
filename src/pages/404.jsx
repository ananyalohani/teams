import React from 'react';

import Layout from '@/components/Layout/Layout';

function Custom404() {
  return (
    <Layout title='Not Found'>
      <div
        className='flex flex-col items-center justify-center space-y-5'
        style={{ height: 'calc(100vh - 9rem)' }}
      >
        <img
          src='/images/page_not_found.png'
          className='max-w-lg'
          alt='page not found'
        />
        <div className='text-3xl text-light flex flex-row space-x-3'>
          <p className='text-red-400 font-bold'>404</p>
          <div style={{ width: 1 }} className='bg-gray-200 opacity-40'></div>
          <p>The page you're looking for does not exist.</p>
        </div>
      </div>
    </Layout>
  );
}

export default Custom404;
