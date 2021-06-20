import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { IoVideocam } from 'react-icons/io5';
import { HiCode } from 'react-icons/hi';

import Layout from '@/components/layout';

function Home() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [roomName, setRoomName] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    if (roomName && roomName !== '') {
      removeSpaces();
      router.push({
        pathname: '/call',
        query: {
          name: roomName,
        },
      });
    } else {
      router.push('/call');
    }
  }

  function removeSpaces() {
    if (roomName?.includes(' ')) {
      const arr = roomName;
      arr.split(' ').join('-');
      setRoomName(arr);
    }
  }

  return (
    <Layout title={'Home'}>
      <section
        className='w-full flex items-center justify-center'
        style={{ height: 'calc(100vh - 6rem)' }}
      >
        <div className='wrapper flex flex-row justify-between items-center text-light'>
          <div className='flex flex-col items-start space-y-5'>
            <div>
              <p className='text-5xl inline'>Hello, </p>
              <p className='text-5xl font-bold text-blue-400 inline'>
                Ananya Lohani!
              </p>
            </div>
            <p className='text-3xl font-semibold'>Start a Meeting</p>
            <p className='text-xl'>
              Video call and group chat with upto{' '}
              <strong>4 participants</strong> at a time.
              <br />
              Secure meetings in <strong>rooms</strong> accessible only to the
              people you choose.
            </p>
            <form
              onSubmit={handleSubmit}
              className='flex flex-row space-x-2 items-center'
            >
              <input
                type='text'
                className='text-box'
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='Enter a name for your room'
              />
              <button type='submit' className='btn'>
                <IoVideocam className='btn-icon' />
                New Meeting
              </button>
            </form>
          </div>
          <img
            src='/images/video_call.png'
            alt='video call'
            style={{ maxWidth: '28rem', display: 'block' }}
          />
        </div>
      </section>
      <section className='bg-blue-500 w-full flex'>
        <div className='wrapper flex flex-row justify-between items-center py-20 text-dark'>
          <img
            src='/images/secure_server.png'
            alt='secure server'
            className='w-96'
          />
          <div className='flex flex-col items-end space-y-5'>
            <p className='text-5xl font-bold'>Your meetings are secure</p>
            <p className='text-xl text-right'>
              Connections are made through sockets on a{' '}
              <strong>secure server.</strong>
              <br />
              Only <strong>authenticated</strong> users can join them.
            </p>
          </div>
        </div>
      </section>
      <section className='w-full flex'>
        <div className='wrapper flex flex-row justify-between items-center text-light py-20'>
          <div className='flex flex-col items-start space-y-6 max-w-xl'>
            <div>
              <p className='text-5xl font-bold'>About this Project</p>
            </div>
            <p className='text-xl'>
              This Microsoft Teams Clone was the capstone project of the
              Microsoft Engage program, 2021.
            </p>
            <p className='text-xl'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <button className='btn link'>
              <a href='#'>
                {/* Github repo link */}
                <HiCode className='btn-icon' />
                Source Code
              </a>
            </button>
          </div>
          <img
            src='/images/about_project.png'
            alt='coder'
            style={{ maxWidth: '28rem', display: 'block' }}
          />
        </div>
      </section>
    </Layout>
  );
}

export default Home;
