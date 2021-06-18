import React from 'react';
import Head from 'next/head';
import Header from '@/components/header';
import Footer from '@/components/footer';

function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />
      <main className='flex flex-col bg-gray-900'>{children}</main>
      <Footer />
    </>
  );
}

export default Layout;
