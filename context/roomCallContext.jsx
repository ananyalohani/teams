import { useRouter } from 'next/router';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  createContext,
} from 'react';
import Video from 'twilio-video';
import io from 'socket.io-client';

const RoomCallContext = createContext();

const RoomCallContextProvider = ({ children }) => {
  const [serverURL, setServerURL] = useState(null); // set this externally
  const [clientURL, setClientURL] = useState(null); // set this externally
  const [token, setToken] = useState(); // fetch Twilio access token from server
  const [room, setRoom] = useState(null); // `room` object returned by Twilio
  const [roomId, setRoomId] = useState(null); // `roomId` string; set externally
  const [participants, setParticipants] = useState([]); // array of `participant` objects returned by Twilio
  const [user, setUser] = useState(null); // `user` object returned by NextAuth; set externally
  const [userAudio, setUserAudio] = useState(true); // whether the user is muted or not
  const [userVideo, setUserVideo] = useState(true); // whether the user's video is on or not
  const [chatPanel, setChatPanel] = useState(true); // toggle display of chatPanel
  const [chats, setChats] = useState([]); // keep track of all the chats
  const router = useRouter(); // to handle when user redirects to a new page
  const socketRef = useRef(); // ref to the socket connection object
  const socketConnected = useRef(false);

  const handleLogout = useCallback(() => {
    socketRef.current.disconnect();
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

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener('pagehide', tidyUp);
      window.addEventListener('beforeunload', tidyUp);
      return () => {
        window.removeEventListener('pagehide', tidyUp);
        window.removeEventListener('beforeunload', tidyUp);
      };
    }
  }, [room, handleLogout]);

  useEffect(() => {
    // connect to Twilio's video server when you receive a token
    if (token) {
      Video.connect(token, { name: roomId }).then(
        (room) => {
          console.log(room);
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
    if (roomId && serverURL && user) {
      socketRef.current = io(serverURL);
      socketConnected.current = true;
    }
  }, [roomId, serverURL, user]);

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
    socketRef.current.emit('join-room', roomId);

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

  function leaveRoom() {
    // when a user leaves the room
    room.on('disconnected', (room) => {
      // Detach the local media elements
      room.localParticipant.tracks.forEach((publication) => {
        const attachedElements = publication.track.detach();
        attachedElements.forEach((element) => element.remove());
      });
    });
  }

  function toggleUserAudio() {
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

  function sendMessage(e, message, userId, name, userColor) {
    // send a text message within the video call
    e.preventDefault();
    if (message === '') return;
    const msgData = { message, userId, name, userColor };
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

  const contextProps = {
    serverURL,
    setServerURL,
    clientURL,
    setClientURL,
    setToken,
    room,
    roomId,
    setRoomId,
    participants,
    user,
    setUser,
    chatPanel,
    setChatPanel,
    chats,
    addChat,
    router,
    joinRoom,
    leaveRoom,
    socketConnected,
    sendMessage,
    receiveMessages,
    handleLogout,
    userAudio,
    userVideo,
    toggleUserAudio,
    toggleUserVideo,
  };

  return (
    <RoomCallContext.Provider value={contextProps}>
      {children}
    </RoomCallContext.Provider>
  );
};

const useRoomCallContext = () => useContext(RoomCallContext);

export { RoomCallContextProvider, useRoomCallContext };
