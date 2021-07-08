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
  IoHandRightSharp,
} from 'react-icons/io5';
import { MdPresentToAll } from 'react-icons/md';
import { BackgroundIcon } from '@/components/CustomIcons/CustomIcons';
import classNames from 'classnames';
import { LocalVideoTrack } from 'twilio-video';

import { useRoomContext } from '@/context/RoomContext';
import { useSocketContext } from '@/context/SocketContext';

export default function CallFooter() {
  const {
    userAudio: audio,
    userVideo: video,
    toggleUserAudio,
    toggleUserVideo,
    togglePanel,
    displayPanel,
    room,
    screenTrack,
    setScreenTrack,
  } = useRoomContext();

  const { usersRaisedHand, toggleRaiseHand, user } = useSocketContext();

  async function toggleScreenShare() {
    // * toggle the user's screen
    if (!screenTrack) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const userScreen = new LocalVideoTrack(stream.getTracks()[0]);
        setScreenTrack(userScreen);
        room.localParticipant.publishTrack(userScreen);
        userScreen.mediaStreamTrack.onended = () => {
          toggleScreenShare();
        };
      } catch (e) {
        console.error(e);
      }
    } else {
      room.localParticipant.unpublishTrack(screenTrack);
      screenTrack.stop();
      setScreenTrack(null);
    }
  }

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (room) setDisabled(false);
  }, [room]);

  return (
    <footer className='h-20 w-full bg-gray-900 flex flex-row items-center justify-around border-t border-gray-950'>
      <div className='flex flex-row space-x-5 sm:space-x-8'>
        {/* CALL INFO */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: displayPanel === 'meeting-details',
            disabled,
          })}
          onClick={() => togglePanel('meeting-details')}
        >
          <IoInformationCircle className='call-icon' />
        </button>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
        {/* USER AUDIO */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: !audio,
            disabled,
          })}
          onClick={toggleUserAudio}
        >
          {audio ? (
            <IoMicSharp className='call-icon' />
          ) : (
            <IoMicOffSharp className='call-icon' />
          )}
        </button>

        {/* USER VIDEO */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: !video,
            disabled,
          })}
          onClick={toggleUserVideo}
        >
          {video ? (
            <IoVideocam className='call-icon' />
          ) : (
            <IoVideocamOff className='call-icon' />
          )}
        </button>

        {/* SHARE SCREEN */}
        <button
          disabled={disabled}
          className={classNames('call-icon-wrapper hidden lg:block', {
            disabled,
          })}
          onClick={toggleScreenShare}
        >
          <MdPresentToAll className='call-icon' />
        </button>

        {/* RAISE HAND */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: user && usersRaisedHand.includes(user.id),
            disabled,
          })}
          onClick={toggleRaiseHand}
        >
          <IoHandRightSharp className='call-icon' />
        </button>

        {/* LEAVE CALL */}
        <a className='call-icon-wrapper phn' href='/dashboard'>
          <IoCall className='call-icon' />
        </a>
      </div>

      <div className='flex flex-row space-x-5 sm:space-x-8'>
        {/* TOGGLE CHAT */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: displayPanel === 'chat',
            disabled,
          })}
          onClick={() => togglePanel('chat')}
        >
          <IoChatboxEllipses className='call-icon' />
        </button>

        {/* TOGGLE PARTICIPANTS */}
        <button
          disabled={disabled}
          className={classNames({
            'call-icon-wrapper': true,
            active: displayPanel === 'participants',
            disabled,
          })}
          onClick={() => togglePanel('participants')}
        >
          <IoPeople className='call-icon' />
        </button>

        {/* BACKGROUND */}
        <button
          disabled={disabled}
          className={classNames(
            'call-icon-wrapper text-gray-200 hidden lg:block',
            {
              active: displayPanel === 'background',
              disabled,
            }
          )}
          onClick={() => togglePanel('background')}
        >
          <BackgroundIcon height={24} width={24} />
        </button>
      </div>
    </footer>
  );
}
