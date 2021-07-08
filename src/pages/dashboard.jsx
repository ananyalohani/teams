import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { IoVideocam, IoChatboxEllipses } from 'react-icons/io5';
import { CgSpinner } from 'react-icons/cg';

import Layout from '@/components/Layout/Layout';
import getRecentMeetings from '@/utils/recentMeetings';
import { alerts } from '@/lib';
import { validateRoomName } from '@/utils';

export async function getServerSideProps(context) {
  try {
    const { req } = context;
    const session = await getSession({ req });

    if (session) {
      return {
        props: {
          user: session.user,
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  // user not logged in, redirect to /login page
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };
}

export default function Dashboard({ user }) {
  const [roomName, setRoomName] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [submit, setSubmit] = useState(null);

  useEffect(() => {
    getRecentMeetings(user.id).then((data) => {
      setData(data);
      console.log(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateRoomName(roomName)) {
      alert(alerts.invalidRoomName);
      return;
    }

    if (roomName && roomName !== '') {
      if (submit === 1) window.location.href = `/room?name=${roomName}`;
      if (submit === 2) window.location.href = `/room/${roomName}/chat`;
    } else {
      if (submit === 1) window.location.href = '/room';
      if (submit === 2) alert(alerts.emptyRoomName);
    }
  }

  return (
    <Layout title={'Dashboard'}>
      <div
        className='w-full flex items-center justify-center bg-gray-900'
        style={{ height: 'calc(100vh - 5rem)' }}
      >
        <div className='wrapper flex flex-row justify-between items-center text-light'>
          <div className='flex flex-col items-start space-y-5'>
            <div>
              <p className='text-5xl inline'>Hello, </p>
              <p className='text-5xl font-bold text-blue-400 inline'>
                {user.name}!
              </p>
            </div>
            <p className='text-3xl font-semibold'>Start a Meeting</p>
            <p className='text-xl'>
              Video call and group chat with upto{' '}
              <strong>20 participants</strong> at a time.
              <br />
              Secure meetings in <strong>rooms</strong> accessible only to the
              people you choose.
            </p>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-2 '>
              <input
                type='text'
                className='text-box w-100'
                onChange={(e) => setRoomName(e.target.value)}
                placeholder='Enter a name for your room'
              />
              <div className='flex flex-row space-x-3'>
                <button
                  type='submit'
                  className='btn'
                  onClick={() => setSubmit(1)}
                >
                  <IoVideocam className='btn-icon' />
                  New Meeting
                </button>
                <button
                  type='submit'
                  className='btn'
                  onClick={() => setSubmit(2)}
                >
                  <IoChatboxEllipses className='btn-icon' />
                  New Chat Session
                </button>
              </div>
            </form>
          </div>
          <img
            src='/images/video_call.png'
            alt='video call'
            style={{ maxWidth: '28rem', display: 'block' }}
          />
        </div>
      </div>
      <div className='bg-blue-500 w-full flex'>
        <div className='wrapper flex flex-row justify-between items-center py-20 text-dark space-x-9'>
          <div
            id='recent-meetings'
            className='bg-gray-900 rounded-md p-5 flex flex-col space-y-2 flex-1'
            style={{ maxWidth: '70%', margin: '0 auto', maxHeight: '35rem' }}
          >
            <p className='text-3xl text-center font-bold text-light border-b border-gray-800 pb-3'>
              Recent Meetings
            </p>
            <div className='flex flex-col overflow-y-scroll space-y-2 '>
              {data && data.length === 0 ? (
                <div className='text-gray-400 text-center'>
                  <em>You have no recent meetings</em>
                </div>
              ) : (
                data &&
                data.map((meeting) => (
                  <>
                    <div
                      key={meeting._id}
                      className='w-full bg-gray-800 rounded p-3 flex flex-row justify-between'
                    >
                      <div className='flex flex-col space-y-2 text-light'>
                        <p className='font-bold'>{meeting.roomId}</p>
                        <p>{meeting.date}</p>
                      </div>
                      <div className='flex flex-row space-x-2 items-center'>
                        <a href={meeting.meetingLink}>
                          <IoVideocam className='text-gray-600 hover:text-blue-400 w-6 h-6 cursor-pointer' />
                        </a>
                        <a href={meeting.chatLink}>
                          <IoChatboxEllipses className='text-gray-600 hover:text-blue-400 w-6 h-6 cursor-pointer' />
                        </a>
                      </div>
                    </div>
                  </>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
