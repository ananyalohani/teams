import React, { useState } from 'react';
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoCall,
  IoChatboxEllipses,
  IoPeople,
  IoInformationCircle,
} from 'react-icons/io5';
import { MdScreenShare } from 'react-icons/md';
import Link from 'next/link';

import { useCallContext } from '@/context/callContext';

export default function CallFooter() {
  const {
    userAudio: audio,
    userVideo: video,
    toggleStream,
    toggleChatPanel,
  } = useCallContext();

  return (
    <footer className='h-20 w-full bg-gray-800 flex flex-row items-center justify-center space-x-10 border-t border-gray-600'>
      <div className='call-icon-wrapper '>
        <IoInformationCircle className='call-icon' />
      </div>
      <div
        className={`call-icon-wrapper ${audio ? '' : 'active'}`}
        onClick={() => {
          toggleStream('audio');
        }}
      >
        {audio ? (
          <IoMicSharp className='call-icon' />
        ) : (
          <IoMicOffSharp className='call-icon' />
        )}
      </div>

      <div
        className={`call-icon-wrapper ${video ? '' : 'active'}`}
        onClick={() => {
          toggleStream('video');
        }}
      >
        {video ? (
          <IoVideocam className='call-icon' />
        ) : (
          <IoVideocamOff className='call-icon' />
        )}
      </div>

      <div className='call-icon-wrapper phn'>
        <Link href='/home'>
          <IoCall className='call-icon' />
        </Link>
      </div>
      <div className='call-icon-wrapper' onClick={toggleChatPanel}>
        <IoChatboxEllipses className='call-icon' />
      </div>
      <div className='call-icon-wrapper '>
        <IoPeople className='call-icon' />
      </div>
    </footer>
  );
}
