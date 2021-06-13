import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
  return (
    <header className='bg-white w-full border-b-2 sticky h-24'>
      <div className='wrapper flex flex-row sm:justify-between py-5 items-center'>
        <div className='flex flex-row space-x-2 items-center '>
          <a
            href='https://www.microsoft.com/en-in/'
            target='_blank'
            rel='noopener noreferrer'
            style={{ height: 'min-content' }}
            className='flex items-center'
          >
            <img
              src='/images/microsoft_logo.png'
              alt='Microsoft Logo'
              width='180px'
            />
          </a>
          <h1
            style={{ fontSize: '34px', marginBottom: '2px' }}
            className='text-indigo-700 font-semibold'
          >
            Teams
          </h1>
        </div>

        <div className='flex flex-row space-x-4 items-center '>
          <button className='btn hidden sm:block'>Sign In</button>
          <FaUserCircle className='w-10 h-10 text-indigo-400 hidden sm:block' />
        </div>
      </div>
    </header>
  );
}
