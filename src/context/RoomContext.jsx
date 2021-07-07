import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react';
import Video, { LocalVideoTrack } from 'twilio-video';

import { getToken } from '@/utils';

const RoomContext = createContext();

const RoomContextProvider = ({ children }) => {
  const [token, setToken] = useState(); // fetch Twilio access token from server
  const [room, setRoom] = useState(null); // `room` object returned by Twilio
  const [roomId, setRoomId] = useState(null); // `roomId` string; set externally
  const [participants, setParticipants] = useState([]); // array of `participant` objects returned by Twilio
  const [user, setUser] = useState(null); // `user` object returned by NextAuth; set externally
  const [userAudio, setUserAudio] = useState(true); // whether the user is muted or not
  const [userVideo, setUserVideo] = useState(true); // whether the user's video is on or not
  const [displayPanel, setDisplayPanel] = useState('chat'); // toggle display of side panels
  const [screenTrack, setScreenTrack] = useState(null); // the screen track shared by a participant
  const [isChatSession, setIsChatSession] = useState(false);
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

  useEffect(() => {
    const cleanup = (event) => {
      // * cleanup function for call end
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

  useEffect(async () => {
    // * fetch accessToken for twilio video
    if (roomId && user && !isChatSession) {
      const accessToken = await getToken(roomId, user.id);
      setToken(accessToken);
    }
  }, [roomId, user, isChatSession]);

  useEffect(() => {
    // * connect to Twilio's video server when you receive a token
    if (token) {
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
    }
  }, [token]);

  useEffect(() => {
    // * add event listeners on the room for participants joining and leaving the room
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

  async function toggleScreenShare() {
    // * toggle the user's screen
    if (!screenTrack) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const userScreen = new LocalVideoTrack(stream.getTracks()[0]);
        setScreenTrack(userScreen);
        room.localParticipant.publishTrack(userScreen);
        userScreen.mediaStreamTrack.onended = () => {
          toggleScreenShare();
        };
      } catch (e) {
        console.error(e);
      }
    } else {
      room.localParticipant.unpublishTrack(screenTrack);
      screenTrack.stop();
      setScreenTrack(null);
    }
  }

  function setNetworkQualityStats(networkQualityLevel, networkQualityStats) {
    // Print in console the networkQualityLevel using bars

    const levels = {
      1: '▃',
      2: '▃▄',
      3: '▃▄▅',
      4: '▃▄▅▆',
      5: '▃▄▅▆▇',
    };

    if (roomId && networkQualityStats) {
      fetch('/api/network-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          userId: user.id,
          audioRecv: networkQualityStats.audio.recv,
          audioSend: networkQualityStats.audio.send,
          videoRecv: networkQualityStats.video.recv,
          videoSend: networkQualityStats.video.send,
        }),
      });
    }

    if (networkQualityLevel) setUserNetQual(levels[networkQualityLevel]);
    else setUserNetQual(null);

    return {
      networkQualityLevel: levels[networkQualityLevel],
      networkQualityStats,
    };
  }

  const contextProps = {
    room,
    roomId,
    setRoomId,
    participants,
    user,
    setUser,
    displayPanel,
    togglePanel,
    leaveRoom,
    handleCallEnd,
    userAudio,
    userVideo,
    toggleUserAudio,
    toggleUserVideo,
    toggleScreenShare,
    screenTrack,
    setScreenTrack,
    setIsChatSession,
    userNetQual,
    setNetworkQualityStats,
  };

  return (
    <RoomContext.Provider value={contextProps}>{children}</RoomContext.Provider>
  );
};

const useRoomContext = () => useContext(RoomContext);

export { RoomContextProvider, useRoomContext };
