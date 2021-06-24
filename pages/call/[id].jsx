import React, { useEffect } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

import { useCallContext } from '@/context/callContext';
import Placeholder from '@/components/placeholder';
import CallFooter from '@/components/callFooter';
import ChatPanel from '@/components/chatPanel';
import Header from '@/components/header';
import Video from '@/components/video';
import Head from '@/components/head';

export default function Call({ serverURL, clientURL, roomId }) {
  const router = useRouter();
  const [session, loading] = useSession();

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
    // if user not logged in, redirect to login page
    if (session === null)
      router.push({
        pathname: '/login',
        query: {
          callbackUrl: '/home',
        },
      });

    if (session) {
      setServerURL(serverURL);
      setClientURL(clientURL);
      setRoomId(roomId);
    }
  }, [session]);

  useEffect(() => {
    // this effect will only run once after getting user's audio and video
    if (session) {
      if (userStream === 'not initialised') return;
      if (!joinedRoomRef.current) {
        joinRoom(userStream);
        leaveRoom();
        receiveMessages();
        joinedRoomRef.current = true;
      }
    }
  }, [userStream, session]);

  if (loading || session === null) return <Placeholder />;

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
          <ChatPanel />
        </div>
        <CallFooter />
      </div>
    </>
  );
}

export async function getServerSideProps({ query: { id } }) {
  const serverURL = process.env.SERVER_URL;
  const clientURL = process.env.CLIENT_URL;

  return {
    props: {
      serverURL,
      clientURL,
      roomId: id,
    },
  };
}
