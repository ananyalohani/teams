import React from 'react';

function Footer() {
  return (
    <footer className='bg-gray-800 flex items-center justify-center border-t border-gray-600'>
      <p className='text-gray-400 p-6'>
        Developed by{' '}
        <a
          href='https://lohani.dev/'
          target='_blank'
          rel='norefferer noopener'
          className='text-blue-400 font-bold hover:text-blue-500'
        >
          Ananya Lohani
        </a>
      </p>
    </footer>
  );
}

export default Footer;
