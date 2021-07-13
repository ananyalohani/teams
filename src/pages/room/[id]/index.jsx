import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import classNames from 'classnames';

import LayoutNoFooter from '@/components/Layout/LayoutNoFooter';
import Participant from '@/components/Participant/Participant';
import Header from '@/components/Header/Header';
import Head from '@/components/Head/Head';
import ChatPanel from '@/components/Panels/ChatPanel';
import CallFooter from '@/components/Footer/CallFooter';
import { useRoomContext } from '@/context/RoomContext';
import { useSocketContext } from '@/context/SocketContext';
import ParticipantsPanel from '@/components/Panels/ParticipantsPanel';
import BackgroundPanel from '@/components/Panels/BackgroundPanel';
import InfoPanel from '@/components/Panels/InfoPanel';
import SharedScreen from '@/components/SharedScreen/SharedScreen';
import getToken from '@/lib/utils/accessToken';
import Video from 'twilio-video';

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

export default function RoomCall({ roomId, user }) {
  const {
    room,
    participants,
    leaveRoom,
    screenTrack,
    handleCallEnd,
    setRoom,
    participantConnected,
    participantDisconnected,
    displayPanel,
  } = useRoomContext();

  const { setRoomId, setUser } = useSocketContext();
  const [isChromium, setIsChromium] = useState(false);

  useEffect(() => {
    setIsChromium(!!window.chrome);
  }, []);

  useEffect(() => {
    // fetch accessToken for twilio video
    setRoomId(roomId);
    setUser(user);
    getToken(roomId, user.id).then((token) => {
      Video.connect(token, {
        name: roomId,
        networkQuality: {
          local: 1,
          remote: 2,
        },
      }).then(
        (room) => {
          setRoom(room);
          room.localParticipant.setNetworkQualityConfiguration({
            local: 2,
            remote: 1,
          });
        },
        (err) => {
          console.error(`Unable to connect to Room: ${err.message}`);
        }
      );
    });
  }, []);

  useEffect(() => {
    // add event listeners on the room for participants joining and leaving the room
    leaveRoom();
    if (room) {
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    }

    return () => {
      room?.off('participantConnected', participantConnected);
      room?.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  useEffect(() => {
    const cleanup = (event) => {
      // cleanup function for call end
      if (event.persisted) {
        return;
      }
      if (room) {
        handleCallEnd();
      }
    };

    if (room) {
      window.addEventListener('pagehide', cleanup);
      window.addEventListener('beforeunload', cleanup);
      return () => {
        window.removeEventListener('pagehide', cleanup);
        window.removeEventListener('beforeunload', cleanup);
      };
    }
  }, [room, handleCallEnd]);

  const remoteParticipants = participants?.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <LayoutNoFooter title={`Call - ${roomId}`}>
      <div className='flex flex-col' style={{ height: 'calc(100vh - 5rem)' }}>
        <div className='flex flex-row h-full flex-1'>
          <div className='bg-gray-875 flex-1 flex items-center justify-center'>
            <div
              id='video-grid'
              className={classNames(
                'flex flex-wrap justify-center p-5 h-full w-full items-center',
                {
                  flex: !Boolean(displayPanel),
                  hidden: Boolean(displayPanel),
                  'md:flex': Boolean(displayPanel),
                }
              )}
            >
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
            </div>
          </div>
          <ChatPanel />
          <ParticipantsPanel />
          <InfoPanel />
          {isChromium && <BackgroundPanel />}
        </div>
        <CallFooter />
      </div>
    </LayoutNoFooter>
  );
}
