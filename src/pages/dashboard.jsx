import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/client';
import { IoVideocam, IoChatboxEllipses } from 'react-icons/io5';
import { CgSpinner } from 'react-icons/cg';
import { AiFillClockCircle } from 'react-icons/ai';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

import Layout from '@/components/Layout/Layout';
import getRecentMeetingData from '@/lib/utils/dashboardData';
import { alerts } from '@/lib';
import { validateRoomName, formattedDateString, sortByDate } from '@/lib/utils';

export async function getServerSideProps(context) {
  // fetch the next-auth user session
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
  const [meetings, setMeetings] = useState([]);
  const [submit, setSubmit] = useState(null);

  useEffect(() => {
    if (meetings.length > 0) return;
    getRecentMeetingData(user, setMeetings);
  }, []);

  useEffect(() => {
    if (meetings.length) {
      setMeetings(sortByDate(meetings));
      setLoading(false);
    }
  }, [meetings]);

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
        <div className='wrapper flex flex-row lg:justify-between justify-center items-center text-light'>
          <div className='flex flex-col items-start space-y-5'>
            <div>
              <p className='text-4xl sm:text-5xl inline'>Hello, </p>
              <p className='text-4xl sm:text-5xl font-bold text-blue-400 inline'>
                {user.name}!
              </p>
            </div>
            <p className='text-2xl sm:text-3xl font-semibold'>
              Start a Meeting
            </p>
            <p className='text-lg sm:text-xl'>
              Video call and group chat with upto{' '}
              <strong>25 participants</strong> at a time.
              <br />
              Secure meetings in <strong>rooms</strong> accessible only to the
              people you choose.
            </p>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-2 '>
              <input
                type='text'
                className='text-box sm:w-100'
                style={{ width: '22rem' }}
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
            className='hidden lg:block'
            style={{ maxWidth: '28rem', display: 'block' }}
          />
        </div>
      </div>
      <div className='bg-blue-500 w-full flex'>
        <div className='wrapper py-20 text-dark'>
          <div
            id='recent-meetings'
            className='bg-gray-900 rounded-md p-5 flex flex-col space-y-2 flex-1 mx-auto'
            style={{ maxHeight: '35rem', minHeight: '15rem' }}
          >
            <div className='flex flex-row space-x-3 items-center justify-center border-b border-gray-800 pb-3'>
              <AiFillClockCircle className='text-light h-10 w-10' />
              <p className='text-3xl font-bold text-light '>Recent Meetings</p>
            </div>
            <div
              className={classNames(
                'flex flex-col overflow-y-auto space-y-2 items-center flex-1 relative'
              )}
            >
              {loading && (
                <CgSpinner className='text-gray-300 w-8 h-8 animate-spin' />
              )}
              {meetings &&
                (!loading && meetings.length === 0 ? (
                  <div className='text-gray-400 text-center'>
                    <em>You have no recent meetings</em>
                  </div>
                ) : (
                  meetings.map((meeting, idx) => (
                    <div
                      key={idx}
                      className='w-full bg-gray-800 rounded p-3 flex flex-row justify-between '
                    >
                      <div className='flex flex-col space-y-2 text-light'>
                        <p className='font-bold text-blue-400'>
                          {meeting.roomId}
                        </p>
                        <p className='text-sm'>
                          {formattedDateString(meeting.date)}
                        </p>
                        {
                          <div className='flex flex-row text-sm'>
                            <p className='font-semibold mr-2'>Participants: </p>
                            <p className='text-gray-400'>You</p>
                            {meeting.users.map((user, idx) => (
                              <p key={idx} className='text-gray-400'>
                                , {user.name.split(' ')[0]}
                              </p>
                            ))}
                          </div>
                        }
                      </div>
                      <div className='flex flex-row space-x-2 items-center'>
                        <Tooltip title='Rejoin this call'>
                          <a href={meeting.meetingLink}>
                            <IoVideocam className='text-gray-500 hover:text-blue-400 w-6 h-6 cursor-pointer' />
                          </a>
                        </Tooltip>
                        <Tooltip title='Rejoin this chat room'>
                          <a href={meeting.chatLink}>
                            <IoChatboxEllipses className='text-gray-500 hover:text-blue-400 w-6 h-6 cursor-pointer' />
                          </a>
                        </Tooltip>
                      </div>
                    </div>
                  ))
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
