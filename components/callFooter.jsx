import React, { useState } from 'react';
import {
  IoMicSharp,
  IoMicOffSharp,
  IoVideocamOff,
  IoVideocam,
  IoCall,
  IoChatbox,
} from 'react-icons/io5';
import { MdScreenShare } from 'react-icons/md';
import { useCallContext } from '@/context/callContext';

export default function CallFooter() {
  const { userAudio: audio, userVideo: video, toggleStream } = useCallContext();

  return (
    <footer className='h-20 absolute bottom-0 left-0 w-full bg-gray-800 flex flex-row items-center justify-center space-x-10 border-t border-gray-600'>
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
        <IoCall className='call-icon' />
      </div>
    </footer>
  );
}
