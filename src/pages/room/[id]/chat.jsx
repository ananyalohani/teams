import React, { useEffect, useState } from 'react';
import { IoSendSharp, IoInformationCircle } from 'react-icons/io5';
import { getSession } from 'next-auth/client';

import LayoutNoFooter from '@/components/Layout/LayoutNoFooter';
import ChatSessionPanel from '@/components/Panels/ChatSessionPanel';
import Scroller from '@/components/Scroller/Scroller';
import { useSocketContext } from '@/context/SocketContext';
import classNames from 'classnames';
import { formattedDateString } from '@/lib/utils';

export async function getServerSideProps(context) {
  // fetch the next-auth user session
  try {
    const { req, query } = context;
    const session = await getSession({ req });

    if (session) {
      const roomId = query.id;

      return {
        props: {
          roomId,
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

export default function Chat({ roomId, user }) {
  const { chats, sendMessage, setRoomId, setUser } = useSocketContext();
  const [message, setMessage] = useState('');
  const [sidePanel, setSidePanel] = useState(false);

  useEffect(() => {
    // initialise values
    setRoomId(roomId);
    setUser(user);
  }, []);

  return (
    <LayoutNoFooter title={`Chat - ${roomId}`}>
      <div className='flex flex-row' style={{ height: 'calc(100vh - 5rem)' }}>
        <div
          className={classNames('flex-1 bg-gray-850 md:flex flex-col', {
            flex: !sidePanel,
            hidden: sidePanel,
          })}
        >
          <div
            className='flex-1 flex flex-col my-0 mx-auto'
            style={{ width: '95%' }}
          >
            <div
              id='chat-window'
              className='text-gray-200 overflow-y-scroll flex flex-col space-y-5 py-5'
            >
              {chats.map((chat, idx) => {
                const isUserMe = chat.user.id === user.id;
                return (
                  <div className='w-full' key={idx}>
                    <div
                      className={
                        isUserMe
                          ? 'flex items-center flex-row-reverse float-right'
                          : 'flex items-center flex-row'
                      }
                    >
                      <img
                        src={chat.user.image}
                        alt='user avatar'
                        className='w-12 h-12 rounded-full shadow-sm mx-4'
                      />
                      <div className='bg-gray-900 rounded py-3 px-3 flex flex-col space-y-1 w-64 sm:w-72'>
                        <div className='flex flex-row items-center justify-between'>
                          <p className='text-sm font-semibold'>
                            {isUserMe
                              ? `${chat.user.name} (You)`
                              : `${chat.user.name}`}
                          </p>
                          <p className='text-sm font-light opacity-60'>
                            {formattedDateString(
                              chat.message.date ?? new Date()
                            )}
                          </p>
                        </div>
                        <p className='text-sm'>{chat.message.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Scroller />
            </div>
          </div>
          <div className='flex flex-row space-x-4 mx-auto bg-gray-900 py-8 w-full px-8 border-t border-gray-950'>
            <button className='' onClick={() => setSidePanel(!sidePanel)}>
              <IoInformationCircle className='text-gray-700 hover:text-blue-400 w-8 h-8' />
            </button>
            <form
              onSubmit={(e) => {
                sendMessage(e, message, user);
                setMessage('');
              }}
              className='flex flex-row space-x-4 flex-1'
            >
              <input
                type='text'
                className='text-box bg-gray-800 flex-1 mx-4 '
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder='Type your message...'
              />
              <button type='submit' className=''>
                <IoSendSharp className='text-gray-700 hover:text-blue-400 w-6 h-6' />
              </button>
            </form>
          </div>
        </div>
        <ChatSessionPanel sidePanel={sidePanel} setSidePanel={setSidePanel} />
      </div>
    </LayoutNoFooter>
  );
}
