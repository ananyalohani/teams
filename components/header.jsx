import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Header() {
  const [session, loading] = useSession();

  return (
    <header className='bg-gray-900 w-screen border-b border-gray-600 sticky h-24'>
      <div className='wrapper flex flex-row justify-center sm:justify-between py-5 items-center'>
        <div className='flex flex-row space-x-4 items-center'>
          <a
            href='https://www.microsoft.com/en-in/'
            target='_blank'
            rel='noopener noreferrer'
            style={{ height: 'min-content' }}
            className='flex items-center'
          >
            <img
              src='/images/msft_logo.png'
              alt='Microsoft Logo'
              style={{
                width: 42,
                hight: 42,
              }}
            />
          </a>
          <h1
            style={{ fontSize: '34px', marginBottom: '2px' }}
            className='text-blue-400 font-bold'
          >
            Teams
          </h1>
        </div>

        <div className='flex flex-row space-x-5 items-center '>
          {!session && (
            <>
              <button onClick={signIn} className='btn hidden sm:block'>
                Sign In
              </button>
              <FaUserCircle className='w-12 h-12 text-blue-400 hidden sm:block' />
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
                className='w-12 h-12 rounded-full border-2 border-blue-500 shadow-sm'
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
