import React, { useEffect } from 'react';
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
import { useRoomCallContext } from '@/context/roomCallContext';

export default function CallFooter() {
  const {
    userAudio: audio,
    userVideo: video,
    toggleUserAudio,
    toggleUserVideo,
    toggleChatPanel,
  } = useRoomCallContext();

  useEffect(() => {
    console.log('audio', audio);
    console.log('video', video);
  }, [audio, video]);

  return (
    <footer className='h-20 w-full bg-gray-900 flex flex-row items-center justify-center space-x-5 sm:space-x-10 border-t border-gray-950'>
      <div className='call-icon-wrapper '>
        <IoInformationCircle className='call-icon' />
      </div>
      <div
        className={`call-icon-wrapper ${audio ? '' : 'active'}`}
        onClick={toggleUserAudio}
      >
        {audio ? (
          <IoMicSharp className='call-icon' />
        ) : (
          <IoMicOffSharp className='call-icon' />
        )}
      </div>

      <div
        className={`call-icon-wrapper ${video ? '' : 'active'}`}
        onClick={toggleUserVideo}
      >
        {video ? (
          <IoVideocam className='call-icon' />
        ) : (
          <IoVideocamOff className='call-icon' />
        )}
      </div>

      <Link href='/home'>
        <div className='call-icon-wrapper phn'>
          <IoCall className='call-icon' />
        </div>
      </Link>
      <div className='call-icon-wrapper' onClick={toggleChatPanel}>
        <IoChatboxEllipses className='call-icon' />
      </div>
      <div className='call-icon-wrapper '>
        <IoPeople className='call-icon' />
      </div>
    </footer>
  );
}
