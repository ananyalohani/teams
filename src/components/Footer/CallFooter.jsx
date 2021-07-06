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
import { MdPresentToAll } from 'react-icons/md';
import Link from 'next/link';
import { BackgroundIcon } from '@/components/CustomIcons/CustomIcons';

import { useRoomContext } from '@/context/RoomContext';

// ! USE CLASSNAMES LIBRARY TO SET CLASSNAME 'active' and 'disabled'

export default function CallFooter() {
  const {
    userAudio: audio,
    userVideo: video,
    toggleUserAudio,
    toggleUserVideo,
    togglePanel,
    displayPanel,
    toggleScreenShare,
    room,
  } = useRoomContext();

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (room) setDisabled(false);
  }, [room]);

  return (
    <footer className='h-20 w-full bg-gray-900 flex flex-row items-center justify-around border-t border-gray-950'>
      <div className='flex flex-row space-x-5 sm:space-x-8'>
        <button
          disabled={disabled}
          className={`call-icon-wrapper ${
            displayPanel === 'meeting-details' ? 'active' : ''
          } ${disabled ? 'disabled' : ''}`}
          onClick={() => togglePanel('meeting-details')}
        >
          <IoInformationCircle className='call-icon' />
        </button>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
        <button
          disabled={disabled}
          className={`call-icon-wrapper ${audio ? '' : 'active'} ${
            disabled ? 'disabled' : ''
          }`}
          onClick={toggleUserAudio}
        >
          {audio ? (
            <IoMicSharp className='call-icon' />
          ) : (
            <IoMicOffSharp className='call-icon' />
          )}
        </button>
        <button
          disabled={disabled}
          className={`call-icon-wrapper ${video ? '' : 'active'} ${
            disabled ? 'disabled' : ''
          }`}
          onClick={toggleUserVideo}
        >
          {video ? (
            <IoVideocam className='call-icon' />
          ) : (
            <IoVideocamOff className='call-icon' />
          )}
        </button>
        <button
          disabled={disabled}
          className={`call-icon-wrapper hidden lg:block ${
            disabled ? 'disabled' : ''
          }`}
          onClick={toggleScreenShare}
        >
          <MdPresentToAll className='call-icon' />
        </button>
        <Link href='/home'>
          <div className='call-icon-wrapper phn'>
            <IoCall className='call-icon' />
          </div>
        </Link>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
        <button
          disabled={disabled}
          className={`call-icon-wrapper ${
            displayPanel === 'chat' ? 'active' : ''
          } ${disabled ? 'disabled' : ''}`}
          onClick={() => togglePanel('chat')}
        >
          <IoChatboxEllipses className='call-icon' />
        </button>
        <button
          disabled={disabled}
          className={`call-icon-wrapper ${
            displayPanel === 'participants' ? 'active' : ''
          } ${disabled ? 'disabled' : ''}`}
          onClick={() => togglePanel('participants')}
        >
          <IoPeople className='call-icon' />
        </button>
        <button
          disabled={disabled}
          className={`call-icon-wrapper text-gray-200 ${
            displayPanel === 'background' ? 'active' : ''
          } ${disabled ? 'disabled' : ''}`}
          onClick={() => togglePanel('background')}
        >
          <BackgroundIcon height={24} width={24} />
        </button>
      </div>
    </footer>
  );
}
