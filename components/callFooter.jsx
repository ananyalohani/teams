import React, { useState, useEffect } from 'react';
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

import { useRoomCallContext } from '@/context/roomCallContext';

export default function CallFooter() {
  const {
    userAudio: audio,
    userVideo: video,
    toggleUserAudio,
    toggleUserVideo,
    togglePanel,
    displayPanel,
  } = useRoomCallContext();

  const [anchor, setAnchor] = useState(null); // anchor for the popper
  const open = Boolean(anchor); // open state of popper

  // useEffect(() => {
  //   console.log('audio', audio);
  //   console.log('video', video);
  // }, [audio, video]);

  const handleClick = (e) => {
    setAnchor(anchor ? null : e.currentTarget);
  };
  const handleClickAway = () => {
    setAnchor(null);
  };

  return (
    <footer className='h-20 w-full bg-gray-900 flex flex-row items-center justify-around border-t border-gray-950'>
      <div className='flex flex-row space-x-5 sm:space-x-8'>
        <div
          className={`call-icon-wrapper ${
            displayPanel === 'meeting-details' ? 'active' : ''
          }`}
          onClick={() => togglePanel('meeting-details')}
        >
          <IoInformationCircle className='call-icon' />
        </div>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
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
        <div className='call-icon-wrapper '>
          <MdScreenShare className='call-icon' />
        </div>
        <Link href='/home'>
          <div className='call-icon-wrapper phn'>
            <IoCall className='call-icon' />
          </div>
        </Link>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
        <div
          className={`call-icon-wrapper ${
            displayPanel === 'chat' ? 'active' : ''
          }`}
          onClick={() => togglePanel('chat')}
        >
          <IoChatboxEllipses className='call-icon' />
        </div>
        <div
          className={`call-icon-wrapper ${
            displayPanel === 'participants' ? 'active' : ''
          }`}
          onClick={() => togglePanel('participants')}
        >
          <IoPeople className='call-icon' />
        </div>
      </div>
    </footer>
  );
}
