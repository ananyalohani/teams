import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
} from 'react';
import Video, { LocalVideoTrack } from 'twilio-video';
import io from 'socket.io-client';

import { formattedTimeString, getToken } from 'utils';
import { url } from 'lib';

const RoomCallContext = createContext();

const RoomCallContextProvider = ({ children }) => {
  const [token, setToken] = useState(); // fetch Twilio access token from server
  const [room, setRoom] = useState(null); // `room` object returned by Twilio
  const [roomId, setRoomId] = useState(null); // `roomId` string; set externally
  const [participants, setParticipants] = useState([]); // array of `participant` objects returned by Twilio
  const [usersList, setUsersList] = useState([]); // List of NextAuth `user` objects present in the room
  const [user, setUser] = useState(null); // `user` object returned by NextAuth; set externally
  const [userAudio, setUserAudio] = useState(true); // whether the user is muted or not
  const [userVideo, setUserVideo] = useState(true); // whether the user's video is on or not
  const [userBg, setUserBg] = useState(null); // set user's video background as 'virtual' or 'blur'
  const [displayPanel, setDisplayPanel] = useState('chat'); // toggle display of side panels
  const [chats, setChats] = useState([]); // keep track of all the chats
  const [screenTrack, setScreenTrack] = useState(null); // the screen track shared by a participant
  const socketRef = useRef(); // ref to the socket connection object
  const socketConnected = useRef(false); // set the state of connection of socket

  const handleCallEnd = useCallback(() => {
    // handle the case when a user ends the call
    socketRef.current.disconnect();
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

  useEffect(async () => {
    if (roomId && user) {
      const accessToken = await getToken(roomId, user.id);
      setToken(accessToken);
    }
  }, [roomId, user]);

  useEffect(() => {
    // connect to Twilio's video server when you receive a token
    if (token) {
      Video.connect(token, { name: roomId }).then(
        (room) => {
          setRoom(room);
        },
        (err) => {
          console.error(`Unable to connect to Room: ${err.message}`);
        }
      );
    }
  }, [token]);

  useEffect(() => {
    // connect to the socket
    if (roomId) {
      socketRef.current = io(url.server);
      socketConnected.current = true;
    }
  }, [roomId, user]);

  useEffect(() => {
    // add event listeners on the room for participants joining and leaving the room
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

  function joinRoom() {
    // join the room
    socketRef.current.emit('join-room', { roomId, user });

    // alert if the room is full
    socketRef.current.on('room-full', () => {
      alert('This room is full, please join a different room.');
    });

    socketRef.current.on('user-already-joined', () => {
      alert(
        "It looks like you're already in this room. You cannot join the same room twice."
      );
    });
  }

  function updateUsersList() {
    socketRef.current.on('updated-users-list', ({ usersInThisRoom }) => {
      setUsersList(usersInThisRoom);
    });
  }

  function leaveRoom() {
    // when a user leaves the room
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
    // toggle user's audio track
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
    // toggle user's video track
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

  function changeUserBackground(type) {
    setUserBg(type);
  }

  function sendMessage(e, message, userId, name, userColor) {
    // send a text message within the video call
    e.preventDefault();
    if (message === '') return;
    const msgData = {
      message,
      userId,
      name,
      userColor,
      time: formattedTimeString(),
    };
    addChat(msgData);

    socketRef.current.emit('send-message', {
      roomId,
      msgData,
    });
  }

  function receiveMessages() {
    // listen to incoming messages from sockets
    socketRef.current.on('receive-message', ({ msgData }) => {
      addChat(msgData);
    });
  }

  function addChat(message) {
    // add message to the list of chats
    setChats((chats) => [...chats, message]);
  }

  function participantConnected(participant) {
    // when a new participant gets connected
    setParticipants((prevParticipants) => [...prevParticipants, participant]);
  }

  function participantDisconnected(participant) {
    // when a participant gets disconnected
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  }

  function togglePanel(panel) {
    setDisplayPanel(panel);
  }

  async function toggleScreenShare() {
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

  const contextProps = {
    room,
    roomId,
    setRoomId,
    participants,
    user,
    setUser,
    displayPanel,
    togglePanel,
    chats,
    addChat,
    joinRoom,
    leaveRoom,
    socketConnected,
    sendMessage,
    receiveMessages,
    handleCallEnd,
    userAudio,
    userVideo,
    toggleUserAudio,
    toggleUserVideo,
    updateUsersList,
    usersList,
    userBg,
    changeUserBackground,
    toggleScreenShare,
    screenTrack,
    setScreenTrack,
  };

  return (
    <RoomCallContext.Provider value={contextProps}>
      {children}
    </RoomCallContext.Provider>
  );
};

const useRoomCallContext = () => useContext(RoomCallContext);

export { RoomCallContextProvider, useRoomCallContext };
