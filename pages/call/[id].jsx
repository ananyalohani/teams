import React, { useEffect } from 'react';

import { useCallContext } from '@/context/callContext';
import CallFooter from '@/components/callFooter';
import ChatPanel from '@/components/chatPanel';
import Header from '@/components/header';
import Video from '@/components/video';
import Head from '@/components/head';

export default function Call({ serverURL, clientURL, roomId }) {
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
      <div className='h-screen'>
        <Header />
        <ChatPanel />
        <div
          id='video-grid'
          className='bg-gray-900 absolute left-0 bottom-20 top-24 right-0 sm:right-80 flex items-center justify-center'
        >
          <div className='flex flex-wrap justify-center'>
            <Video ref={userVideoRef} />
            {peers.map((p) => {
              return <Video key={p.peerId} peer={p.peer} />;
            })}
          </div>
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
