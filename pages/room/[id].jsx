import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import Participant from '@/components/participant';
import Header from '@/components/header';
import Head from '@/components/head';
import ChatPanel from '@/components/chatPanel';
import CallFooter from '@/components/callFooter';
import { useRoomCallContext } from '@/context/roomCallContext';
import { assignRandomColor } from 'utils';
import dynamic from 'next/dynamic';

// const ExcalidrawComp = dynamic(() => import('@excalidraw/excalidraw'));

export default function RoomCall({
  serverURL,
  clientURL,
  roomId,
  user,
  accessToken,
}) {
  const {
    room,
    participants,
    joinRoom,
    leaveRoom,
    setServerURL,
    setClientURL,
    setRoomId,
    setToken,
    setUser,
    socketConnected,
    receiveMessages,
    updateUsersList,
  } = useRoomCallContext();

  useEffect(() => {
    setServerURL(serverURL);
    setClientURL(clientURL);
    setToken(accessToken);
    setRoomId(roomId);
    setUser({ ...user, color: assignRandomColor() });
  }, []);

  useEffect(() => {
    console.log('socket connected:', socketConnected.current);
    if (socketConnected.current) {
      joinRoom();
      updateUsersList();
      leaveRoom();
      receiveMessages();
    }
  }, [socketConnected.current]);

  const remoteParticipants = participants?.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  // return <ExcalidrawComp />;

  return (
    <>
      <Head title={`Call - ${roomId}`} />
      <Header />
      <div
        className='flex flex-col'
        style={{ minHeight: 'calc(100vh - 5rem)' }}
      >
        <div className='flex flex-row h-full flex-1'>
          <div className='bg-gray-875 flex-1 flex items-center justify-center'>
            <div id='video-grid' className='flex flex-wrap justify-center p-5'>
              {room && (
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                  me={true}
                />
              )}
              {remoteParticipants}
            </div>
          </div>
          <ChatPanel />
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
      const roomId = query.id;
      const serverURL = process.env.SERVER_URL;
      const clientURL = process.env.CLIENT_URL;

      try {
        const data = await fetch(`${serverURL}/video/token`, {
          method: 'POST',
          body: JSON.stringify({
            identity: session.user.id,
            room: roomId,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const jsonData = await data.json();

        return {
          props: {
            serverURL,
            clientURL,
            roomId,
            user: session.user,
            accessToken: jsonData.token,
          },
        };
      } catch (e) {
        console.error(e);
      }
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
