import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/client';
import Header from '../components/header';

export default function Home() {
  const [session, loading] = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      <Head>
        <title>Microsoft Teams</title>
      </Head>
      <Header />
      <main className='sm:min-h-screen'>
        <section className='w-full pt-8 sm:pt-0 bg-gray-100 flex flex-col sm:flex-row items-center space-y-5 sm:space-y-0 sm:justify-between sm:overflow-hidden min-h-1/2'>
          <div className='left-padding-desktop flex flex-col items-center sm:items-start space-y-5 sm:space-y-10 '>
            <h1 className='text-4xl text-center sm:text-left sm:text-5xl text-indigo-600 font-bold'>
              Microsoft Teams
            </h1>
            <p className='text-2xl text-center sm:text-left sm:text-3xl'>
              Meet, chat, call and collaborate <br />
              in just one place.
            </p>
            {!session && (
              <button onClick={signIn} className='btn'>
                Sign In
              </button>
            )}
            {session && (
              <button onClick={signOut} className='btn'>
                Sign Out
              </button>
            )}
          </div>
          <img
            src='/images/homepage_picture.png'
            alt='homepage picture'
            className='sm:h-full'
          />
        </section>
        <section className='bg-indigo-500 flex flex-col items-center w-full p-16 space-y-10 sm:min-h-1/2'>
          <h1 className='text-4xl sm:text-5xl font-bold text-white text-center'>
            Get Started with Microsoft Teams today!
          </h1>
          <ul className='list-none flex flex-col space-y-5 items-center'>
            <li className='flex flex-row space-x-8 items-center'>
              <img
                src='/images/001-online-community.png'
                alt='community'
                className='h-14'
              />
              <p className='text-white text-lg sm:text-xl max-w-3xl'>
                Whether it’s chat, calls, or video, anyone can engage at any
                time, bringing everyone closer.
              </p>
            </li>
            <li className='flex flex-row space-x-8 items-center'>
              <img
                src='/images/004-task-planning.png'
                alt='documents'
                className='h-14'
              />
              <p className='text-white text-lg sm:text-xl max-w-3xl'>
                Your docs, photos, videos, chat history, and meeting notes are
                always there, so it’s easier to work together.
              </p>
            </li>
            <li className='flex flex-row space-x-8 items-center'>
              <img
                src='/images/002-responsive-design.png'
                alt='computer apps'
                className='h-14'
              />
              <p className='text-white text-lg sm:text-xl max-w-3xl'>
                Set up your team’s space with all the apps you need so you can
                stay in just one place instead of jumping around.
              </p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
