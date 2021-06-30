import React, { useState, useEffect } from 'react';
import { BiLink } from 'react-icons/bi';
import { IoSendSharp, IoCloseOutline } from 'react-icons/io5';

import { formattedTimeString } from 'utils';
import { useRoomCallContext } from '@/context/roomCallContext';

function ChatPanel() {
  const [message, setMessage] = useState(''); // bind this to the input text-box

  const { user, sendMessage, chats, chatPanel, toggleChatPanel } =
    useRoomCallContext();

  return (
    <div
      id='chat-panel'
      className={
        chatPanel
          ? 'flex flex-col bg-gray-900 w-80 border-l border-gray-950'
          : 'hidden'
      }
      style={{ maxHeight: 'calc(100vh - 10rem)' }}
    >
      <div className='bg-gray-800 w-full p-4 flex flex-col space-y-2 border-b-2 border-gray-950'>
        <div className='flex flex-row text-gray-200 justify-between'>
          <p className='font-semibold'>Meeting Chat</p>
          <div className='cursor-pointer' onClick={toggleChatPanel}>
            <IoCloseOutline className='text-gray-200 h-6 w-6' />
          </div>
        </div>
      </div>
      <div
        id='chat-window'
        className='flex-1 text-gray-200 p-3 overflow-y-scroll flex flex-col space-y-2'
      >
        {chats.map((msgData, idx) => (
          <div
            key={idx}
            className='bg-gray-850 rounded py-2 px-3 border-l-2 flex flex-col space-y-1'
            style={{ borderLeftColor: msgData.userColor }}
          >
            <div className='flex flex-row items-center justify-between'>
              <p className='text-base font-semibold'>
                {msgData.userId === user.id
                  ? `${msgData.name} (You)`
                  : `${msgData.name}`}
              </p>
              <p className='text-sm font-light opacity-80'>
                {formattedTimeString()}
              </p>
            </div>
            <p className='text-sm'>{msgData.message}</p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          sendMessage(e, message, user.id, user.name, user.color);
          setMessage('');
        }}
        className='flex flex-row justify-evenly my-3'
      >
        <input
          type='text'
          className='text-box'
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Type your message...'
        />

        <button type='submit' className=''>
          <IoSendSharp className='text-gray-700 hover:text-blue-400 w-6 h-6' />
        </button>
      </form>
    </div>
  );
}

export default ChatPanel;
