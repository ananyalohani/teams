import React, { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

import Layout from '@/components/layout';

export default function Index() {
  const [session, loading] = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <Layout title='Microsoft Teams'>
      <section className='w-full bg-blue-500 flex-1 flex flex-col'>
        <div className='wrapper h-full flex flex-col flex-1 sm:flex-row items-center sm:justify-between sm:overflow-hidden py-12'>
          <div className='flex flex-col items-center sm:items-start space-y-5 sm:space-y-10 '>
            <div className='flex flex-col space-y-3'>
              <h1 className='text-4xl text-center sm:text-left sm:text-5xl text-gray-900 font-bold'>
                Microsoft Teams
              </h1>
              <p className='text-2xl text-center sm:text-left sm:text-2xl'>
                Meet, chat, call and collaborate <br />
                in just one place.
              </p>
            </div>
            {!session ? (
              <button onClick={signIn} className='btn-alt'>
                Get Started
              </button>
            ) : (
              <button onClick={signOut} className='btn-alt'>
                Sign Out
              </button>
            )}
          </div>
          <img
            src='/images/homepage_video_call.png'
            alt='homepage picture'
            className='w-96'
          />
        </div>
      </section>
      <section className='bg-gray-900 flex flex-col items-center w-full py-12 space-y-14 sm:min-h-1/2'>
        <h1 className='text-4xl sm:text-5xl font-bold text-blue-400 text-center'>
          Why Teams?
        </h1>
        <div className='wrapper flex flex-col space-y-10 sm:space-y-0 sm:flex-row justify-between'>
          <img
            src='/images/thinking.png'
            alt='thinking man'
            style={{ maxWidth: '26rem', display: 'block' }}
          />
          <ul className='bg-gray-600 bg-opacity-75 px-5 sm:px-10 rounded-xl border border-gray-500 flex flex-col divide-y divide-gray-500 list-none'>
            <li className='py-6 flex-1 flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-5'>
              <img
                src='/images/connected_people.png'
                alt='connected people'
                className='h-20 sm:h-16'
              />
              <p className='card-text'>
                Whether it’s chat, calls, or video, anyone can engage at any
                time, bringing everyone closer.
              </p>
            </li>
            <li className='py-6 flex-1 flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-5'>
              <img
                src='/images/documents.png'
                alt='documents'
                className='h-20 sm:h-16'
              />
              <p className='card-text'>
                Your docs, photos, videos, chat history, and meeting notes are
                always there, so it’s easier to work together.
              </p>
            </li>
            <li className='py-6 flex-1 flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:space-x-5'>
              <img src='/images/apps.png' alt='apps' className='h-20 sm:h-16' />
              <p className='card-text'>
                Set up your team’s space with all the apps you need so you can
                stay in just one place.
              </p>
            </li>
          </ul>
        </div>
        {/* <p className='text-white'>{JSON.stringify(colors)}</p> */}
      </section>
    </Layout>
  );
}
