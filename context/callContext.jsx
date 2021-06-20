import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

const CallContext = createContext();

const CallContextProvider = ({ children }) => {
  const [serverURL, setServerURL] = useState(null);
  const [clientURL, setClientURL] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [peers, setPeers] = useState([]); // keep track of all the peer videos in the room
  const [chats, setChats] = useState([]); // keep track of all the chats
  const [userStream, setUserStream] = useState('not initialised'); // users stream received from getUserMedia()
  const [userAudio, setUserAudio] = useState(true); // whether the user is muted or not
  const [userVideo, setUserVideo] = useState(true); // whether the user's video is on or not
  const joinedRoomRef = useRef(false); // whether the user has joined the room
  const socketRef = useRef(); // ref to the socket connection object
  const userVideoRef = useRef(); // ref to the user's video element
  const peersRef = useRef([]); // ref to all the peer connection objects

  useEffect(() => {
    async function getUserMedia() {
      // get user's audio and video
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            height: window.innerHeight / 2,
            width: window.innerWidth / 2,
          },
          audio: true,
        });

        setUserStream(stream);
      } catch (e) {
        setUserStream(null);
        alert('Please allow access to your video and audio');
        console.error(e);
      }
    }

    console.log(roomId);

    if (roomId && serverURL) {
      socketRef.current = io(serverURL);
      getUserMedia();
    }
  }, [roomId, serverURL]);

  function joinRoom(stream) {
    // set user stream
    userVideoRef.current.srcObject = stream;

    // join the room
    socketRef.current.emit('join-room', roomId);

    // create peer connections with users who are currently in the room
    socketRef.current.on('all-users', (users) => {
      const peers = [];
      users.forEach((userId) => {
        let peer;
        // if (!checkForDuplicates(peersRef.current, 'peerId', userId)) {
        peer = createPeer(userId, socketRef.current.id, stream);
        peersRef.current.push({
          peerId: userId,
          peer,
          peerStream: stream,
        });
        // }

        // if (!checkForDuplicates(peers, 'peerId', userId)) {
        peers.push({
          peerId: userId,
          peer,
          peerStream: stream,
        });
        // }
      });
      setPeers(peers);
    });

    // add a peer connection when a user joins the room
    socketRef.current.on('user-joined', (payload) => {
      // if (!checkForDuplicates(peersRef.current, 'peerId', payload.callerId)) {
      const peer = addPeer(payload.signal, payload.callerId, stream);
      peersRef.current.push({
        peerId: payload.callerId,
        peer,
        peerStream: stream,
      });
      const peerObj = { peerId: payload.callerId, peer, peerStream: stream };
      setPeers((users) => [...users, peerObj]);
      // }
    });

    // signal to all other peers that you have joined the room
    socketRef.current.on('receiving-returned-signal', (payload) => {
      const item = peersRef.current.find((p) => p.peerId === payload.id);
      item.peer.signal(payload.signal);
    });
  }

  function leaveRoom() {
    // delete the peer when the user leaves the call
    socketRef.current.on('user-left', (id) => {
      const peerObj = peersRef.current.find((p) => p.peerId === id);
      peerObj?.peer.destroy();
      const peers = peersRef.current.filter((p) => p.peerId !== id);
      peersRef.current = peers;
      setPeers(peers);
    });
  }

  function createPeer(userToSignal, callerId, stream) {
    // create a new peer connection between current user and userToSignal
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    // trigger a socket event to send a signal
    peer.on('signal', (signal) => {
      socketRef.current.emit('sending-signal', {
        userToSignal,
        callerId,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    // add the current user to the peer's list of peers
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning-signal', { signal, callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function sendMessage(e, message) {
    // send a text message within the video call
    e.preventDefault();
    if (message === '') return;
    addChat({ message, userId: socketRef.current.id });

    socketRef.current.emit('send-message', {
      msgData: { message, userId: socketRef.current.id },
      roomId,
    });
  }

  function receiveMessages() {
    // listen to incoming messages from sockets
    socketRef.current.on('receive-message', (msgData) => {
      addChat(msgData);
    });
  }

  function addChat(message) {
    // add message to the list of chats
    setChats((chats) => [...chats, message]);
  }

  function toggleStream(streamType) {
    // toggle user's audio or video
    if (streamType === 'video') setUserVideo(!userVideo);
    if (streamType === 'audio') setUserAudio(!userAudio);

    peers.forEach((p) => {
      // toggle the stream's enabled property for all the user's peers
      const peerStream =
        streamType === 'video'
          ? p.peer.streams[0].getVideoTracks()[0]
          : p.peer.streams[0].getAudioTracks()[0];
      peerStream.enabled = !peerStream.enabled;
    });
  }

  function connectPeerStream(peer, ref) {
    peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }

  const contextProps = {
    roomId,
    setRoomId,
    serverURL,
    setServerURL,
    clientURL,
    setClientURL,
    peers,
    chats,
    userStream,
    userAudio,
    userVideo,
    joinedRoomRef,
    userVideoRef,
    joinRoom,
    leaveRoom,
    sendMessage,
    receiveMessages,
    toggleStream,
    connectPeerStream,
  };

  return (
    <CallContext.Provider value={contextProps}>{children}</CallContext.Provider>
  );
};

function useCallContext() {
  return useContext(CallContext);
}

export { CallContextProvider, useCallContext };
