import React from 'react';

import Head from '@/components/Head/Head';
import Header from '@/components/Header/Header';

function LayoutNoFooter({ title, children }) {
  return (
    <>
      <Head title={title} />
      <Header />
      <main className='flex flex-col bg-gray-900'>{children}</main>
    </>
  );
}

export default LayoutNoFooter;
