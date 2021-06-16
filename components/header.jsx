import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Header() {
  const [session, loading] = useSession();

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
          {!session && (
            <>
              <button onClick={signIn} className='btn hidden sm:block'>
                Sign In
              </button>
              <FaUserCircle className='w-10 h-10 text-indigo-400 hidden sm:block' />
            </>
          )}
          {session && (
            <>
              <button onClick={signOut} className='btn hidden sm:block'>
                Sign Out
              </button>
              <img
                src={session.user.image}
                alt='user avatar'
                className='w-10 h-10 rounded-full border border-gray-100 shadow-sm'
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
