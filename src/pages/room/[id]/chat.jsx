import React, { useEffect, useState } from 'react';
import { IoSendSharp } from 'react-icons/io5';
import { getSession } from 'next-auth/client';

import Layout from '@/components/Layout/Layout';
import ChatSessionPanel from '@/components/Panels/ChatSessionPanel';
import { useRoomContext } from '@/context/RoomContext';
import { useSocketContext } from '@/context/SocketContext';

export default function Chat({ roomId, user }) {
  const { setRoomId, setUser, setIsChatSession } = useRoomContext();
  const { chats, sendMessage } = useSocketContext();
  const [message, setMessage] = useState('');

  useEffect(() => {
    setRoomId(roomId);
    setUser(user);
    setIsChatSession(true);
  }, []);

  return (
    <Layout title={`Chat - ${roomId}`}>
      <div
        className='flex-1 flex flex-row'
        style={{ height: 'calc(100vh - 9rem)' }}
      >
        <div className='flex-1 bg-gray-850 flex flex-col'>
          <div
            className='flex-1 flex flex-col my-0 mx-auto'
            style={{ width: '95%' }}
          >
            <div
              id='chat-window'
              className='text-gray-200 overflow-y-scroll flex flex-col space-y-5 py-5 '
              style={{ height: 'calc(100vh - 15.5rem)' }}
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
                      <div className='bg-gray-900 rounded py-3 px-3 flex flex-col space-y-1 w-72'>
                        <div className='flex flex-row items-center justify-between'>
                          <p className='text-sm font-semibold'>
                            {isUserMe
                              ? `${chat.user.name} (You)`
                              : `${chat.user.name}`}
                          </p>
                          <p className='text-sm font-light opacity-80'>
                            {chat.message.time}
                          </p>
                        </div>
                        <p className='text-sm'>{chat.message.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              sendMessage(e, message, user);
              setMessage('');
            }}
            className='flex flex-row space-x-4 mx-auto bg-gray-900 py-8 w-full px-8 border-t border-gray-950'
          >
            <input
              type='text'
              className='text-box bg-gray-800 flex-1'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder='Type your message...'
            />
            <button type='submit' className=''>
              <IoSendSharp className='text-gray-700 hover:text-blue-400 w-6 h-6' />
            </button>
          </form>
        </div>
        <ChatSessionPanel />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
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
