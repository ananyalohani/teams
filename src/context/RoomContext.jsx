import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';

import { useSocketContext } from '@/context/SocketContext';

const RoomContext = createContext();

const RoomContextProvider = ({ children }) => {
  // const [token, setToken] = useState(); // fetch Twilio access token from server
  const { roomId, user } = useSocketContext(); // get roomId and NextAuth user object from RoomContext
  const [room, setRoom] = useState(null); // `room` object returned by Twilio
  // const [roomId, setRoomId] = useState(null); // `roomId` string; set externally
  const [participants, setParticipants] = useState([]); // array of `participant` objects returned by Twilio
  // const [user, setUser] = useState(null); // `user` object returned by NextAuth; set externally
  const [userAudio, setUserAudio] = useState(true); // whether the user is muted or not
  const [userVideo, setUserVideo] = useState(true); // whether the user's video is on or not
  const [displayPanel, setDisplayPanel] = useState('chat'); // toggle display of side panels
  const [screenTrack, setScreenTrack] = useState(null); // the screen track shared by a participant
  const [userNetQual, setUserNetQual] = useState(null);

  const handleCallEnd = useCallback(() => {
    // * handle the case when a user ends the call
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      if (screenTrack) {
        screenTrack.stop();
        setScreenTrack(null);
      }
      return null;
    });
  }, []);

  function leaveRoom() {
    // * do this when a user leaves the room
    if (!room || !room.localParticipant) return;
    room.on('disconnected', (room) => {
      // Detach the local media elements
      room.localParticipant.tracks.forEach((publication) => {
        const attachedElements = publication.track.detach();
        attachedElements.forEach((element) => element.remove());
      });
    });
  }

  function toggleUserAudio() {
    // * toggle user's audio track
    if (!room || !room.localParticipant) return;
    if (userAudio) {
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.disable();
      });
    } else {
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.enable();
      });
    }
    setUserAudio(!userAudio);
  }

  function toggleUserVideo() {
    // * toggle user's video track
    if (!room || !room.localParticipant) return;
    if (userVideo) {
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.disable();
      });
    } else {
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.enable();
      });
    }
    setUserVideo(!userVideo);
  }

  function participantConnected(participant) {
    // * when a new participant gets connected
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  }

  function participantDisconnected(participant) {
    // * when a participant gets disconnected
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  }

  const togglePanel = (type) => {
    // * toggle the type of side panel to display
    if (displayPanel === type) setDisplayPanel('');
    else setDisplayPanel(type);
  };

  const contextProps = {
    room,
    setRoom,
    // roomId,
    // setRoomId,
    participants,
    // user,
    // setUser,
    displayPanel,
    togglePanel,
    leaveRoom,
    handleCallEnd,
    userAudio,
    userVideo,
    toggleUserAudio,
    toggleUserVideo,
    screenTrack,
    setScreenTrack,
    userNetQual,
    setUserNetQual,
    participantConnected,
    participantDisconnected,
  };

  return (
    <RoomContext.Provider value={contextProps}>{children}</RoomContext.Provider>
  );
};

const useRoomContext = () => useContext(RoomContext);

export { RoomContextProvider, useRoomContext };
