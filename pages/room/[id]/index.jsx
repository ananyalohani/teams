import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import Participant from '@/components/participant';
import Header from '@/components/header';
import Head from '@/components/head';
import ChatPanel from '@/components/chatPanel';
import CallFooter from '@/components/callFooter';
import { useRoomCallContext } from '@/context/roomCallContext';
import dynamic from 'next/dynamic';
import ParticipantsPanel from '@/components/participantsPanel';
import MeetingDetailsPanel from '@/components/meetingDetailsPanel';
import LocalParticipant from '@/components/localParticipant';
import SharedScreen from '@/components/sharedScreen';
import { url } from 'lib';
// const ExcalidrawComp = dynamic(() => import('@excalidraw/excalidraw'));

export default function RoomCall({ roomId, user, accessToken }) {
  const {
    room,
    participants,
    joinRoom,
    leaveRoom,
    setRoomId,
    setUser,
    socketConnected,
    receiveMessages,
    updateUsersList,
    changeUserBackground,
    screenTrack,
  } = useRoomCallContext();

  useEffect(() => {
    setRoomId(roomId);
    setUser(user);
  }, []);

  useEffect(() => {
    if (socketConnected.current) {
      joinRoom();
      updateUsersList();
      leaveRoom();
      receiveMessages();
      // changeUserBackground('virtual');
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
                <LocalParticipant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                />
              )}
              {remoteParticipants}
              {screenTrack && <SharedScreen />}
            </div>
          </div>
          <ChatPanel />
          <ParticipantsPanel />
          <MeetingDetailsPanel />
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
