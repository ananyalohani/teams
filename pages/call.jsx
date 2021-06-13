import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Head from 'next/head';
import CallFooter from '../components/callFooter';
import ChatPanel from '../components/chatPanel';
import useSocket from '../hooks/useSocket';
import Peer from 'simple-peer';

export default function Call({ roomId }) {
  const [message, setMessage] = useState('');
  const socket = useSocket();

  // useEffect(() => {
  //   console.log(roomId);
  // }, [roomId]);

  useEffect(() => {
    socket?.emit('join-room', roomId, 10);
    socket?.on('user-connected', (userId) => {
      console.log('User Connected', userId);
    });
  }, [socket]);

  return (
    <>
      <Head></Head>
      <div className='h-screen'>
        <Header />
        <ChatPanel />
        <div
          id='video-grid'
          className='bg-gray-100 absolute left-0 bottom-20 top-24 right-80'
        >
          <div>{message}</div>
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
