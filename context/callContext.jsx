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
  const [serverURL, setServerURL] = useState(null); // set this externally
  const [clientURL, setClientURL] = useState(null); // set this externally
  const [roomId, setRoomId] = useState(null); // set this externally
  const [chatPanel, setChatPanel] = useState(true); // to display/hide the chat panel
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

    if (roomId && serverURL) {
      socketRef.current = io(serverURL);
      getUserMedia();
    }
  }, [roomId, serverURL]);

  useEffect(() => {
    // every time a new peer joins the call, check user's audio and video
    // state and update it accordingly for the peer
    if (socketRef.current && peers.length) {
      peers.forEach((p) => {
        const audioStream = p.peer.streams[0].getAudioTracks()[0];
        const videoStream = p.peer.streams[0].getVideoTracks()[0];
        audioStream.enabled = userAudio;
        videoStream.enabled = userVideo;
      });
    }
  }, [peers]);

  function joinRoom(stream) {
    // set user stream
    userVideoRef.current.srcObject = stream;

    // join the room
    socketRef.current.emit('join-room', roomId);

    // alert if the room is full
    socketRef.current.on('room-full', () => {
      alert('This room is full, please join a different room.');
    });

    // create peer connections with users who are currently in the room
    socketRef.current.on('all-users', (users) => {
      const newPeers = [];
      users.forEach((userId) => {
        const item = peersRef.current.find(
          (p) => p.peerId === payload.callerId
        );
        if (!item) {
          const peer = createPeer(userId, socketRef.current.id, stream);
          peersRef.current.push({
            peerId: userId,
            peer,
          });

          const peerItem = newPeers.find((p) => p.peerId === payload.callerId);
          if (!peerItem) {
            newPeers.push({
              peerId: userId,
              peer,
            });
          }
        }
      });
      setPeers(newPeers);
    });

    // add a peer connection when a user joins the room
    socketRef.current.on('user-joined', (payload) => {
      const item = peersRef.current.find((p) => p.peerId === payload.callerId);
      if (!item) {
        const peer = addPeer(payload.signal, payload.callerId, stream);
        peersRef.current.push({
          peerId: payload.callerId,
          peer,
        });

        const peerObj = { peerId: payload.callerId, peer };
        const peerItem = peers.find((p) => (p.peerId = peerObj.peerId));
        if (!peerItem) setPeers((oldPeers) => [...oldPeers, peerObj]);
      }
    });

    // signal to all other peers that you have joined the room
    socketRef.current.on('receiving-returned-signal', (payload) => {
      const item = peersRef.current.find((p) => p.peerId === payload.id);
      item.peer.signal(payload.signal);
    });
  }

  function leaveRoom() {
    socketRef.current.on('user-left', (id) => {
      // which peer left
      const peerObj = peersRef.current.find((p) => p.peerId === id);

      // done so that the user is not locked into current state when peer disconnects
      const videoStream = peerObj.peer.streams[0].getVideoTracks()[0];
      const audioStream = peerObj.peer.streams[0].getAudioTracks()[0];

      videoStream.enabled = true;
      audioStream.enabled = true;

      // destroy the peer when the user leaves the call
      peerObj.peer.destroy();

      // remove the peer from peers and peersRef
      let newPeers = peersRef.current.filter((p) => p.peerId !== id);
      peersRef.current = newPeers;

      newPeers = peers.filter((p) => p.peerId !== id);
      setPeers(newPeers);
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

  function toggleChatPanel() {
    setChatPanel(!chatPanel);
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
    chatPanel,
    toggleChatPanel,
  };

  return (
    <CallContext.Provider value={contextProps}>{children}</CallContext.Provider>
  );
};

const useCallContext = () => useContext(CallContext);

export { CallContextProvider, useCallContext };
