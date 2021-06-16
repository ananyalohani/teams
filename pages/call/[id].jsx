import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Header from '../../components/header';
import CallFooter from '../../components/callFooter';

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  });

  return (
    <video className='h-2/5 w-1/2 -scale-x-1' playsInline autoPlay ref={ref} />
  );
};

export default function Call({ roomId }) {
  const [peers, setPeers] = useState([]); // keep track of all the peer videos in the room
  const [chats, setChats] = useState([]); // keep track of all the chats
  const [message, setMessage] = useState('');
  const socketRef = useRef(); // ref to the socket connection object
  const userVideo = useRef(); // ref to the user's video
  const peersRef = useRef([]); // ref to all the peer connection objects

  useEffect(() => {
    console.log(socketRef);
  }, [socketRef, socketRef.current]);

  useEffect(() => {
    socketRef.current = io('https://ws.msft.lohani.dev/');
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
      })
      .finally(() => {});
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
    //
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

  const sendMessage = (e) => {
    e.preventDefault();
    if (message === '') return;
    addChat({ message, userId: socketRef.current.id });

    socketRef.current.emit('send-message', {
      msgData: { message, userId: socketRef.current.id },
      roomId,
    });
    setMessage('');
  };

  function addChat(message) {
    setChats((chats) => [...chats, message]);
  }

  return (
    <>
      <Head>
        <title>Call - {roomId}</title>
      </Head>
      <div className='h-screen'>
        <Header />
        {/* CHAT PANEL */}
        <div
          id='chat-panel'
          className='flex flex-col bg-white w-80 absolute top-24 right-0 bottom-20 border-l-2'
        >
          <div className='bg-indigo-100 w-full p-5'>
            <div className='flex flex-row space-x-2'>
              <p className='font-semibold text-indigo-600'>Meeting ID:</p>
              <p>{'xyz123'}</p>
            </div>
            <div className='flex flex-row space-x-2'>
              <p className='font-semibold text-indigo-600'>Participants:</p>
              <p>{4}</p>
            </div>
          </div>
          <div id='chat-window' className='flex-1'>
            {chats.map((msgData, idx) => (
              <div key={idx}>
                <p>{msgData.userId}</p>
                <p>{msgData.message}</p>
              </div>
            ))}
          </div>
          <form
            onSubmit={sendMessage}
            className='flex flex-row justify-evenly my-2'
          >
            <input
              type='text'
              className='border-2 bg-gray-100 rounded w-56 text-base px-3 py-2'
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button type='submit' className='btn-light'>
              Send
            </button>
          </form>
        </div>
        {/* VIDEO GRID */}
        <div
          id='video-grid'
          className='bg-gray-100 absolute left-0 bottom-20 top-24 right-80 flex flex-wrap'
        >
          <video
            className='h-2/5 w-1/2 -scale-y-1'
            muted
            playsInline
            autoPlay
            ref={userVideo}
          />
          {peers.map((p) => {
            return <Video key={p.peerId} peer={p.peer} />;
          })}
        </div>
        <CallFooter />
      </div>
    </>
  );
}

Call.getInitialProps = ({ req, query: { id } }) => {
  return {
    roomId: id,
  };
};
