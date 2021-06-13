import * as React from 'react';
import Header from '../components/header';
import CallFooter from '../components/callFooter';
import ChatPanel from '../components/chatPanel';
import VideoGrid from '../components/videoGrid';

export default function Call() {
  return (
    <div className='h-screen'>
      <Header />
      <ChatPanel />
      <VideoGrid />
      <CallFooter />
    </div>
  );
}
