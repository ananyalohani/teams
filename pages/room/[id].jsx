import React, { useState, useEffect, useCallback } from 'react';
import { getSession } from 'next-auth/client';
import Video from 'twilio-video';
import Participant from '@/components/participant';

export default function RoomCall({
  serverURL,
  clientURL,
  roomId,
  user,
  accessToken,
}) {
  const [participants, setParticipants] = useState([]);
  const [room, setRoom] = useState();

  const participantConnected = (participant) => {
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  };

  const participantDisconnected = (participant) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  };

  useEffect(() => {
    if (accessToken) {
      Video.connect(accessToken, { name: roomId }).then(
        (room) => {
          console.log(room);
          setRoom(room);
        },
        (err) => {
          console.error(`Unable to connect to Room: ${err.message}`);
        }
      );
    }
  }, [accessToken]);

  useEffect(() => {
    if (room) {
      console.dir(room);
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      room.participants.forEach(participantConnected);
    }

    return () => {
      room?.off('participantConnected', participantConnected);
      room?.off('participantDisconnected', participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  return (
    <div className='room'>
      <h2>Room: {roomId}</h2>
      <button onClick={handleLogout}>Log out</button>
      <div className='local-participant'>
        {room ?? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
            muted={true}
          />
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className='remote-participants'>{remoteParticipants}</div>
    </div>
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
            accessToken: await jsonData.token,
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
