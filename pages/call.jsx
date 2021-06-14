import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import Header from '../components/header';
import CallFooter from '../components/callFooter';
import ChatPanel from '../components/chatPanel';
import useSocket from '../hooks/useSocket';

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
  const socketRef = useRef(); // ref to the socket connection object
  const userVideo = useRef(); // ref to the user's video
  const peersRef = useRef([]); // ref to all the peer connection objects

  useEffect(() => {
    socketRef.current = io();
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

  return (
    <>
      <Head></Head>
      <div className='h-screen'>
        <Header />
        <ChatPanel />
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
