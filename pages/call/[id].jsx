import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import CallFooter from '@/components/callFooter';
import Header from '@/components/header';
import Head from '@/components/head';
import Video from '@/components/video';
import ChatPanel from '@/components/chatPanel';

export default function Call({ serverURL, clientURL, roomId }) {
  const [peers, setPeers] = useState([]); // keep track of all the peer videos in the room
  const [chats, setChats] = useState([]); // keep track of all the chats
  const socketRef = useRef(); // ref to the socket connection object
  const userVideo = useRef(); // ref to the user's video
  const peersRef = useRef([]); // ref to all the peer connection objects

  useEffect(() => {
    socketRef.current = io(serverURL);
    // get access to the user's mic and webcam
    navigator.mediaDevices
      .getUserMedia({
        video: {
          height: window.innerHeight / 2,
          width: window.innerWidth / 2,
        },
        audio: true,
      })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        // join the room
        socketRef.current.emit('join-room', roomId);

        // create peer connections with users who are currently in the room
        socketRef.current.on('all-users', (users) => {
          const peers = [];
          users.forEach((userId) => {
            const peer = createPeer(userId, socketRef.current.id, stream);
            peersRef.current.push({
              peerId: userId,
              peer,
            });
            peers.push({
              peerId: userId,
              peer,
            });
          });
          setPeers(peers);
        });

        // add a peer connection when a user joins the room
        socketRef.current.on('user-joined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerId, stream);
          peersRef.current.push({ peerId: payload.callerId, peer });
          const peerObj = { peerId: payload.callerId, peer };
          setPeers((users) => [...users, peerObj]);
        });

        // signal to all other peers that you have joined the room
        socketRef.current.on('receiving-returned-signal', (payload) => {
          const item = peersRef.current.find((p) => p.peerId === payload.id);
          item.peer.signal(payload.signal);
        });

        // delete the peer when the user leaves the call
        socketRef.current.on('user-left', (id) => {
          const peerObj = peersRef.current.find((p) => p.peerId === id);
          peerObj?.peer.destroy();
          const peers = peersRef.current.filter((p) => p.peerId !== id);
          peersRef.current = peers;
          setPeers(peers);
        });

        socketRef.current.on('receive-message', (msgData) => {
          console.log('receiving message');
          addChat(msgData);
        });
      });
  }, []);

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
    e.preventDefault();
    if (message === '') return;
    addChat({ message, userId: socketRef.current.id });

    socketRef.current.emit('send-message', {
      msgData: { message, userId: socketRef.current.id },
      roomId,
    });
  }

  function addChat(message) {
    setChats((chats) => [...chats, message]);
  }

  return (
    <>
      <Head title={`Call - ${roomId}`} />
      <div className='h-screen'>
        <Header />
        <ChatPanel
          clientURL={clientURL}
          roomId={roomId}
          peers={peers}
          sendMessage={sendMessage}
          chats={chats}
        />
        <div
          id='video-grid'
          className='bg-gray-900 absolute left-0 bottom-20 top-24 right-0 sm:right-80 flex items-center justify-center'
        >
          <div className='flex flex-wrap justify-center'>
            <Video audio={false} ref={userVideo} />
            {/* <div className='w-56 h-32 sm:h-72 sm:w-100 rounded bg-gray-800 m-2'></div>
            <div className='w-56 h-32 sm:h-72 sm:w-100 rounded bg-gray-800 m-2'></div>
            <div className='w-56 h-32 sm:h-72 sm:w-100 rounded bg-gray-800 m-2'></div> */}
            {peers.map((p) => {
              return <Video key={p.peerId} peer={p.peer} />;
            })}
          </div>
        </div>
        <CallFooter />
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query: { id } }) {
  const serverURL = process.env.SERVER_URL;
  const clientURL = process.env.CLIENT_URL;

  return {
    props: {
      serverURL,
      clientURL,
      roomId: id,
    },
  };
}
