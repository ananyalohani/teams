import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';

import Participant from '@/components/Participant/Participant';
import Header from '@/components/Header/Header';
import Head from '@/components/Head/Head';
import ChatPanel from '@/components/Panels/ChatPanel';
import CallFooter from '@/components/Footer/CallFooter';
import { useRoomContext } from '@/context/RoomContext';
import ParticipantsPanel from '@/components/Panels/ParticipantsPanel';
import BackgroundPanel from '@/components/Panels/BackgroundPanel';
import InfoPanel from '@/components/Panels/InfoPanel';
import SharedScreen from '@/components/SharedScreen/SharedScreen';

export default function RoomCall({ roomId, user }) {
  const { room, participants, leaveRoom, setRoomId, setUser, screenTrack } =
    useRoomContext();

  useEffect(() => {
    setRoomId(roomId);
    setUser(user);
  }, []);

  useEffect(() => {
    leaveRoom();
  }, [room]);

  const remoteParticipants = participants?.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <>
      <Head title={`Call - ${roomId}`} />
      <Header />
      <div className='flex flex-col' style={{ height: 'calc(100vh - 5rem)' }}>
        <div className='flex flex-row h-full flex-1'>
          <div className='bg-gray-875 flex-1 flex items-center justify-center'>
            <div id='video-grid' className='flex flex-wrap justify-center p-5'>
              {screenTrack ? (
                <SharedScreen />
              ) : (
                room && (
                  <>
                    <Participant
                      key={room.localParticipant.sid}
                      participant={room.localParticipant}
                      me={true}
                    />
                    {remoteParticipants}
                  </>
                )
              )}
              {/* {room && (
                <Participant
                  key={room.localParticipant.sid}
                  participant={room.localParticipant}
                  me={true}
                />
              )}
              {screenTrack && <SharedScreen />} */}
            </div>
          </div>
          <ChatPanel />
          <ParticipantsPanel />
          <InfoPanel />
          <BackgroundPanel />
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
