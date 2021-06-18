import React from 'react';
import Head from 'next/head';

function CustomHead({ title }) {
  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}

export default CustomHead;
