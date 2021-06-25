import React, { useEffect } from 'react';
import { getSession } from 'next-auth/client';

import { useCallContext } from '@/context/callContext';
import CallFooter from '@/components/callFooter';
import ChatPanel from '@/components/chatPanel';
import Header from '@/components/header';
import Video from '@/components/video';
import Head from '@/components/head';

export default function Call({ serverURL, clientURL, roomId, user }) {
  const {
    setRoomId,
    setServerURL,
    setClientURL,
    peers,
    userStream,
    joinedRoomRef,
    userVideoRef,
    joinRoom,
    leaveRoom,
    receiveMessages,
  } = useCallContext();

  useEffect(() => {
    setServerURL(serverURL);
    setClientURL(clientURL);
    setRoomId(roomId);
  }, []);

  useEffect(() => {
    // this effect will only run once after getting user's audio and video
    if (userStream === 'not initialised') return;
    if (!joinedRoomRef.current) {
      joinRoom(userStream);
      leaveRoom();
      receiveMessages();
      joinedRoomRef.current = true;
    }
  }, [userStream]);

  return (
    <>
      <Head title={`Call - ${roomId}`} />
      <Header />
      <div
        className='flex flex-col'
        style={{ minHeight: 'calc(100vh - 6rem)' }}
      >
        <div className='flex flex-row h-full flex-1'>
          <div className='bg-gray-900 flex-1 flex items-center justify-center'>
            <div id='video-grid' className='flex flex-wrap justify-center p-5'>
              <Video ref={userVideoRef} />
              {peers.map((p) => {
                return <Video key={p.peerId} peer={p.peer} />;
              })}
            </div>
          </div>
          <ChatPanel user={user} />
        </div>
        <CallFooter />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const { req, query } = context;
    const session = await getSession({ req });

    if (session) {
      const serverURL = process.env.SERVER_URL;
      const clientURL = process.env.CLIENT_URL;

      return {
        props: {
          serverURL,
          clientURL,
          roomId: query.id,
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
